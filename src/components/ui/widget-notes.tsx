"use client";

import { Plus, Trash2, Notebook } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useAuthUser } from "@/src/hooks/useAuthUser";
import { guestStorage } from "@/src/lib/guestStorage";

const MilkdownEditor = dynamic(() => import("./milkdown-editor"), {
	ssr: false,
});

interface Note {
	id: number;
	title: string;
	content: string;
	timestamp: string;
	_clientId?: string; // Stable client-side ID for React keys
}

export default function WidgetNotes() {
	const { isGuest } = useAuthUser();
	const [notes, setNotes] = useState<Note[] | null>(() => {
		if (typeof window !== "undefined") {
			try {
				const cached = localStorage.getItem("notes-cache");
				if (cached) {
					const parsed = JSON.parse(cached);
					if (Array.isArray(parsed)) {
						// Ensure cached notes have client IDs
						return parsed.map((note: Note) => ({
							...note,
							_clientId: note._clientId || crypto.randomUUID(),
						}));
					}
				}
			} catch {}
		}
		return null;
	});
	const [loading, setLoading] = useState(() => notes === null);
	const [newlyCreatedNoteId, setNewlyCreatedNoteId] = useState<number | null>(
		null
	);
	const [savingNotes, setSavingNotes] = useState<Set<number>>(new Set());
	const [saveStatus, setSaveStatus] = useState<
		Map<number, "saved" | "saving" | "error" | "pending">
	>(new Map());
	const updateTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
	const newlyCreatedNoteIdRef = useRef<number | null>(null);

	// Keep ref in sync with state
	useEffect(() => {
		newlyCreatedNoteIdRef.current = newlyCreatedNoteId;
	}, [newlyCreatedNoteId]);

	// Restore unsaved note ID from cache on initial load and trigger save
	const hasRestoredRef = useRef(false);
	const pendingSaveRef = useRef<{ id: number; content: string } | null>(null);
	useEffect(() => {
		if (notes !== null && !hasRestoredRef.current) {
			const unsavedNote = notes.find((n) => n.id > 1000000000000);
			if (unsavedNote && unsavedNote.content) {
				setNewlyCreatedNoteId(unsavedNote.id);
				// Store for triggering save after component is ready
				pendingSaveRef.current = {
					id: unsavedNote.id,
					content: unsavedNote.content,
				};
			}
			hasRestoredRef.current = true;
		}
	}, [notes]); // Run when notes are loaded

	// Extract title from markdown content (first heading)
	const extractTitle = (content: string): string => {
		const match = content.match(/^#\s+(.+)$/m);
		return match ? match[1].trim() : "Untitled";
	};

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

	// Generate idempotency key
	const generateIdempotencyKey = (prefix: string) => {
		try {
			return `${prefix}-${crypto.randomUUID()}`;
		} catch {
			return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		}
	};

	// Ensure all notes have client IDs
	const ensureClientIds = (notes: Note[]): Note[] => {
		return notes.map((note) => ({
			...note,
			_clientId: note._clientId || crypto.randomUUID(),
		}));
	};

	// Initial fetch - load from cache first, then sync with server
	useEffect(() => {
		(async () => {
			// If we have cached data, we're already not loading
			if (notes !== null) {
				setLoading(false);
			}

			try {
				const data = isGuest
					? guestStorage.getNotes()
					: await (async () => {
							const res = await fetch("/api/notes");
							if (!res.ok)
								throw new Error(
									(await res.json()).error || "Failed to load notes"
								);
							return await res.json();
					  })();

				// Merge server data with local unsaved notes
				setNotes((current) => {
					// Create a normalized version of current data for comparison (without _clientId)
					const currentNormalized =
						current?.map(({ _clientId, ...note }: Note) => note) ?? [];
					const dataNormalized = data.map(
						({ _clientId, ...note }: Note) => note
					);

					// Compare normalized data to avoid false positives from _clientId differences
					if (
						JSON.stringify(currentNormalized) !== JSON.stringify(dataNormalized)
					) {
						// Preserve existing client IDs when syncing
						const currentMap = new Map(
							current?.map((n) => [n.id, n._clientId]) ?? []
						);

						const syncedNotes = data.map((note: Note) => ({
							...note,
							_clientId: currentMap.get(note.id) || crypto.randomUUID(),
						}));

						// Preserve unsaved notes (notes with temp timestamp IDs)
						// Database IDs are typically small integers, temp IDs are timestamps (13 digits)
						const unsavedNotes =
							current?.filter((n) => n.id > 1000000000000) ?? [];

						// Deduplicate by ID - unsaved notes take priority over synced notes
						const seenIds = new Set<number>();
						const result: Note[] = [];

						// Add unsaved notes first
						unsavedNotes.forEach((note) => {
							if (!seenIds.has(note.id)) {
								seenIds.add(note.id);
								result.push(note);
							}
						});

						// Add synced notes that aren't already present
						syncedNotes.forEach((note: Note) => {
							if (!seenIds.has(note.id)) {
								seenIds.add(note.id);
								result.push(note);
							}
						});

						return result;
					}
					return current;
				});
			} catch (e: any) {
				// Only show error if we don't have cached data
				if (notes === null) {
					toast.error(e.message || "Failed to load notes");
				}
			} finally {
				setLoading(false);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Persist notes to cache whenever they change (only when non-null)
	// Use requestIdleCallback for non-blocking writes
	useEffect(() => {
		if (notes === null) return;

		const saveToCache = () => {
			try {
				localStorage.setItem("notes-cache", JSON.stringify(notes));
			} catch (error) {
				console.warn("Failed to cache notes:", error);
			}
		};

		// Use requestIdleCallback if available, otherwise setTimeout
		if (typeof requestIdleCallback !== "undefined") {
			requestIdleCallback(saveToCache);
		} else {
			setTimeout(saveToCache, 0);
		}
	}, [notes]);

	// Add new note (local only until user types)
	const addNote = async () => {
		// Prevent creating multiple notes if one is already being created
		if (newlyCreatedNoteId !== null) {
			return;
		}

		// Generate a stable client ID for React key
		const clientId = crypto.randomUUID();
		const tempId = Date.now();

		const newNote: Note = {
			id: tempId,
			title: "Untitled",
			content: "", // Start with empty content for auto-focus
			timestamp: "Just now",
			_clientId: clientId,
		};

		// Add to local state immediately
		setNotes((prev) => [newNote, ...(prev ?? [])]);
		setNewlyCreatedNoteId(tempId);

		// Note will be created in database when user types content (via updateNote)
		if (isGuest) {
			// Persist guest notes immediately
			try {
				guestStorage.setNotes([newNote, ...(notes ?? [])]);
			} catch {}
		}
	};

	// Delete note with optimistic update
	const deleteNote = async (id: number, title: string) => {
		if (
			!confirm(
				`Are you sure you want to delete "${title}"? This action cannot be undone.`
			)
		) {
			return;
		}

		const isNewNote = newlyCreatedNoteId === id;
		const isTempNote = id > 1000000000000; // Temp notes have timestamp IDs
		const previous = notes;

		// Optimistic update - remove immediately from UI and persist in guest mode
		const nextList = (previous ?? []).filter((note) => note.id !== id);
		setNotes(nextList);
		if (isGuest) {
			try {
				guestStorage.setNotes(nextList);
			} catch {}
		}

		// If it's a new note or temp note that hasn't been saved, just clear the flag
		if (isNewNote || isTempNote) {
			setNewlyCreatedNoteId(null);
			return;
		}

		if (isGuest) {
			// already persisted above
			return;
		}
		// Delete from server with retry
		const deleteWithRetry = async (retryCount = 0) => {
			try {
				const res = await fetch(`/api/notes/${id}`, {
					method: "DELETE",
					headers: {
						"Idempotency-Key": generateIdempotencyKey(`notes:delete:${id}`),
					},
				});

				if (!res.ok) throw new Error("Failed to delete note");
			} catch (e: any) {
				if (retryCount < 2) {
					// Retry silently
					setTimeout(
						() => deleteWithRetry(retryCount + 1),
						1000 * (retryCount + 1)
					);
				} else {
					// Final failure - show error and rollback
					toast.error(e.message || "Failed to delete note");
					setNotes(previous);
				}
			}
		};

		deleteWithRetry();
	};

	// Update note with debouncing and retry logic
	const updateNote = (id: number, content: string) => {
		const title = extractTitle(content);
		const isNewNote = newlyCreatedNoteId === id;

		// Update UI immediately
		setNotes((prev) =>
			(prev ?? []).map((note) =>
				note.id === id
					? { ...note, content, title, timestamp: "Just now" }
					: note
			)
		);

		// Mark as pending save
		setSaveStatus((prev) => new Map(prev).set(id, "pending"));

		// Clear existing timeout for this note
		const existingTimeout = updateTimeoutsRef.current.get(id);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
			updateTimeoutsRef.current.delete(id);
		}

		// Debounce backend save with retry
		const saveWithRetry = async (retryCount = 0) => {
			// Check if this is still a new note (use ref to get current value)
			const isStillNewNote = newlyCreatedNoteIdRef.current === id;

			// Mark as saving
			setSavingNotes((prev) => new Set(prev).add(id));
			setSaveStatus((prev) => new Map(prev).set(id, "saving"));

			try {
				if (isGuest) {
					// Guest mode: persist locally only
					setSaveStatus((prev) => new Map(prev).set(id, "saved"));
					try {
						const next = (prev: Note[] | null) =>
							(prev ?? []).map((n) =>
								n.id === id
									? { ...n, content, title, timestamp: "Just now" }
									: n
							);
						const current = next(notes);
						guestStorage.setNotes(current);
					} catch {}
					return;
				} else if (isStillNewNote) {
					// Create new note in database
					const res = await fetch("/api/notes", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Idempotency-Key": generateIdempotencyKey("notes:create"),
						},
						body: JSON.stringify({ title, content }),
					});

					if (!res.ok) {
						const errorData = await res.json().catch(() => ({}));
						throw new Error(errorData.error || "Failed to create note");
					}

					const data = await res.json();

					// Update the temp note with server data, preserving client ID
					setNotes((prev) =>
						(prev ?? []).map((n) =>
							n.id === id ? { ...data, _clientId: n._clientId } : n
						)
					);

					// Update the saving state to use the real ID
					setSavingNotes((prev) => {
						const newSet = new Set(prev);
						newSet.delete(id); // Remove temp ID
						newSet.delete(data.id); // Also clear real ID if it was there
						return newSet;
					});

					// Clear the newly created flag
					setNewlyCreatedNoteId(null);

					// Mark as saved
					setSaveStatus((prev) => new Map(prev).set(id, "saved"));
				} else {
					// Update existing note
					const res = await fetch(`/api/notes/${id}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Idempotency-Key": generateIdempotencyKey(`notes:update:${id}`),
						},
						body: JSON.stringify({ content, title }),
					});

					if (!res.ok) throw new Error("Failed to update note");

					// Remove from saving state
					setSavingNotes((prev) => {
						const newSet = new Set(prev);
						newSet.delete(id);
						return newSet;
					});

					// Mark as saved
					setSaveStatus((prev) => new Map(prev).set(id, "saved"));
				}
			} catch (e: any) {
				// Retry up to 2 times for network issues
				if (retryCount < 2) {
					setTimeout(
						() => saveWithRetry(retryCount + 1),
						1000 * (retryCount + 1)
					);
				} else {
					toast.error("Failed to save note");
					setSaveStatus((prev) => new Map(prev).set(id, "error"));
				}
			} finally {
				// Final cleanup - remove from saving state
				setSavingNotes((prev) => {
					const newSet = new Set(prev);
					newSet.delete(id);
					return newSet;
				});
			}
		};

		const timeout = setTimeout(() => {
			// Clean up the timeout from the map when it fires
			updateTimeoutsRef.current.delete(id);
			saveWithRetry();
		}, 10000); // 10 seconds debounce
		updateTimeoutsRef.current.set(id, timeout);
	};

	// Trigger save for restored unsaved notes after component is ready
	useEffect(() => {
		if (pendingSaveRef.current && !loading) {
			const { id, content } = pendingSaveRef.current;
			// Trigger save after a short delay to ensure component is fully mounted
			setTimeout(() => {
				updateNote(id, content);
			}, 500);
			pendingSaveRef.current = null;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]); // Trigger when loading completes

	// Background sync - periodically sync with server when tab is visible
	useEffect(() => {
		if (typeof window === "undefined") return;

		const syncWithServer = async () => {
			if (document.hidden || !notes) return;

			try {
				const data = isGuest
					? guestStorage.getNotes()
					: await (async () => {
							const res = await fetch("/api/notes");
							if (!res.ok) return null;
							return await res.json();
					  })();
				if (!data) return;

				// Update if server has newer data
				setNotes((current) => {
					if (!current || JSON.stringify(current) !== JSON.stringify(data)) {
						// Preserve existing client IDs when syncing
						const currentMap = new Map(
							current?.map((n) => [n.id, n._clientId]) ?? []
						);

						const syncedNotes = data.map((note: Note) => ({
							...note,
							_clientId: currentMap.get(note.id) || crypto.randomUUID(),
						}));

						// Preserve ALL unsaved notes (notes with temp timestamp IDs)
						// Database IDs are typically small integers, temp IDs are timestamps (13 digits)
						const unsavedNotes =
							current?.filter((n) => n.id > 1000000000000) ?? [];

						if (unsavedNotes.length > 0) {
							// Merge: unsaved notes first, then synced notes
							return [...unsavedNotes, ...syncedNotes];
						}

						return syncedNotes;
					}
					return current;
				});
			} catch (error) {
				// Silent sync failures - no need to log
			}
		};

		// Sync every 30 seconds when tab is visible
		const interval = setInterval(syncWithServer, 30000);

		// Sync when tab becomes visible
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				syncWithServer();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			// Don't clear timeouts here - let them complete naturally
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notes]); // newlyCreatedNoteId accessed via ref

	// Cleanup timeouts only on component unmount
	useEffect(() => {
		return () => {
			updateTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			updateTimeoutsRef.current.clear();
		};
	}, []); // Only run on unmount

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
				{loading && notes === null ? (
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
