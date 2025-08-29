"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
	Bold,
	Italic,
	Strikethrough,
	Code,
	Quote,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Link as LinkIcon,
	Image as ImageIcon,
	Table as TableIcon,
	Undo,
	Redo,
	Highlighter,
	Underline as UnderlineIcon,
} from "lucide-react";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	editable?: boolean;
	className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
	if (!editor) {
		return null;
	}

	const addLink = () => {
		const url = window.prompt("Enter URL");
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	};

	const addImage = () => {
		const url = window.prompt("Enter image URL");
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const addTable = () => {
		editor
			.chain()
			.focus()
			.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
			.run();
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
				<button
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					disabled={!editor.can().chain().focus().toggleHighlight().run()}
					className={`btn btn-xs ${
						editor.isActive("highlight") ? "btn-primary" : "btn-ghost"
					}`}
					title="Highlight"
				>
					<Highlighter className="size-3" />
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
			</div>

			{/* Block formatting */}
			<div className="flex items-center gap-1 border-r border-base-300 pr-2">
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={`btn btn-xs ${
						editor.isActive("heading", { level: 1 })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Heading 1"
				>
					H1
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={`btn btn-xs ${
						editor.isActive("heading", { level: 2 })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Heading 2"
				>
					H2
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={`btn btn-xs ${
						editor.isActive("heading", { level: 3 })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Heading 3"
				>
					H3
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`btn btn-xs ${
						editor.isActive("bulletList") ? "btn-primary" : "btn-ghost"
					}`}
					title="Bullet List"
				>
					<List className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`btn btn-xs ${
						editor.isActive("orderedList") ? "btn-primary" : "btn-ghost"
					}`}
					title="Ordered List"
				>
					<ListOrdered className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={`btn btn-xs ${
						editor.isActive("blockquote") ? "btn-primary" : "btn-ghost"
					}`}
					title="Blockquote"
				>
					<Quote className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={`btn btn-xs ${
						editor.isActive("codeBlock") ? "btn-primary" : "btn-ghost"
					}`}
					title="Code Block"
				>
					<Code className="size-3" />
				</button>
			</div>

			{/* Alignment */}
			<div className="flex items-center gap-1 border-r border-base-300 pr-2">
				<button
					onClick={() => editor.chain().focus().setTextAlign("left").run()}
					className={`btn btn-xs ${
						editor.isActive("textAlign", { textAlign: "left" })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Align Left"
				>
					<AlignLeft className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign("center").run()}
					className={`btn btn-xs ${
						editor.isActive("textAlign", { textAlign: "center" })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Align Center"
				>
					<AlignCenter className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign("right").run()}
					className={`btn btn-xs ${
						editor.isActive("textAlign", { textAlign: "right" })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Align Right"
				>
					<AlignRight className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign("justify").run()}
					className={`btn btn-xs ${
						editor.isActive("textAlign", { textAlign: "justify" })
							? "btn-primary"
							: "btn-ghost"
					}`}
					title="Justify"
				>
					<AlignJustify className="size-3" />
				</button>
			</div>

			{/* Insert elements */}
			<div className="flex items-center gap-1 border-r border-base-300 pr-2">
				<button
					onClick={addLink}
					className="btn btn-xs btn-ghost"
					title="Add Link"
				>
					<LinkIcon className="size-3" />
				</button>
				<button
					onClick={addImage}
					className="btn btn-xs btn-ghost"
					title="Add Image"
				>
					<ImageIcon className="size-3" />
				</button>
				<button
					onClick={addTable}
					className="btn btn-xs btn-ghost"
					title="Add Table"
				>
					<TableIcon className="size-3" />
				</button>
			</div>

			{/* History */}
			<div className="flex items-center gap-1">
				<button
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					className="btn btn-xs btn-ghost"
					title="Undo"
				>
					<Undo className="size-3" />
				</button>
				<button
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					className="btn btn-xs btn-ghost"
					title="Redo"
				>
					<Redo className="size-3" />
				</button>
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
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder,
			}),
			Highlight,
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
			CodeBlock.configure({
				HTMLAttributes: {
					class:
						"bg-base-200 p-4 rounded-lg overflow-x-auto mb-2 border border-base-300",
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
				class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
			},
		},
	});

	return (
		<div className={`flex flex-col justify-between ${className}`}>
			<EditorContent editor={editor} />
			{editable && <MenuBar editor={editor} />}
		</div>
	);
}
