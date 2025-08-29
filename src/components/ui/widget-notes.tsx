"use client";

import { Plus, Trash2, Edit3, Save, X } from "lucide-react";
import React, { useState, useCallback } from "react";
import RichTextEditor from "./rich-text-editor";

interface Note {
	id: number;
	title: string;
	content: string;
	timestamp: string;
}

export default function WidgetNotes() {
	const [notes, setNotes] = useState<Note[]>([
		{
			id: 1,
			title: "Untitled",
			content: "<p>User is writing mode here</p>",
			timestamp: "Created at 10.02",
		},
		{
			id: 2,
			title: "The newer note",
			content:
				"<p>When we click add note, it will directly add a new note like this one and we put the user straight into writing.</p><p>The writing now uses a rich text editor with a modern toolbar and comprehensive formatting options.</p><p>Clicking another card should enter an edit mode into that card. The edit mode and read mode should be seamless, just like modern note-taking apps.</p>",
			timestamp: "Created at 10.01",
		},
		{
			id: 3,
			title: "The older note",
			content:
				"<h1>Hello world, this is a heading</h1><p><strong>Better Call Saul</strong> is an American neo-noir legal crime drama television series created by Vince Gilligan and Peter Gould for AMC. Part of the Breaking Bad franchise, it is a spin-off of Gilligan's previous series, Breaking Bad (2008–2013), to which it serves primarily as a prequel, with some scenes taking place during and after the events of Breaking Bad.</p><p>Set primarily in the early to mid-2000s in Albuquerque, New Mexico, several years before the events of Breaking Bad, Better Call Saul examines the ethical decline of Jimmy McGill (Bob Odenkirk), an aspiring lawyer and former con artist who becomes the egocentric criminal-defense attorney Saul Goodman alongside his romantic interest and colleague Kim Wexler (Rhea Seehorn).</p>",
			timestamp: "Created at 10.00",
		},
	]);
	const [activeNote, setActiveNote] = useState<number | null>(null);
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
			setActiveNote(newNote.id);
			setEditingNote(newNote.id);
		}
	};

	const deleteNote = (id: number) => {
		setNotes(notes.filter((note) => note.id !== id));
		if (activeNote === id) {
			setActiveNote(null);
		}
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

	const getActiveNote = () => notes.find((note) => note.id === activeNote);

	const handleNoteClick = (id: number) => {
		setActiveNote(id);
		setEditingNote(null);
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
		setActiveNote(null);
		setEditingNote(null);
		setNewNoteTitle("");
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
				className="prose prose-sm max-w-none"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		);
	};

	return (
		<div className="w-full max-w-xl flex flex-col gap-2 min-w-[550px]">
			<div className="flex justify-end text-base-content/80">
				<button
					className="btn btn-ghost btn-circle btn-sm"
					onClick={startAddingNew}
				>
					<Plus className="size-4" />
				</button>
			</div>

			{/* New note form */}
			{isAddingNew && (
				<div className="w-full card text-base-content/90 overflow-hidden bg-base-100 shadow-xl transition-all ease-out mb-4">
					<div className="flex justify-between text-base-content/50 p-2">
						<div className="flex items-center gap-2">
							<input
								type="text"
								placeholder="Note title..."
								className="badge badge-lg badge-ghost rounded-sm outline-base-content/10 focus:outline-1 w-32"
								value={newNoteTitle}
								onChange={(e) => setNewNoteTitle(e.target.value)}
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
								<Save className="size-4" />
								Add
							</button>
							<button
								className="btn btn-ghost btn-sm btn-square"
								onClick={cancelAddingNew}
							>
								<X className="size-3" />
							</button>
						</div>
					</div>

					<RichTextEditor
						content={newNoteContent}
						onChange={setNewNoteContent}
						placeholder="Start typing here... Use the toolbar above for formatting."
						className="min-h-[300px]"
					/>
				</div>
			)}

			{/* Note list */}
			<div className="flex flex-col gap-4 rounded-box max-h-[900px] overflow-y-auto">
				{notes.map((note) => (
					<div
						key={note.id}
						className={`w-full card text-base-content/90 bg-base-100 p-4 shadow-xl transition-all ease-out cursor-pointer ${
							activeNote === note.id ? "shadow-xs" : ""
						}`}
						onClick={() => handleNoteClick(note.id)}
					>
						{/* Note header with title, time, and actions */}
						<div className="flex justify-between text-base-content/50 mb-3">
							<span className="badge badge-sm badge-ghost">
								{editingNote === note.id ? (
									<input
										type="text"
										className="input input-xs input-bordered w-24"
										value={note.title}
										onChange={(e) =>
											updateNote(note.id, { title: e.target.value })
										}
										onClick={(e) => e.stopPropagation()}
									/>
								) : (
									note.title
								)}
							</span>
							<div className="flex items-center gap-2">
								<p className="text-xs">{note.timestamp}</p>
								{activeNote === note.id && editingNote !== note.id && (
									<button
										className="btn btn-xs btn-ghost btn-circle"
										onClick={(e) => {
											e.stopPropagation();
											startEditing(note.id);
										}}
										title="Edit note"
									>
										<Edit3 className="size-3" />
									</button>
								)}
								{editingNote === note.id && (
									<button
										className="btn btn-xs btn-primary btn-circle"
										onClick={(e) => {
											e.stopPropagation();
											stopEditing();
										}}
										title="Save and stop editing"
									>
										<Save className="size-3" />
									</button>
								)}
								<button
									className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/20"
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
						{editingNote === note.id ? (
							<RichTextEditor
								content={note.content}
								onChange={(content) => updateNote(note.id, { content })}
								placeholder="Edit your note here..."
								className="min-h-[300px]"
							/>
						) : (
							<div className="min-h-[200px]">{renderContent(note.content)}</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
