"use client";

import { Plus, Trash2, Edit3, X, Notebook, Ellipsis } from "lucide-react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ContextMenuEditor from "./context-menu-editor";
import { ScrollArea } from "./scroll-area";
import { mockNotes, type Note } from "../../data/mockNotes";

export default function WidgetNotes() {
	const [notes, setNotes] = useState<Note[]>(mockNotes);
	const [editingNote, setEditingNote] = useState<number | null>(null);
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("<p></p>");
	const [originalNote, setOriginalNote] = useState<Note | null>(null);
	const [addErrors, setAddErrors] = useState<{
		title?: string;
		content?: string;
	}>({});
	const [editErrors, setEditErrors] = useState<
		Record<number, { title?: string; content?: string }>
	>({});

	// Refs for click-outside detection & focus management
	const addNoteRef = useRef<HTMLDivElement>(null);
	const editNoteRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
	const addTitleInputRef = useRef<HTMLInputElement>(null);
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Debounced update for smoother experience (functional to avoid stale closures)
	const debouncedUpdate = useCallback((id: number, updates: Partial<Note>) => {
		if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
		updateTimeoutRef.current = setTimeout(() => {
			setNotes((prev) =>
				prev.map((note) =>
					note.id === id ? { ...note, ...updates, timestamp: "Just now" } : note
				)
			);
		}, 150);
	}, []);

	const addNote = () => {
		const titleValid = newNoteTitle.trim().length > 0;
		const contentValid = newNoteContent.trim() !== "<p></p>";
		if (!titleValid || !contentValid) {
			setAddErrors({
				title: titleValid ? undefined : "Title is required",
				content: contentValid ? undefined : "Content is required",
			});
			// Focus first error
			if (!titleValid) {
				addTitleInputRef.current?.focus();
			}
			return;
		}
		const newNote: Note = {
			id: Date.now(),
			title: newNoteTitle,
			content: newNoteContent,
			timestamp: "Just now",
		};
		setNotes((prev) => [newNote, ...prev]);
		setIsAddingNew(false);
		setNewNoteTitle("");
		setNewNoteContent("<p></p>");
		setAddErrors({});
	};

	const deleteNote = (id: number) => {
		setNotes((prev) => prev.filter((note) => note.id !== id));
		if (editingNote === id) {
			setEditingNote(null);
			setOriginalNote(null);
		}
	};

	const updateNote = (id: number, updates: Partial<Note>) => {
		// Immediate update for UI responsiveness
		setNotes((prev) =>
			prev.map((note) =>
				note.id === id ? { ...note, ...updates, timestamp: "Just now" } : note
			)
		);
		// Debounced update for smoother experience
		debouncedUpdate(id, updates);
	};

	const startEditing = (id: number) => {
		const noteToEdit = notes.find((note) => note.id === id);
		if (noteToEdit) {
			setOriginalNote({ ...noteToEdit });
			setEditingNote(id);
		}
	};

	const stopEditing = () => {
		if (editingNote) {
			setEditingNote(null);
			setOriginalNote(null);
		}
	};

	const saveEditing = (note: Note) => {
		const titleValid = note.title.trim().length > 0;
		const contentValid = note.content.trim() !== "<p></p>";
		if (!titleValid || !contentValid) {
			setEditErrors((prev) => ({
				...prev,
				[note.id]: {
					title: titleValid ? undefined : "Title is required",
					content: contentValid ? undefined : "Content is required",
				},
			}));
			// Focus first invalid field inside the edit card
			const container = editNoteRefs.current[note.id] ?? undefined;
			if (container) {
				const titleInput =
					container.querySelector<HTMLInputElement>("input[type='text']");
				if (!titleValid) titleInput?.focus();
			}
			return;
		}
		setEditErrors((prev) => ({ ...prev, [note.id]: {} }));
		stopEditing();
	};

	const cancelEditing = () => {
		if (editingNote && originalNote) {
			// Revert the note to its original state
			setNotes((prev) =>
				prev.map((note) => (note.id === editingNote ? originalNote : note))
			);
			setEditingNote(null);
			setOriginalNote(null);
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
		setAddErrors({});
	};

	// Global escape key handler
	useEffect(() => {
		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (isAddingNew) {
					event.preventDefault();
					cancelAddingNew();
				} else if (editingNote !== null) {
					event.preventDefault();
					cancelEditing();
				}
			}
		};

		// Only add listener when we're in adding or editing mode
		if (isAddingNew || editingNote !== null) {
			document.addEventListener("keydown", handleGlobalKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, [isAddingNew, editingNote]);

	// Autofocus the add title input when starting a new note (desktop-only behavior is fine here)
	useEffect(() => {
		if (isAddingNew) {
			addTitleInputRef.current?.focus();
		}
	}, [isAddingNew]);

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// Check if clicking outside add note form
			if (
				isAddingNew &&
				addNoteRef.current &&
				!addNoteRef.current.contains(target)
			) {
				cancelAddingNew();
			}

			// Check if clicking outside edit note form
			if (
				editingNote !== null &&
				editNoteRefs.current[editingNote] &&
				!editNoteRefs.current[editingNote]?.contains(target)
			) {
				cancelEditing();
			}
		};

		// Only add listener when we're in adding or editing mode
		if (isAddingNew || editingNote !== null) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isAddingNew, editingNote]);

	const renderContent = (content: string) => {
		return (
			<ContextMenuEditor
				content={content}
				onChange={() => {}} // No-op for read mode
				editable={false}
				className="h-fit -m-4"
			/>
		);
	};

	return (
		<div className="group flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden">
			<div className="flex justify-between items-center text-base-content/80 group">
				<div className="flex gap-2 items-center justify-center w-fit ">
					<span className="font-medium">Notes</span>
					<button
						className="btn btn-xs btn-circle btn-ghost invisible group-hover:visible"
						type="button"
						aria-label="More note actions"
						title="More note actions"
					>
						<Ellipsis className="size-4" />
					</button>
				</div>
				<button
					className={`btn btn-circle btn-sm ${
						isAddingNew || editingNote !== null
							? "btn-ghost opacity-50"
							: "btn-ghost"
					}`}
					onClick={startAddingNew}
					disabled={isAddingNew || editingNote !== null}
					title={
						isAddingNew || editingNote !== null
							? "Finish current note first"
							: "Add new note"
					}
					type="button"
					aria-label="Add new note"
				>
					<Plus className="size-3" />
				</button>
			</div>
			{/* New note form */}
			{isAddingNew && (
				<div
					ref={addNoteRef}
					className="w-full card text-base-content/90 overflow-hidden bg-card border-border shadow-xs"
				>
					<div className="flex justify-between p-4">
						<div className="flex items-center gap-2">
							<input
								type="text"
								placeholder="Note title..."
								className="border-base-content/50  outline-base-content/10 focus:outline-0 w-32"
								value={newNoteTitle}
								onChange={(e) => {
									setNewNoteTitle(e.target.value);
									if (addErrors.title)
										setAddErrors((prev) => ({ ...prev, title: undefined }));
								}}
								ref={addTitleInputRef}
								name="note-title"
								autoComplete="off"
								aria-label="Note title"
								aria-invalid={!!addErrors.title}
								aria-describedby={
									addErrors.title ? "add-title-error" : undefined
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" && e.shiftKey) {
										e.preventDefault();
										addNote();
									} else if (e.key === "Escape") {
										e.preventDefault();
										cancelAddingNew();
									}
								}}
							/>
						</div>
						<div className="flex gap-2">
							<button
								className="btn btn-sm btn-ghost"
								onClick={addNote}
								type="button"
								aria-label="Add note"
							>
								Add
								<kbd className="ml-2 kbd kbd-xs">shift</kbd>+
								<kbd className="kbd kbd-xs">enter</kbd>
							</button>
							<button
								className="btn btn-ghost btn-sm btn-circle"
								onClick={cancelAddingNew}
								type="button"
								aria-label="Cancel adding note"
							>
								<X className="size-3" />
							</button>
						</div>
					</div>

					{(addErrors.title || addErrors.content) && (
						<div
							className="px-4 text-xs text-error"
							role="status"
							aria-live="polite"
						>
							{addErrors.title && <p id="add-title-error">{addErrors.title}</p>}
							{addErrors.content && <p>{addErrors.content}</p>}
						</div>
					)}

					<ContextMenuEditor
						content={newNoteContent}
						onChange={(val) => {
							setNewNoteContent(val);
							if (addErrors.content)
								setAddErrors((prev) => ({ ...prev, content: undefined }));
						}}
						className="h-fit"
						autoFocus={true}
						onKeyDown={(e) => {
							if (e.key === "Enter" && e.shiftKey) {
								e.preventDefault();
								addNote();
							} else if (e.key === "Escape") {
								e.preventDefault();
								cancelAddingNew();
							}
						}}
					/>
				</div>
			)}{" "}
			{/* Note list */}
			<ScrollArea className="flex-1 min-h-0">
				<div
					className={`flex flex-col gap-4 rounded-box pr-2 transition-all duration-300 overflow-x-hidden ${
						editingNote !== null || isAddingNew ? "relative" : ""
					}`}
				>
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
								ref={(el) => {
									if (editingNote === note.id) {
										editNoteRefs.current[note.id] = el;
									}
								}}
								className={`w-full border-border shadow-xs card text-base-content/90 p-4 transition-all ease-out group ${
									editingNote === note.id
										? "bg-card"
										: editingNote !== null || isAddingNew
										? "bg-card opacity-40"
										: "bg-card"
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
										<div className="flex justify-between p-4 -m-4 mb-3">
											<div className="flex items-center gap-2">
												<input
													type="text"
													placeholder="Note title..."
													className="border-b-1  border-base-content/50 outline-base-content/10 focus:outline-0 w-32"
													value={note.title}
													onChange={(e) =>
														updateNote(note.id, { title: e.target.value })
													}
													name={`note-title-${note.id}`}
													autoComplete="off"
													aria-label="Note title"
													aria-invalid={!!editErrors[note.id]?.title}
													aria-describedby={
														editErrors[note.id]?.title
															? `edit-title-error-${note.id}`
															: undefined
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" && e.shiftKey) {
															e.preventDefault();
															saveEditing(note);
														} else if (e.key === "Escape") {
															e.preventDefault();
															cancelEditing();
														}
													}}
												/>
											</div>
											<div className="flex gap-2">
												<button
													className="btn btn-sm btn-ghost"
													onClick={() => saveEditing(note)}
													type="button"
													aria-label="Save note"
												>
													Save
													<kbd className="ml-2 kbd kbd-xs">shift</kbd>+
													<kbd className="kbd kbd-xs">enter</kbd>
												</button>
												<button
													className="btn btn-ghost btn-sm btn-circle"
													onClick={cancelEditing}
													type="button"
													aria-label="Cancel editing note"
												>
													<X className="size-3" />
												</button>
											</div>
										</div>

										{(editErrors[note.id]?.title ||
											editErrors[note.id]?.content) && (
											<div
												className="-mt-2 mb-2 text-xs text-error"
												role="status"
												aria-live="polite"
											>
												{editErrors[note.id]?.title && (
													<p id={`edit-title-error-${note.id}`}>
														{editErrors[note.id]?.title}
													</p>
												)}
												{editErrors[note.id]?.content && (
													<p>{editErrors[note.id]?.content}</p>
												)}
											</div>
										)}

										<ContextMenuEditor
											content={note.content}
											onChange={(content) => updateNote(note.id, { content })}
											className="h-fit -m-4"
											autoFocus={true}
											onKeyDown={(e) => {
												if (e.key === "Enter" && e.shiftKey) {
													e.preventDefault();
													saveEditing(note);
												} else if (e.key === "Escape") {
													e.preventDefault();
													cancelEditing();
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
												<span className="badge badge-sm rounded-sm">
													{note.title}
												</span>
											)}
											<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<p className="text-xs">{note.timestamp}</p>
												<button
													className="btn btn-sm btn-ghost btn-square"
													onClick={(e) => {
														e.stopPropagation();
														startEditing(note.id);
													}}
													title="Edit note"
													aria-label="Edit note"
													type="button"
												>
													<Edit3 className="size-3" />
												</button>
												<button
													className="btn btn-sm btn-ghost btn-square text-error hover:bg-error/20"
													onClick={(e) => {
														e.stopPropagation();
														deleteNote(note.id);
													}}
													title="Delete note"
													aria-label="Delete note"
													type="button"
												>
													<Trash2 className="size-3" />
												</button>
											</div>
										</div>

										{/* Note content */}
										<div className="h-fit break-words">
											{renderContent(note.content)}
										</div>
									</>
								)}
							</div>
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
