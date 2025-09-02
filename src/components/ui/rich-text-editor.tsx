"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
	Bold,
	Italic,
	Strikethrough,
	Quote,
	List,
	ListOrdered,
	Link as LinkIcon,
	Image as ImageIcon,
	Underline as UnderlineIcon,
	ChevronDown,
	X,
	Check,
	Code,
	Terminal,
} from "lucide-react";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	editable?: boolean;
	className?: string;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	autoFocus?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
	const [showLinkForm, setShowLinkForm] = useState(false);
	const [showImageForm, setShowImageForm] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [linkText, setLinkText] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [imageAlt, setImageAlt] = useState("");

	if (!editor) {
		return null;
	}

	const addLink = () => {
		if (linkUrl.trim() && linkText.trim()) {
			editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
			// If there's selected text, replace it with the link
			if (editor.isActive("link")) {
				editor.chain().focus().unsetLink().run();
			}
			editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
			setLinkUrl("");
			setLinkText("");
			setShowLinkForm(false);
		}
	};

	const addImage = () => {
		if (imageUrl.trim()) {
			editor
				.chain()
				.focus()
				.setImage({
					src: imageUrl.trim(),
					alt: imageAlt.trim() || "Image",
				})
				.run();
			setImageUrl("");
			setImageAlt("");
			setShowImageForm(false);
		}
	};

	const cancelLink = () => {
		setShowLinkForm(false);
		setLinkUrl("");
		setLinkText("");
	};

	const cancelImage = () => {
		setShowImageForm(false);
		setImageUrl("");
		setImageAlt("");
	};

	const handleLinkKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addLink();
		} else if (e.key === "Escape") {
			cancelLink();
		}
	};

	const handleImageKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addImage();
		} else if (e.key === "Escape") {
			cancelImage();
		}
	};

	return (
		<div className="rounded-none p-2 flex flex-wrap gap-1 items-center">
			{/* Text formatting */}
			<div className="flex items-center gap-1 border-r border-base-300 pr-2">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={`btn btn-xs ${
						editor.isActive("bold") ? "btn-primary" : "btn-ghost"
					}`}
					title="Bold"
				>
					<Bold className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={`btn btn-xs ${
						editor.isActive("italic") ? "btn-primary" : "btn-ghost"
					}`}
					title="Italic"
				>
					<Italic className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={`btn btn-xs ${
						editor.isActive("strike") ? "btn-primary" : "btn-ghost"
					}`}
					title="Strikethrough"
				>
					<Strikethrough className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					disabled={!editor.can().chain().focus().toggleUnderline().run()}
					className={`btn btn-xs ${
						editor.isActive("underline") ? "btn-primary" : "btn-ghost"
					}`}
					title="Underline"
				>
					<UnderlineIcon className="size-3" />
				</button>
			</div>

			{/* Block formatting */}
			<div className="flex items-center gap-1 border-r border-base-300 pr-2">
				<div className="dropdown dropdown-top">
					<button
						tabIndex={0}
						className="btn btn-xs btn-ghost"
						title="Text style"
					>
						{editor.isActive("heading", { level: 1 }) && "H1"}
						{editor.isActive("heading", { level: 2 }) && "H2"}
						{editor.isActive("heading", { level: 3 }) && "H3"}
						{!editor.isActive("heading") && "Normal text"}
						<ChevronDown className="size-3 ml-1" />
					</button>
					<ul
						tabIndex={0}
						className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-32"
					>
						<li>
							<button
								onClick={() => editor.chain().focus().setParagraph().run()}
								className={editor.isActive("paragraph") ? "active" : ""}
							>
								Normal text
							</button>
						</li>
						<li>
							<button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 1 }).run()
								}
								className={
									editor.isActive("heading", { level: 1 }) ? "active" : ""
								}
							>
								Heading 1
							</button>
						</li>
						<li>
							<button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 2 }).run()
								}
								className={
									editor.isActive("heading", { level: 2 }) ? "active" : ""
								}
							>
								Heading 2
							</button>
						</li>
						<li>
							<button
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 3 }).run()
								}
								className={
									editor.isActive("heading", { level: 3 }) ? "active" : ""
								}
							>
								Heading 3
							</button>
						</li>
					</ul>
				</div>
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					disabled={!editor.can().chain().focus().toggleBulletList().run()}
					className={`btn btn-xs ${
						editor.isActive("bulletList") ? "btn-primary" : "btn-ghost"
					}`}
					title="Bullet List"
				>
					<List className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					disabled={!editor.can().chain().focus().toggleOrderedList().run()}
					className={`btn btn-xs ${
						editor.isActive("orderedList") ? "btn-primary" : "btn-ghost"
					}`}
					title="Ordered List"
				>
					<ListOrdered className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					disabled={!editor.can().chain().focus().toggleBlockquote().run()}
					className={`btn btn-xs ${
						editor.isActive("blockquote") ? "btn-primary" : "btn-ghost"
					}`}
					title="Blockquote"
				>
					<Quote className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className={`btn btn-xs ${
						editor.isActive("code") ? "btn-primary" : "btn-ghost"
					}`}
					title="Inline Code"
				>
					<Code className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
					className={`btn btn-xs ${
						editor.isActive("codeBlock") ? "btn-primary" : "btn-ghost"
					}`}
					title="Code Block"
				>
					<Terminal className="size-3" />
				</button>
			</div>

			{/* Insert elements */}
			<div className="flex items-center gap-1">
				{/* Link button and form */}
				{!showLinkForm ? (
					<button
						onClick={() => setShowLinkForm(true)}
						className="btn btn-xs btn-ghost"
						title="Add Link"
					>
						<LinkIcon className="size-3" />
					</button>
				) : (
					<div className="flex items-center gap-1 bg-base-200 rounded-lg p-1 border border-base-300">
						<input
							type="text"
							placeholder="Link text..."
							value={linkText}
							onChange={(e) => setLinkText(e.target.value)}
							onKeyDown={handleLinkKeyDown}
							className="input input-xs w-20 bg-transparent border-0 focus:outline-none focus:ring-0"
							autoFocus
						/>
						<input
							type="url"
							placeholder="URL..."
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
							onKeyDown={handleLinkKeyDown}
							className="input input-xs w-32 bg-transparent border-0 focus:outline-none focus:ring-0"
						/>
						<button
							onClick={addLink}
							disabled={!linkUrl.trim() || !linkText.trim()}
							className="btn btn-xs btn-primary btn-circle"
							title="Add Link"
						>
							<Check className="size-3" />
						</button>
						<button
							onClick={cancelLink}
							className="btn btn-xs btn-ghost btn-circle"
							title="Cancel"
						>
							<X className="size-3" />
						</button>
					</div>
				)}

				{/* Image button and form */}
				{!showImageForm ? (
					<button
						onClick={() => setShowImageForm(true)}
						className="btn btn-xs btn-ghost"
						title="Add Image"
					>
						<ImageIcon className="size-3" />
					</button>
				) : (
					<div className="flex items-center gap-1 bg-base-200 rounded-lg p-1 border border-base-300">
						<input
							type="url"
							placeholder="Image URL..."
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							onKeyDown={handleImageKeyDown}
							className="input input-xs w-32 bg-transparent border-0 focus:outline-none focus:ring-0"
							autoFocus
						/>
						<input
							type="text"
							placeholder="Alt text..."
							value={imageAlt}
							onChange={(e) => setImageAlt(e.target.value)}
							onKeyDown={handleImageKeyDown}
							className="input input-xs w-20 bg-transparent border-0 focus:outline-none focus:ring-0"
						/>
						<button
							onClick={addImage}
							disabled={!imageUrl.trim()}
							className="btn btn-xs btn-primary btn-circle"
							title="Add Image"
						>
							<Check className="size-3" />
						</button>
						<button
							onClick={cancelImage}
							className="btn btn-xs btn-ghost btn-circle"
							title="Cancel"
						>
							<X className="size-3" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default function RichTextEditor({
	content,
	onChange,
	placeholder = "Start writing...",
	editable = true,
	className = "",
	onKeyDown,
	autoFocus,
}: RichTextEditorProps) {
	const editor = useEditor({
		onCreate: ({ editor }) => {
			console.log(
				"Editor created with extensions:",
				editor.extensionManager.extensions.map((ext) => ext.name)
			);
		},
		extensions: [
			StarterKit.configure({
				codeBlock: true,
				code: true,
			}),
			Placeholder.configure({
				placeholder,
			}),
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class:
						"text-primary hover:text-primary-focus hover:underline transition-colors",
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class: "max-w-full h-auto rounded-lg my-2 border border-base-300",
				},
			}),
			Table.configure({
				resizable: true,
				HTMLAttributes: {
					class:
						"min-w-full border-collapse border border-base-300 rounded-lg overflow-hidden",
				},
			}),
			TableRow,
			TableCell.configure({
				HTMLAttributes: {
					class: "border border-base-300 px-4 py-3 text-base-content/90",
				},
			}),
			TableHeader.configure({
				HTMLAttributes: {
					class:
						"border border-base-300 px-4 py-3 bg-base-200 font-semibold text-left text-base-content",
				},
			}),
		],
		content,
		editable,
		immediatelyRender: false, // Fix for SSR hydration
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "max-w-none focus:outline-none h-fit p-4",
			},
			handleKeyDown: (view, event) => {
				// Handle shift+enter and escape for external key handlers
				if (
					(event.key === "Enter" && event.shiftKey) ||
					event.key === "Escape"
				) {
					if (onKeyDown) {
						event.preventDefault();
						event.stopPropagation();
						onKeyDown(event as any);
						return true; // Indicate that we handled this key
					}
				}
				return false; // Let TipTap handle other keys normally
			},
		},
	});

	// Auto-focus if autoFocus prop is true
	React.useEffect(() => {
		if (autoFocus && editor) {
			editor.commands.focus();
		}
	}, [autoFocus, editor]);

	return (
		<div className={`flex flex-col justify-between  ${className}`}>
			<EditorContent editor={editor} />
			{editable && <MenuBar editor={editor} />}
		</div>
	);
}
