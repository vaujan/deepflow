"use client";

import { Plus, Trash2, Edit3, X, Notebook } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import RichTextEditor from "./rich-text-editor";

// Prose styling configuration
const PROSE_CLASSES =
	"prose prose-blockquote:text-md prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:text-lg prose-p:text-base prose-li:text-base prose-pre:bg-base-200 prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm max-w-none";

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
			title: "📝 How to Use Notes Widget",
			content: `<h2>Welcome to the Notes Widget!</h2>
<p>This widget supports <strong>rich text editing</strong> with markdown-like capabilities. Here's how to get started:</p>

<h3>🎯 Basic Usage</h3>
<ul>
<li><strong>Create:</strong> Click the + button to add a new note</li>
<li><strong>Edit:</strong> Click the pencil icon on any note</li>
<li><strong>Delete:</strong> Click the trash icon to remove a note</li>
<li><strong>Save:</strong> Press <kbd>Shift + Enter</kbd> or click Save</li>
<li><strong>Cancel:</strong> Press <kbd>Escape</kbd> to cancel editing</li>
</ul>

<h3>✨ Features</h3>
<p>The editor supports:</p>
<ul>
<li><strong>Bold text</strong> and <em>italic text</em></li>
<li>Headers (H1, H2, H3, etc.)</li>
<li>Bulleted and numbered lists</li>
<li>Code blocks and inline code</li>
<li>Links and more!</li>
</ul>

<p><em>Try editing this note to see the formatting in action!</em></p>`,
			timestamp: "2 hours ago",
		},
		{
			id: 2,
			title: "🎨 Markdown Examples",
			content: `<h1>Markdown Formatting Examples</h1>

<h2>Text Formatting</h2>
<p>You can make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>.</p>
<p>You can also <s>strikethrough</s> text and create <code>inline code</code>.</p>

<h2>Lists</h2>
<h3>Bulleted List:</h3>
<ul>
<li>First item</li>
<li>Second item</li>
<li>Third item with <strong>bold text</strong></li>
</ul>

<h3>Numbered List:</h3>
<ol>
<li>First step</li>
<li>Second step</li>
<li>Third step with <em>italic text</em></li>
</ol>

<h2>Code Blocks</h2>
<pre><code>function greetUser(name) {
  return \`Hello, \${name}!\`;
}

console.log(greetUser("World"));
</code></pre>

<h2>Links</h2>
<p>You can create <a href="https://example.com">clickable links</a> to external websites.</p>

<h2>Quotes</h2>
<blockquote>
<p>"The best way to learn is by doing."</p>
</blockquote>`,
			timestamp: "1 hour ago",
		},
		{
			id: 3,
			title: "⚡ Keyboard Shortcuts",
			content: `<h2>Keyboard Shortcuts</h2>

<h3>General Shortcuts</h3>
<ul>
<li><kbd>Shift + Enter</kbd> - Save note (when editing)</li>
<li><kbd>Escape</kbd> - Cancel editing or close forms</li>
<li><kbd>Ctrl + B</kbd> - Bold text</li>
<li><kbd>Ctrl + I</kbd> - Italic text</li>
<li><kbd>Ctrl + U</kbd> - Underline text</li>
</ul>

<h3>Text Formatting</h3>
<ul>
<li><kbd>Ctrl + Shift + 1</kbd> - Heading 1</li>
<li><kbd>Ctrl + Shift + 2</kbd> - Heading 2</li>
<li><kbd>Ctrl + Shift + 3</kbd> - Heading 3</li>
<li><kbd>Ctrl + Shift + 8</kbd> - Bullet list</li>
<li><kbd>Ctrl + Shift + 7</kbd> - Numbered list</li>
</ul>

<h3>Pro Tips</h3>
<ul>
<li>💡 <strong>Auto-save:</strong> Notes are automatically saved as you type</li>
<li>💡 <strong>Quick edit:</strong> Click anywhere on a note to start editing</li>
<li>💡 <strong>Rich formatting:</strong> Use the toolbar buttons for easy formatting</li>
<li>💡 <strong>Organize:</strong> Give your notes descriptive titles for easy finding</li>
</ul>`,
			timestamp: "30 minutes ago",
		},
		{
			id: 4,
			title: "📋 Meeting Notes Template",
			content: `<h2>Team Standup - ${new Date().toLocaleDateString()}</h2>

<h3>📅 Date:</h3>
<p>${new Date().toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			})}</h3>

<h3>👥 Attendees:</h3>
<ul>
<li>John Doe</li>
<li>Jane Smith</li>
<li>Mike Johnson</li>
</ul>

<h3>📝 Agenda:</h3>
<ol>
<li>Yesterday's accomplishments</li>
<li>Today's goals</li>
<li>Blockers and challenges</li>
</ol>

<h3>✅ Yesterday's Accomplishments:</h3>
<ul>
<li>Completed user authentication feature</li>
<li>Fixed bug in data validation</li>
<li>Updated documentation</li>
</ul>

<h3>🎯 Today's Goals:</h3>
<ul>
<li>Implement new dashboard design</li>
<li>Review pull requests</li>
<li>Plan next sprint</li>
</ul>

<h3>🚧 Blockers:</h3>
<ul>
<li>Waiting for API response from third-party service</li>
<li>Need clarification on design requirements</li>
</ul>

<h3>📋 Action Items:</h3>
<ul>
<li><strong>John:</strong> Contact API provider about response delays</li>
<li><strong>Jane:</strong> Schedule design review meeting</li>
<li><strong>Mike:</strong> Prepare sprint planning materials</li>
</ul>`,
			timestamp: "15 minutes ago",
		},
		{
			id: 5,
			title: "💡 Ideas & Brainstorming",
			content: `<h2>Project Ideas 💡</h2>

<h3>🚀 New Features to Consider:</h3>
<ul>
<li><strong>Dark Mode Toggle</strong> - User preference for theme switching</li>
<li><strong>Note Categories</strong> - Organize notes with tags or folders</li>
<li><strong>Search Functionality</strong> - Find notes quickly with full-text search</li>
<li><strong>Export Options</strong> - Save notes as PDF, Markdown, or plain text</li>
<li><strong>Collaboration</strong> - Share notes with team members</li>
</ul>

<h3>🎨 UI/UX Improvements:</h3>
<ul>
<li>Add drag-and-drop reordering for notes</li>
<li>Implement note preview on hover</li>
<li>Add keyboard navigation between notes</li>
<li>Create note templates for common use cases</li>
</ul>

<h3>🔧 Technical Considerations:</h3>
<ul>
<li>Performance optimization for large note collections</li>
<li>Offline support with local storage</li>
<li>Sync capabilities across devices</li>
<li>Backup and restore functionality</li>
</ul>

<h3>📊 Priority Matrix:</h3>
<table>
<tr>
<th>Feature</th>
<th>Impact</th>
<th>Effort</th>
<th>Priority</th>
</tr>
<tr>
<td>Dark Mode</td>
<td>High</td>
<td>Low</td>
<td>🔴 High</td>
</tr>
<tr>
<td>Search</td>
<td>High</td>
<td>Medium</td>
<td>🟡 Medium</td>
</tr>
<tr>
<td>Export</td>
<td>Medium</td>
<td>Low</td>
<td>🟡 Medium</td>
</tr>
</table>`,
			timestamp: "5 minutes ago",
		},
		{
			id: 6,
			title: "📚 Learning Resources",
			content: `<h2>Useful Resources 📚</h2>

<h3>📖 Documentation:</h3>
<ul>
<li><a href="https://markdownguide.org/">Markdown Guide</a> - Complete markdown syntax reference</li>
<li><a href="https://www.markdowntutorial.com/">Markdown Tutorial</a> - Interactive learning</li>
<li><a href="https://commonmark.org/">CommonMark</a> - Standardized markdown specification</li>
</ul>

<h3>🛠️ Tools & Extensions:</h3>
<ul>
<li><strong>VS Code:</strong> Markdown All in One extension</li>
<li><strong>Browser:</strong> Markdown Viewer extensions</li>
<li><strong>Online:</strong> <a href="https://dillinger.io/">Dillinger</a> - Online markdown editor</li>
</ul>

<h3>💡 Best Practices:</h3>
<ol>
<li><strong>Use headers</strong> to structure your content</li>
<li><strong>Keep paragraphs short</strong> for better readability</li>
<li><strong>Use lists</strong> for multiple related items</li>
<li><strong>Add emphasis</strong> with bold and italic text</li>
<li><strong>Include code blocks</strong> for technical content</li>
</ol>

<h3>🎯 Quick Reference:</h3>
<pre><code># Header 1
## Header 2
### Header 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet point
- Another point

1. Numbered item
2. Another item

[Link text](https://example.com)
\`inline code\`

\`\`\`javascript
// Code block
function example() {
  return "Hello World";
}
\`\`\`</code></pre>`,
			timestamp: "Just now",
		},
	]);
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

	// Global escape key handler
	useEffect(() => {
		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (isAddingNew) {
					event.preventDefault();
					cancelAddingNew();
				} else if (editingNote !== null) {
					event.preventDefault();
					stopEditing();
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

	const renderContent = (content: string) => {
		return (
			<div
				className={PROSE_CLASSES}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		);
	};

	return (
		<div className="w-full h-full group flex flex-col gap-2 overflow-hidden">
			<div className="flex justify-between items-center text-base-content/80">
				<div className="flex items-center gap-2">
					<span className="font-medium text-lg">Notes</span>
					{/* Writing mode indicator */}
					{(isAddingNew || editingNote !== null) && (
						<div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
							<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
							<span className="font-medium">
								{isAddingNew ? "Creating new note" : "Editing note"}
							</span>
						</div>
					)}
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
					<Plus className="size-4" />
				</button>
			</div>
			{/* New note form */}
			{isAddingNew && (
				<div className="w-full card text-base-content/90 overflow-hidden bg-primary/5 border-2 border-primary/20 shadow-lg ring-1 ring-primary/10 transition-all ease-out mb-4">
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

					<RichTextEditor
						content={newNoteContent}
						onChange={setNewNoteContent}
						className={`h-fit ${PROSE_CLASSES}`}
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
							className={`w-full card text-base-content/90 p-4 transition-all ease-out group ${
								editingNote === note.id
									? "bg-primary/5 border-2 border-primary/20 shadow-lg ring-1 ring-primary/10"
									: editingNote !== null || isAddingNew
									? "bg-base-100 opacity-60"
									: "bg-base-100"
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
										className={`h-fit ${PROSE_CLASSES} -m-4`}
										autoFocus={true}
										onKeyDown={(e) => {
											if (e.key === "Enter" && e.shiftKey) {
												e.preventDefault();
												stopEditing();
											} else if (e.key === "Escape") {
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
									<div className="h-fit overflow-hidden break-words">
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
