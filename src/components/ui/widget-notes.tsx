"use client";

import { Plus, Trash2, Edit3, X, Notebook, Ellipsis } from "lucide-react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import ContextMenuEditor from "./context-menu-editor";
import { mockNotes, type Note } from "../../data/mockNotes";

export default function WidgetNotes() {
	const [notes, setNotes] = useState<Note[]>(mockNotes);
	const [editingNote, setEditingNote] = useState<number | null>(null);
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("<p></p>");
	const [originalNote, setOriginalNote] = useState<Note | null>(null);

	// Refs for click-outside detection
	const addNoteRef = useRef<HTMLDivElement>(null);
	const editNoteRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

	const cancelEditing = () => {
		if (editingNote && originalNote) {
			// Revert the note to its original state
			setNotes(
				notes.map((note) => (note.id === editingNote ? originalNote : note))
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
		<div className="w-full min-w-lg lg:w-2xl h-full group flex flex-col gap-2 overflow-hidden">
			<div className="flex justify-between items-center text-base-content/80 group">
				<div className="flex gap-2 items-center justify-center w-fit ">
					<span className="font-medium text-lg">Notes</span>
					<button className="btn btn-xs btn-circle btn-ghost invisible group-hover:visible">
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
				>
					<Plus className="size-3" />
				</button>
			</div>
			{/* New note form */}
			{isAddingNew && (
				<div
					ref={addNoteRef}
					className="w-full card text-base-content/90 overflow-hidden bg-card border border-border shadow-xs"
				>
					<div className="flex justify-between p-4">
						<div className="flex items-center gap-2">
							<input
								type="text"
								placeholder="Note title..."
								className="border-b-1  border-base-content/50  outline-base-content/10 focus:outline-0 w-32"
								value={newNoteTitle}
								onChange={(e) => setNewNoteTitle(e.target.value)}
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

					<ContextMenuEditor
						content={newNoteContent}
						onChange={setNewNoteContent}
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
			<div
				className={`flex flex-col gap-4 rounded-box flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
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
							className={`w-full border-border border shadow-xs card text-base-content/90 p-4 transition-all ease-out group ${
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
												onKeyDown={(e) => {
													if (e.key === "Enter" && e.shiftKey) {
														e.preventDefault();
														stopEditing();
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
												onClick={cancelEditing}
											>
												<X className="size-3" />
											</button>
										</div>
									</div>

									<ContextMenuEditor
										content={note.content}
										onChange={(content) => updateNote(note.id, { content })}
										className="h-fit -m-4"
										autoFocus={true}
										onKeyDown={(e) => {
											if (e.key === "Enter" && e.shiftKey) {
												e.preventDefault();
												stopEditing();
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
		</div>
	);
}
