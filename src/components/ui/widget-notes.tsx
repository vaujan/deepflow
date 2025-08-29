"use client";

import { Plus, Trash2, Edit3, Save, X } from "lucide-react";
import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
			content: "User is writing mode here",
			timestamp: "Created at 10.02",
		},
		{
			id: 2,
			title: "The newer note",
			content:
				"When we click add note, it will directly add a new note like this one and we put the user straight into writing.\n\nThe writing should accept markdown format and doing live preview\n\nClicking another card should enter an edit mode into that card. The edit mode and read mode should be seamless, just like the Live Preview mode in note-taking app like Obsidian or LogSeq",
			timestamp: "Created at 10.01",
		},
		{
			id: 3,
			title: "The older note",
			content:
				'# Hello world, this is should be a heading written in markdown convetion (using "#")\n\n**Better Call Saul** is an American neo-noir legal crime drama television series created by Vince Gilligan and Peter Gould for AMC. Part of the Breaking Bad franchise, it is a spin-off of Gilligan\'s previous series, Breaking Bad (2008–2013), to which it serves primarily as a prequel, with some scenes taking place during and after the events of Breaking Bad. Better Call Saul premiered on AMC on February 8, 2015, and ended on August 15, 2022, after six seasons, totalling 63 episodes.\n\nSet primarily in the early to mid-2000s in Albuquerque, New Mexico, several years before the events of Breaking Bad, Better Call Saul examines the ethical decline of Jimmy McGill (Bob Odenkirk), an aspiring lawyer and former con artist who becomes the egocentric criminal-defense attorney Saul Goodman alongside his romantic interest and colleague Kim Wexler (Rhea Seehorn), while dealing with conflicts with his brother Chuck McGill (Michael McKean) and his law partner Howard Hamlin (Patrick Fabian). The show also follows Mike Ehrmantraut (Jonathan Banks), a former corrupt police officer who becomes a fixer and enforcer for drug traffickers, such as drug dealer Nacho Varga (Michael Mando).',
			timestamp: "Created at 10.00",
		},
	]);
	const [activeNote, setActiveNote] = useState<number | null>(null);
	const [editingNote, setEditingNote] = useState<number | null>(null);
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("");
	const [editingContent, setEditingContent] = useState("");
	const [cursorPosition, setCursorPosition] = useState(0);
	const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
	const [isEditing, setIsEditing] = useState(false);

	const contentRef = useRef<HTMLDivElement>(null);
	const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);

	// Debounced update for smoother live preview
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
		if (newNoteTitle.trim() && newNoteContent.trim()) {
			const newNote: Note = {
				id: Date.now(),
				title: newNoteTitle,
				content: newNoteContent,
				timestamp: "Just now",
			};
			setNotes([newNote, ...notes]);
			setNewNoteTitle("");
			setNewNoteContent("");
			setIsAddingNew(false);
			setActiveNote(newNote.id);
			setEditingNote(newNote.id);
			setEditingContent(newNoteContent);
			setIsEditing(true);

			// Set cursor position at the end of new content
			const endPosition = newNoteContent.length;
			setCursorPosition(endPosition);

			// Calculate initial cursor coordinates
			const lines = newNoteContent.split("\n");
			const lastLine = lines.length - 1;
			const lastChar = lines[lastLine]?.length || 0;

			const x = 16 + lastChar * 8;
			const y = 16 + lastLine * 20;
			setCursorCoords({ x, y });
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
		if (isEditing) {
			setIsEditing(false);
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
		setIsEditing(false);
	};

	const startEditing = (id: number) => {
		setEditingNote(id);
		const note = notes.find((n) => n.id === id);
		if (note) {
			setEditingContent(note.content);
			setIsEditing(true);
			// Set initial cursor position at the end
			const endPosition = note.content.length;
			setCursorPosition(endPosition);

			// Calculate initial cursor coordinates
			const lines = note.content.split("\n");
			const lastLine = lines.length - 1;
			const lastChar = lines[lastLine]?.length || 0;

			const x = 16 + lastChar * 8;
			const y = 16 + lastLine * 20;
			setCursorCoords({ x, y });
		}
	};

	const stopEditing = () => {
		if (editingNote) {
			updateNote(editingNote, { content: editingContent });
			setEditingNote(null);
			setIsEditing(false);
		}
	};

	const startAddingNew = () => {
		setIsAddingNew(true);
		setActiveNote(null);
		setEditingNote(null);
		setNewNoteTitle("");
		setNewNoteContent("");
		setIsEditing(false);
	};

	const cancelAddingNew = () => {
		setIsAddingNew(false);
		setNewNoteTitle("");
		setNewNoteContent("");
		setIsEditing(false);
	};

	// Handle content editing with seamless interface
	const handleContentClick = (e: React.MouseEvent, noteId: number) => {
		if (editingNote === noteId) {
			e.stopPropagation();
			// Focus the hidden textarea and position cursor
			if (hiddenTextareaRef.current) {
				hiddenTextareaRef.current.focus();
				// Calculate cursor position based on click
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				// More accurate cursor positioning
				const lineHeight = 20; // Approximate line height
				const charWidth = 8; // Approximate character width
				const line = Math.floor((y - 16) / lineHeight); // 16px padding
				const char = Math.floor((x - 16) / charWidth); // 16px padding

				const newPosition = Math.max(0, line * 80 + char);
				setCursorPosition(newPosition);

				// Set cursor coordinates for visual positioning
				setCursorCoords({ x: x, y: y });
			}
		}
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditingContent(e.target.value);
		// Update the note content in real-time
		if (editingNote) {
			updateNote(editingNote, { content: e.target.value });
		}
	};

	// Sync cursor position when editing
	useEffect(() => {
		if (isEditing && hiddenTextareaRef.current) {
			hiddenTextareaRef.current.focus();
			hiddenTextareaRef.current.setSelectionRange(
				cursorPosition,
				cursorPosition
			);
		}
	}, [isEditing, cursorPosition]);

	const renderMarkdown = (content: string) => (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex]}
			components={{
				h1: ({ children }) => (
					<h1 className="text-2xl font-medium border-b border-base-content/50 mb-4">
						{children}
					</h1>
				),
				h2: ({ children }) => (
					<h2 className="text-xl font-medium border-b border-base-content/50 mb-3">
						{children}
					</h2>
				),
				h3: ({ children }) => (
					<h3 className="text-lg font-medium border-b border-base-content/50 mb-2">
						{children}
					</h3>
				),
				p: ({ children }) => <p className="mb-2">{children}</p>,
				ul: ({ children }) => (
					<ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
				),
				ol: ({ children }) => (
					<ol className="list-decimal list-inside mb-2 space-y-1">
						{children}
					</ol>
				),
				li: ({ children }) => <li className="ml-2">{children}</li>,
				blockquote: ({ children }) => (
					<blockquote className="border-l-4 border-base-content/20 pl-4 italic bg-base-content/5 py-2 mb-2 rounded-r-lg">
						{children}
					</blockquote>
				),
				code: ({ children, ...props }: any) => {
					const isInline = props.className?.includes("language-") === false;
					if (isInline) {
						return (
							<code
								className="bg-base-200 px-2 py-1 rounded-md text-sm font-mono text-primary/80 border border-base-300"
								{...props}
							>
								{children}
							</code>
						);
					}
					return (
						<pre className="bg-base-200 p-4 rounded-lg overflow-x-auto mb-2 border border-base-300">
							<code
								className="text-sm font-mono text-base-content/90"
								{...props}
							>
								{children}
							</code>
						</pre>
					);
				},
				strong: ({ children }) => (
					<strong className="font-semibold text-base-content">
						{children}
					</strong>
				),
				em: ({ children }) => (
					<em className="italic text-base-content/90">{children}</em>
				),
				del: ({ children }) => (
					<del className="line-through text-base-content/60">{children}</del>
				),
				a: ({ href, children }) => (
					<a
						href={href}
						className="text-primary hover:text-primary-focus hover:underline transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						{children}
					</a>
				),
				img: ({ src, alt }) => (
					<img
						src={src}
						alt={alt}
						className="max-w-full h-auto rounded-lg my-2 border border-base-300"
					/>
				),
				table: ({ children }) => (
					<div className="overflow-x-auto mb-2">
						<table className="min-w-full border-collapse border border-base-300 rounded-lg overflow-hidden">
							{children}
						</table>
					</div>
				),
				th: ({ children }) => (
					<th className="border border-base-300 px-4 py-3 bg-base-200 font-semibold text-left text-base-content">
						{children}
					</th>
				),
				td: ({ children }) => (
					<td className="border border-base-300 px-4 py-3 text-base-content/90">
						{children}
					</td>
				),
				hr: () => (
					<hr className="my-4 border-t border-base-300 border-dashed" />
				),
			}}
		>
			{content}
		</ReactMarkdown>
	);

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

			{/* New note form - seamless interface */}
			{isAddingNew && (
				<div className="w-full card text-base-content/90 bg-base-100 p-4 shadow-xl transition-all ease-out mb-4">
					<div className="flex justify-between text-base-content/50 mb-3">
						<div className="flex items-center gap-2">
							<span className="badge badge-sm badge-ghost">New Note</span>
							<input
								type="text"
								placeholder="Note title..."
								className="input input-sm input-bordered w-32"
								value={newNoteTitle}
								onChange={(e) => setNewNoteTitle(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<button
								className="btn btn-xs btn-primary"
								onClick={addNote}
								disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
							>
								<Save className="size-3" />
								Add
							</button>
							<button
								className="btn btn-xs btn-ghost"
								onClick={cancelAddingNew}
							>
								<X className="size-3" />
							</button>
						</div>
					</div>

					{/* Seamless editing interface - type directly in rendered area */}
					<div className="relative">
						{/* Hidden textarea for actual input */}
						<textarea
							ref={hiddenTextareaRef}
							className="absolute inset-0 opacity-0 z-10 w-full h-64 font-mono text-sm leading-relaxed resize-none focus:outline-none"
							value={newNoteContent}
							onChange={(e) => setNewNoteContent(e.target.value)}
							placeholder="Start typing here... Your markdown will render in real-time below."
						/>
						{/* Rendered markdown display */}
						<div className="w-full h-64 overflow-y-auto bg-base-100 border border-base-200 rounded-lg p-4">
							<div className="prose prose-sm max-w-none min-h-full">
								{renderMarkdown(
									newNoteContent || "Start typing to see live preview..."
								)}
							</div>
						</div>
					</div>
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

						{/* Note content - seamless editing interface */}
						{editingNote === note.id ? (
							// Seamless editing - type directly in rendered area
							<div className="relative">
								{/* Hidden textarea for actual input */}
								<textarea
									ref={hiddenTextareaRef}
									className="absolute inset-0 opacity-0 z-10 w-full h-64 font-mono text-sm leading-relaxed resize-none focus:outline-none"
									value={editingContent}
									onChange={handleContentChange}
									onClick={(e) => {
										e.stopPropagation();
										if (hiddenTextareaRef.current) {
											const newPosition =
												hiddenTextareaRef.current.selectionStart;
											setCursorPosition(newPosition);

											// Update cursor coordinates based on position
											const textBeforeCursor = editingContent.substring(
												0,
												newPosition
											);
											const lines = textBeforeCursor.split("\n");
											const currentLine = lines.length - 1;
											const currentChar = lines[currentLine]?.length || 0;

											const x = 16 + currentChar * 8; // 16px padding + character position
											const y = 16 + currentLine * 20; // 16px padding + line position

											setCursorCoords({ x, y });
										}
									}}
									placeholder="Type directly here... Your markdown renders in real-time below."
									onKeyUp={(e) => {
										// Update cursor position when typing
										if (hiddenTextareaRef.current) {
											const newPosition =
												hiddenTextareaRef.current.selectionStart;
											setCursorPosition(newPosition);

											// Update cursor coordinates based on position
											const textBeforeCursor = editingContent.substring(
												0,
												newPosition
											);
											const lines = textBeforeCursor.split("\n");
											const currentLine = lines.length - 1;
											const currentChar = lines[currentLine]?.length || 0;

											const x = 16 + currentChar * 8; // 16px padding + character position
											const y = 16 + currentLine * 20; // 16px padding + line position

											setCursorCoords({ x, y });
										}
									}}
								/>
								{/* Rendered markdown display */}
								<div
									className="w-full h-64 overflow-y-auto bg-base-100 border border-base-200 rounded-lg p-4 cursor-text"
									onClick={(e) => handleContentClick(e, note.id)}
								>
									<div className="prose prose-sm max-w-none min-h-full relative">
										{renderMarkdown(editingContent)}
										{/* Blinking cursor overlay */}
										{editingNote === note.id && (
											<span
												className="inline-block w-0.5 h-5 bg-primary animate-pulse"
												style={{
													position: "absolute",
													left: `${cursorCoords.x}px`,
													top: `${cursorCoords.y}px`,
													transform: "translate(-50%, -2px)",
													zIndex: 20,
												}}
											/>
										)}
									</div>
								</div>
							</div>
						) : (
							// Read mode - rendered markdown
							<div className="prose prose-sm max-w-none">
								{renderMarkdown(note.content)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
