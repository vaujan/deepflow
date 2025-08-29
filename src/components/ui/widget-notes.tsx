"use client";

import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

export default function WidgetNotes() {
	const [notes, setNotes] = useState([
		{
			id: 1,
			title: "Meeting Notes",
			content: "Discuss project timeline and deliverables...",
			timestamp: "2 hours ago",
		},
		{
			id: 2,
			title: "Ideas",
			content: "New feature ideas for the next sprint...",
			timestamp: "1 day ago",
		},
	]);
	const [activeNote, setActiveNote] = useState<number | null>(null);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("");

	const addNote = () => {
		if (newNoteTitle.trim() && newNoteContent.trim()) {
			const newNote = {
				id: Date.now(),
				title: newNoteTitle,
				content: newNoteContent,
				timestamp: "Just now",
			};
			setNotes([newNote, ...notes]);
			setNewNoteTitle("");
			setNewNoteContent("");
		}
	};

	const deleteNote = (id: number) => {
		setNotes(notes.filter((note) => note.id !== id));
		if (activeNote === id) {
			setActiveNote(null);
		}
	};

	return (
		<div className="card bg-base-300 w-full h-full gap-3 border border-base-100 p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-md font-bold">Notes</h3>
				<button className="btn btn-sm btn-secondary" onClick={addNote}>
					<Plus className="size-4 text-secondary-content" />
				</button>
			</div>

			{/* New note form */}
			<div className="space-y-2">
				<input
					type="text"
					placeholder="Note title..."
					className="input input-sm input-bordered w-full"
					value={newNoteTitle}
					onChange={(e) => setNewNoteTitle(e.target.value)}
				/>
				<textarea
					placeholder="Note content..."
					className="textarea textarea-bordered w-full h-20"
					value={newNoteContent}
					onChange={(e) => setNewNoteContent(e.target.value)}
				/>
			</div>

			{/* Notes list */}
			<div className="space-y-2 max-h-64 overflow-y-auto">
				{notes.map((note) => (
					<div
						key={note.id}
						className={`p-3 rounded-lg cursor-pointer transition-colors ${
							activeNote === note.id
								? "bg-primary/20 border border-primary"
								: "bg-base-200 hover:bg-base-100"
						}`}
						onClick={() =>
							setActiveNote(activeNote === note.id ? null : note.id)
						}
					>
						<div className="flex items-center justify-between">
							<h4 className="font-semibold text-sm">{note.title}</h4>
							<button
								className="btn btn-xs btn-ghost text-error"
								onClick={(e) => {
									e.stopPropagation();
									deleteNote(note.id);
								}}
							>
								<Trash2 className="size-3" />
							</button>
						</div>
						<p className="text-xs text-base-content/70 mt-1">{note.content}</p>
						<p className="text-xs text-base-content/50 mt-2">
							{note.timestamp}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
