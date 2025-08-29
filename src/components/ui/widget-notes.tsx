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
			<div className="flex items-center border-base-100 justify-between">
				<h3 className="text-md font-bold">Notes</h3>
				<button className="btn btn-sm btn-ghost btn-circle" onClick={addNote}>
					<Plus className="size-4" />
				</button>
			</div>

			{/* New note form */}
			{/* <div className="space-y-2">
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
			</div> */}

			{/* Notes list */}
			<div className="space-y-2 max-h-64 overflow-y-auto">
				{/* Markdown note taking with live preview:
			For convenience between editing and reading */}
				<div className="w-full h-fit text-wrap text-sm p-4 bg-base-100 rounded-box text-base-content/80">
					## Attention is a skill *The quality of your attention determines the
					quality of your life* - What you focus on (whether by choice or by
					force) becomes your reality - The things you attend to register as
					targets in your brain and shape your behavior. Everything else fades
					into background noise. - Attention is a skill. And like any skill, it
					can be trained. Every time you bring your wandering mind back to the
					present task, you're doing a mental rep. Every time you resist the
					pull of a distraction, you're building strength. <br /> - The tech
					industry, weaponized with the world's leading scientist and billions
					and billions of dollars is working hard to steal your attention. -
					Losing your attention to the tech giants is the norm. That is what 99%
					people are. - They might be your friends, your parent, or your spouse
					- **In an ever distracted world, developing your attention is an
					unfair advantage.** *"Energy flows where your attention goes."*
				</div>

				{/* {notes.map((note) => (
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
				))} */}
			</div>
		</div>
	);
}
