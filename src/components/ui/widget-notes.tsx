"use client";

import {
	Plus,
	Trash2,
	Edit3,
	Save,
	X,
	EllipsisVertical,
	Notebook,
} from "lucide-react";
import React, { useState, useCallback } from "react";
import RichTextEditor from "./rich-text-editor";

interface Note {
	id: number;
	title: string;
	content: string;
	timestamp: string;
}

export default function WidgetNotes() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [editingNote, setEditingNote] = useState<number | null>(null);
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("<p></p>");

	// Debounced update for smoother experience
	const debouncedUpdate = useCallback(
		(() => {
			let timeoutId: NodeJS.Timeout;
			return (id: number, updates: Partial<Note>) => {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					setNotes(
						notes.map((note) =>
							note.id === id
								? { ...note, ...updates, timestamp: "Just now" }
								: note
						)
					);
				}, 150);
			};
		})(),
		[notes]
	);

	const addNote = () => {
		if (newNoteTitle.trim() && newNoteContent.trim() !== "<p></p>") {
			const newNote: Note = {
				id: Date.now(),
				title: newNoteTitle,
				content: newNoteContent,
				timestamp: "Just now",
			};
			setNotes([newNote, ...notes]);
			setNewNoteTitle("");
			setNewNoteContent("<p></p>");
			setIsAddingNew(false);
		}
	};

	const deleteNote = (id: number) => {
		setNotes(notes.filter((note) => note.id !== id));
		if (editingNote === id) {
			setEditingNote(null);
		}
	};

	const updateNote = (id: number, updates: Partial<Note>) => {
		// Immediate update for UI responsiveness
		setNotes(
			notes.map((note) =>
				note.id === id ? { ...note, ...updates, timestamp: "Just now" } : note
			)
		);
		// Debounced update for smoother experience
		debouncedUpdate(id, updates);
	};

	const startEditing = (id: number) => {
		setEditingNote(id);
	};

	const stopEditing = () => {
		if (editingNote) {
			setEditingNote(null);
		}
	};

	const startAddingNew = () => {
		setIsAddingNew(true);
		setEditingNote(null);
		setNewNoteTitle("Untitled");
		setNewNoteContent("<p></p>");
	};

	const cancelAddingNew = () => {
		setIsAddingNew(false);
		setNewNoteTitle("");
		setNewNoteContent("<p></p>");
	};

	const renderContent = (content: string) => {
		return (
			<div
				className="ProseMirror max-w-none"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		);
	};

	return (
		<div className="w-full max-w-xl group flex flex-col gap-2 min-w-[550px]">
			<div className="flex justify-between items-center text-base-content/80">
				<span className="font-medium text-lg">Notes</span>
				<button
					className="btn btn-circle btn-sm btn-ghost"
					onClick={startAddingNew}
				>
					<Plus className="size-4" />
				</button>
			</div>
			{/* New note form */}
			{isAddingNew && (
				<div className="w-full card text-base-content/90 overflow-hidden bg-base-100 shadow-xl transition-all ease-out mb-4">
					<div className="flex justify-between p-4">
						<div className="flex items-center gap-2">
							<input
								type="text"
								placeholder="Note title..."
								className="border-b-1 border-base-content/50  outline-base-content/10 focus:outline-0 w-32"
								value={newNoteTitle}
								onChange={(e) => setNewNoteTitle(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && e.shiftKey) {
										e.preventDefault();
										addNote();
									}
								}}
							/>
						</div>
						<div className="flex gap-2">
							<button
								className="btn btn-sm btn-ghost"
								onClick={addNote}
								disabled={
									!newNoteTitle.trim() || newNoteContent.trim() === "<p></p>"
								}
							>
								Add
								<kbd className="ml-2 kbd kbd-xs">shift</kbd>+
								<kbd className="kbd kbd-xs">enter</kbd>
							</button>
							<button
								className="btn btn-ghost btn-sm btn-circle"
								onClick={cancelAddingNew}
							>
								<X className="size-3" />
							</button>
						</div>
					</div>

					<RichTextEditor
						content={newNoteContent}
						onChange={setNewNoteContent}
						className="h-fit "
						autoFocus={true}
						onKeyDown={(e) => {
							if (e.key === "Enter" && e.shiftKey) {
								e.preventDefault();
								addNote();
							}
						}}
					/>
				</div>
			)}{" "}
			{/* Note list */}
			<div className="flex flex-col gap-4 rounded-box max-h-[900px] overflow-y-auto">
				{notes.length === 0 && !isAddingNew ? (
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
						<button onClick={startAddingNew} className="btn btn-sm gap-2">
							<Plus className="size-4" />
							Create your first note
						</button>
					</div>
				) : (
					notes.map((note) => (
						<div
							key={note.id}
							className={`w-full card text-base-content/90 bg-base-100 p-4 shadow-xl transition-all ease-out group ${
								editingNote === note.id ? "shadow-xs" : "cursor-pointer"
							}`}
							onClick={() => {
								// Only handle clicks when not in editing mode
								if (editingNote !== note.id) {
									// Handle note selection or other actions here if needed
								}
							}}
						>
							{editingNote === note.id ? (
								// Editing mode - same interface as adding new note
								<>
									<div className="flex justify-between p-4 -m-4 mb-4">
										<div className="flex items-center gap-2">
											<input
												type="text"
												placeholder="Note title..."
												className="border-b-1 border-base-content/50 outline-base-content/10 focus:outline-0 w-32"
												value={note.title}
												onChange={(e) =>
													updateNote(note.id, { title: e.target.value })
												}
												onKeyDown={(e) => {
													if (e.key === "Enter" && e.shiftKey) {
														e.preventDefault();
														stopEditing();
													}
												}}
											/>
										</div>
										<div className="flex gap-2">
											<button
												className="btn btn-sm btn-ghost"
												onClick={stopEditing}
												disabled={
													!note.title.trim() ||
													note.content.trim() === "<p></p>"
												}
											>
												Save
												<kbd className="ml-2 kbd kbd-xs">shift</kbd>+
												<kbd className="kbd kbd-xs">enter</kbd>
											</button>
											<button
												className="btn btn-ghost btn-sm btn-circle"
												onClick={() => {
													setEditingNote(null);
												}}
											>
												<X className="size-3" />
											</button>
										</div>
									</div>

									<RichTextEditor
										content={note.content}
										onChange={(content) => updateNote(note.id, { content })}
										className="h-fit -m-4"
										autoFocus={true}
										onKeyDown={(e) => {
											if (e.key === "Enter" && e.shiftKey) {
												e.preventDefault();
												stopEditing();
											}
										}}
									/>
								</>
							) : (
								// Read mode
								<>
									{/* Note header with title, time, and actions */}
									<div
										className={`flex ${
											note.title ? "justify-between" : "justify-end"
										} text-base-content/50 items-center mb-3`}
									>
										{note.title && (
											<span className="badge badge-sm badge-ghost">
												{note.title}
											</span>
										)}
										<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<p className="text-xs">{note.timestamp}</p>
											<button
												className="btn btn-sm btn-ghost btn-circle"
												onClick={(e) => {
													e.stopPropagation();
													startEditing(note.id);
												}}
												title="Edit note"
											>
												<Edit3 className="size-3" />
											</button>
											<button
												className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/20"
												onClick={(e) => {
													e.stopPropagation();
													deleteNote(note.id);
												}}
												title="Delete note"
											>
												<Trash2 className="size-3" />
											</button>
										</div>
									</div>

									{/* Note content */}
									<div className="h-fit">{renderContent(note.content)}</div>
								</>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}
