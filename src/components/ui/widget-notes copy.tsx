"use client";

import {
	Plus,
	Trash2,
	Eye,
	Edit3,
	Save,
	X,
	Maximize2,
	Minimize2,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
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
	const [notes, setNotes] = useState<Note[]>([]);
	const [activeNote, setActiveNote] = useState<number | null>(null);
	const [editingNote, setEditingNote] = useState<number | null>(null);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("");
	const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
		"split"
	);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [focusedLine, setFocusedLine] = useState<number | null>(null);

	// Load notes from localStorage on component mount
	useEffect(() => {
		const savedNotes = localStorage.getItem("deepflow-notes");
		if (savedNotes) {
			try {
				setNotes(JSON.parse(savedNotes));
			} catch (error) {
				console.error("Failed to parse saved notes:", error);
			}
		}
	}, []);

	// Save notes to localStorage whenever notes change
	useEffect(() => {
		localStorage.setItem("deepflow-notes", JSON.stringify(notes));
	}, [notes]);

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
		// Debounced update for localStorage
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
		setEditingNote(null);
	};

	const handleTextareaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
		const textarea = e.currentTarget;
		const lineHeight = 20; // Approximate line height
		const scrollTop = textarea.scrollTop;
		const currentLine = Math.floor(scrollTop / lineHeight) + 1;
		setFocusedLine(currentLine);
	};

	const renderMarkdown = (content: string) => (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex]}
			components={{
				h1: ({ children }) => (
					<h1 className="text-2xl font-bold mb-4 text-primary border-b border-primary/20 pb-2">
						{children}
					</h1>
				),
				h2: ({ children }) => (
					<h2 className="text-xl font-bold mb-3 text-primary/80 border-b border-primary/10 pb-1">
						{children}
					</h2>
				),
				h3: ({ children }) => (
					<h3 className="text-lg font-bold mb-2 text-primary/60">{children}</h3>
				),
				p: ({ children }) => (
					<p className="mb-4 leading-relaxed text-base-content/90">
						{children}
					</p>
				),
				ul: ({ children }) => (
					<ul className="list-disc list-inside mb-4 space-y-2 text-base-content/90">
						{children}
					</ul>
				),
				ol: ({ children }) => (
					<ol className="list-decimal list-inside mb-4 space-y-2 text-base-content/90">
						{children}
					</ol>
				),
				li: ({ children }) => <li className="ml-2">{children}</li>,
				blockquote: ({ children }) => (
					<blockquote className="border-l-4 border-primary/40 pl-4 italic bg-primary/5 py-3 mb-4 rounded-r-lg">
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
						<pre className="bg-base-200 p-4 rounded-lg overflow-x-auto mb-4 border border-base-300">
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
					<strong className="font-bold text-base-content">{children}</strong>
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
						className="max-w-full h-auto rounded-lg my-4 border border-base-300 shadow-sm"
					/>
				),
				table: ({ children }) => (
					<div className="overflow-x-auto mb-4">
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
					<hr className="my-6 border-t border-base-300 border-dashed" />
				),
			}}
		>
			{content}
		</ReactMarkdown>
	);

	return (
		<div
			className={`card bg-base-300 w-full h-full gap-3 border border-base-100 p-4 transition-all duration-300 ${
				isFullscreen ? "fixed inset-4 z-50 bg-base-300 shadow-2xl" : ""
			}`}
		>
			<div className="flex items-center border-base-100 justify-between">
				<h3 className="text-md font-bold">Notes</h3>
				<div className="flex items-center gap-2">
					{/* View mode toggle */}
					<div className="flex bg-base-200 rounded-lg p-1">
						<button
							className={`btn btn-xs ${
								viewMode === "edit" ? "btn-primary" : "btn-ghost"
							}`}
							onClick={() => setViewMode("edit")}
							title="Edit mode"
						>
							<Edit3 className="size-3" />
						</button>
						<button
							className={`btn btn-xs ${
								viewMode === "split" ? "btn-primary" : "btn-ghost"
							}`}
							onClick={() => setViewMode("split")}
							title="Split view (Obsidian style)"
						>
							<Edit3 className="size-3" />
							<Eye className="size-3" />
						</button>
						<button
							className={`btn btn-xs ${
								viewMode === "preview" ? "btn-primary" : "btn-ghost"
							}`}
							onClick={() => setViewMode("preview")}
							title="Preview mode"
						>
							<Eye className="size-3" />
						</button>
					</div>
					<button
						className="btn btn-xs btn-ghost btn-circle"
						onClick={() => setIsFullscreen(!isFullscreen)}
						title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
					>
						{isFullscreen ? (
							<Minimize2 className="size-3" />
						) : (
							<Maximize2 className="size-3" />
						)}
					</button>
					<button
						className="btn btn-sm btn-primary btn-circle"
						onClick={addNote}
					>
						<Plus className="size-4" />
					</button>
				</div>
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
					placeholder="Note content (Markdown supported)..."
					className="textarea textarea-bordered w-full h-20 font-mono text-sm"
					value={newNoteContent}
					onChange={(e) => setNewNoteContent(e.target.value)}
				/>
			</div>

			{/* Notes list */}
			<div className="space-y-2 max-h-32 overflow-y-auto">
				{notes.map((note) => (
					<div
						key={note.id}
						className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
							activeNote === note.id
								? "bg-primary/20 border border-primary shadow-md"
								: "bg-base-200 hover:bg-base-100 hover:shadow-sm"
						}`}
						onClick={() => handleNoteClick(note.id)}
					>
						<div className="flex items-center justify-between">
							<h4 className="font-semibold text-sm truncate">{note.title}</h4>
							<div className="flex items-center gap-1">
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
						<p className="text-xs text-base-content/70 mt-1 line-clamp-2">
							{note.content.substring(0, 100)}...
						</p>
						<p className="text-xs text-base-content/50 mt-2">
							{note.timestamp}
						</p>
					</div>
				))}
			</div>

			{/* Active note editor/preview */}
			{activeNote && getActiveNote() && (
				<div className="border-t border-base-100 pt-4 mt-4">
					<div className="flex items-center justify-between mb-3">
						<h4 className="font-semibold">{getActiveNote()?.title}</h4>
						{editingNote === activeNote && (
							<div className="flex gap-2">
								<button
									className="btn btn-xs btn-primary"
									onClick={() => stopEditing()}
									title="Save and stop editing"
								>
									<Save className="size-3" />
									Save
								</button>
								<button
									className="btn btn-xs btn-ghost"
									onClick={() => stopEditing()}
									title="Cancel editing"
								>
									<X className="size-3" />
								</button>
							</div>
						)}
					</div>

					{editingNote === activeNote ? (
						// Edit mode
						<div className="space-y-3">
							<input
								type="text"
								className="input input-sm input-bordered w-full"
								value={getActiveNote()?.title || ""}
								onChange={(e) =>
									updateNote(activeNote, { title: e.target.value })
								}
							/>
							<textarea
								className="textarea textarea-bordered w-full h-32 font-mono text-sm leading-relaxed"
								value={getActiveNote()?.content || ""}
								onChange={(e) =>
									updateNote(activeNote, { content: e.target.value })
								}
								onScroll={handleTextareaScroll}
								placeholder="Write your markdown here...&#10;&#10;# Headers&#10;**Bold** and *italic* text&#10;- Lists&#10;- [ ] Task lists&#10;&#10;| Tables | Are | Cool |&#10;|--------|-----|------|&#10;| Data   | Here| Now  |"
							/>
						</div>
					) : (
						// Preview mode
						<div className="prose prose-sm max-w-none bg-base-100 p-4 rounded-lg border border-base-200">
							{renderMarkdown(getActiveNote()?.content || "")}
						</div>
					)}
				</div>
			)}

			{/* Split view when editing - Obsidian style */}
			{editingNote && viewMode === "split" && (
				<div className="grid grid-cols-2 gap-6 mt-4 border-t border-base-100 pt-4">
					<div className="space-y-2">
						<h5 className="font-semibold text-sm text-primary/80 flex items-center gap-2">
							<Edit3 className="size-3" />
							Editor
						</h5>
						<textarea
							className="textarea textarea-bordered w-full h-64 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
							value={getActiveNote()?.content || ""}
							onChange={(e) =>
								updateNote(editingNote, { content: e.target.value })
							}
							onScroll={handleTextareaScroll}
							placeholder="Start writing your markdown here...&#10;&#10;The preview will update in real-time as you type!&#10;&#10;# Try these features:&#10;&#10;## Headers&#10;**Bold text** and *italic text*&#10;&#10;- Bullet points&#10;- [ ] Task lists&#10;- [x] Completed tasks&#10;&#10;`inline code` and code blocks:&#10;&#10;```javascript&#10;console.log('Hello World!');&#10;```&#10;&#10;| Tables | Are | Cool |&#10;|--------|-----|------|&#10;| Data   | Here| Now  |&#10;&#10;Math: $E = mc^2$"
						/>
					</div>
					<div className="space-y-2">
						<h5 className="font-semibold text-sm text-primary/80 flex items-center gap-2">
							<Eye className="size-3" />
							Live Preview
						</h5>
						<div className="border border-base-200 rounded-lg p-4 h-64 overflow-y-auto bg-base-100 shadow-inner">
							<div className="prose prose-sm max-w-none">
								{renderMarkdown(getActiveNote()?.content || "")}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
