"use client";

import { Plus, Trash2, Notebook } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useNotes, type Note } from "@/src/hooks/useNotes";

const MilkdownEditor = dynamic(() => import("./milkdown-editor"), {
	ssr: false,
});

export default function WidgetNotes() {
	const {
		notes,
		isLoading,
		createNote,
		updateNote: updateNoteMutation,
		deleteNote: deleteNoteMutation,
	} = useNotes();

	const [newlyCreatedNoteId, setNewlyCreatedNoteId] = useState<number | null>(
		null
	);

	// Local state to track saving status for UI feedback (debouncing + mutation)
	const [saveStatus, setSaveStatus] = useState<
		Map<number, "saved" | "saving" | "error" | "pending">
	>(new Map());

	const updateTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
	const newlyCreatedNoteIdRef = useRef<number | null>(null);

	// Keep ref in sync with state
	useEffect(() => {
		newlyCreatedNoteIdRef.current = newlyCreatedNoteId;
	}, [newlyCreatedNoteId]);

	// Get status icon and color for save status
	const getStatusIcon = (noteId: number) => {
		const status = saveStatus.get(noteId);

		switch (status) {
			case "saving":
				return (
					<div
						className="size-1.5 rounded-full bg-base-content/40 animate-pulse"
						title="Saving..."
					/>
				);
			case "saved":
				return (
					<div
						className="size-1.5 rounded-full bg-base-content/60"
						title="Saved"
					/>
				);
			case "error":
				return (
					<div
						className="size-1.5 rounded-full bg-error/60"
						title="Save failed"
					/>
				);
			case "pending":
				return (
					<div
						className="size-1.5 rounded-full bg-base-content/30 animate-pulse"
						title="Pending save..."
					/>
				);
			default:
				return null;
		}
	};

	// Add new note
	const addNote = async () => {
		if (newlyCreatedNoteId !== null) return;

		const tempId = Date.now();
		const clientId = crypto.randomUUID();

		// Optimistically set focus
		setNewlyCreatedNoteId(tempId);

		try {
			await createNote({
				title: "Untitled",
				content: "",
				tempId,
				_clientId: clientId,
			});
		} catch (error) {
			setNewlyCreatedNoteId(null);
		}
	};

	// Delete note
	const deleteNote = async (id: number, title: string) => {
		if (
			!confirm(
				`Are you sure you want to delete "${title}"? This action cannot be undone.`
			)
		) {
			return;
		}

		if (newlyCreatedNoteId === id) {
			setNewlyCreatedNoteId(null);
		}

		try {
			await deleteNoteMutation(id);
		} catch (error) {
			// Error handled in hook (toast)
		}
	};

	// Update note with debouncing
	const updateNote = (id: number, content: string) => {
		// Mark as pending save locally
		setSaveStatus((prev) => new Map(prev).set(id, "pending"));

		// Clear existing timeout
		const existingTimeout = updateTimeoutsRef.current.get(id);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
			updateTimeoutsRef.current.delete(id);
		}

		const save = async () => {
			setSaveStatus((prev) => new Map(prev).set(id, "saving"));
			try {
				await updateNoteMutation({ id, content });
				setSaveStatus((prev) => new Map(prev).set(id, "saved"));

				// If this was the newly created note, clear the flag after successful save
				if (newlyCreatedNoteIdRef.current === id) {
					setNewlyCreatedNoteId(null);
				}
			} catch (error) {
				setSaveStatus((prev) => new Map(prev).set(id, "error"));
			}
		};

		const timeout = setTimeout(() => {
			updateTimeoutsRef.current.delete(id);
			save();
		}, 2000); // 2 seconds debounce (reduced from 10s for better responsiveness with React Query)
		updateTimeoutsRef.current.set(id, timeout);
	};

	// Cleanup timeouts
	useEffect(() => {
		return () => {
			updateTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			updateTimeoutsRef.current.clear();
		};
	}, []);

	return (
		<div className="flex h-full w-full flex-col gap-3 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between">
				<span className="text-lg font-medium text-base-content/80">Notes</span>
				<button
					className="btn btn-circle btn-sm btn-ghost"
					onClick={addNote}
					type="button"
					aria-label="Add new note"
					title="Add new note"
				>
					<Plus className="size-4" />
				</button>
			</div>

			{/* Notes list */}
			<div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden pr-2">
				{isLoading ? (
					// Loading skeleton
					<>
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="card bg-base-200 shadow-sm p-3 flex flex-col gap-2"
							>
								<div className="skeleton h-4 w-24" />
								<div className="skeleton h-20 w-full" />
							</div>
						))}
					</>
				) : (notes?.length ?? 0) === 0 ? (
					// Empty state
					<div className="flex flex-col items-center justify-center py-12 px-6 text-center">
						<div className="size-16 mb-6 rounded-full bg-base-200 flex items-center justify-center">
							<Notebook className="size-6 text-base-content/35" />
						</div>
						<h3 className="text-lg font-semibold text-base-content/80 mb-2">
							No notes yet
						</h3>
						<p className="text-base-content/60 mb-6 max-w-sm">
							Start capturing your thoughts, ideas, and important information.
							Create your first note to get started.
						</p>
						<button onClick={addNote} className="btn btn-sm gap-2">
							<Plus className="size-4" />
							Create your first note
						</button>
					</div>
				) : (
					// Notes
					(notes ?? []).map((note) => (
						<div
							key={`note-${note._clientId || note.id}`}
							className="card bg-base-200 shadow-sm relative group"
						>
							{/* Note header */}
							<div className="card-body p-3 pb-2">
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2 min-w-0">
										<h3
											className="text-sm font-medium text-base-content/90 truncate max-w-[200px]"
											title={note.title}
										>
											{note.title}
										</h3>
										<span className="text-xs text-base-content/50 flex-shrink-0 flex items-center gap-1">
											{note.timestamp}
											{getStatusIcon(note.id)}
										</span>
									</div>
									{/* Delete button - shown on hover */}
									<button
										className="btn btn-xs btn-ghost btn-square opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
										onClick={() => deleteNote(note.id, note.title)}
										title="Delete note"
										aria-label="Delete note"
										type="button"
									>
										<Trash2 className="size-3 text-error" />
									</button>
								</div>
							</div>

							{/* Editor container */}
							<div className="px-3 pb-3">
								<MilkdownEditor
									content={note.content}
									onChange={(content) => updateNote(note.id, content)}
									className="min-h-[120px]"
									autoFocus={newlyCreatedNoteId === note.id}
									placeholder="Start writing..."
								/>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
