"use client";

/**
 * ContextMenuEditor - A rich text editor with right-click context menu for formatting
 *
 * Features:
 * - Right-click anywhere in the editor to access formatting options
 * - Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline), Ctrl+K (link)
 * - Organized context menu with sections for text formatting, headings, lists, alignment, and media
 * - DaisyUI themed styling that matches the application design
 * - Modal dialogs for adding links and images
 *
 * Usage:
 * - Right-click in the editor to open the context menu
 * - Use keyboard shortcuts for quick formatting
 * - All formatting options show active state with checkmarks
 */

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import * as ContextMenu from "@radix-ui/react-context-menu";
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
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Type,
	Heading1,
	Heading2,
	Heading3,
} from "lucide-react";

interface ContextMenuEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	editable?: boolean;
	className?: string;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	autoFocus?: boolean;
}

const ContextMenuContent = ({ editor }: { editor: any }) => {
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
		<ContextMenu.Content className="min-w-[220px] bg-base-100 rounded-lg shadow-xl border border-base-300 p-1 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
			{/* Text Formatting */}
			<ContextMenu.Group>
				<ContextMenu.Label className="px-2 py-1.5 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
					Text Formatting
				</ContextMenu.Label>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleBold().run()}
				>
					<Bold className="size-4" />
					<span>Bold</span>
					{editor.isActive("bold") && <Check className="size-3 ml-auto" />}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleItalic().run()}
				>
					<Italic className="size-4" />
					<span>Italic</span>
					{editor.isActive("italic") && <Check className="size-3 ml-auto" />}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleStrike().run()}
				>
					<Strikethrough className="size-4" />
					<span>Strikethrough</span>
					{editor.isActive("strike") && <Check className="size-3 ml-auto" />}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleUnderline().run()}
				>
					<UnderlineIcon className="size-4" />
					<span>Underline</span>
					{editor.isActive("underline") && <Check className="size-3 ml-auto" />}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleCode().run()}
				>
					<Code className="size-4" />
					<span>Code</span>
					{editor.isActive("code") && <Check className="size-3 ml-auto" />}
				</ContextMenu.Item>
			</ContextMenu.Group>

			<ContextMenu.Separator className="h-px bg-base-300 my-1" />

			{/* Headings */}
			<ContextMenu.Group>
				<ContextMenu.Label className="px-2 py-1.5 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
					Headings
				</ContextMenu.Label>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					<Heading1 className="size-4" />
					<span>Heading 1</span>
					{editor.isActive("heading", { level: 1 }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					<Heading2 className="size-4" />
					<span>Heading 2</span>
					{editor.isActive("heading", { level: 2 }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				>
					<Heading3 className="size-4" />
					<span>Heading 3</span>
					{editor.isActive("heading", { level: 3 }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().setParagraph().run()}
				>
					<Type className="size-4" />
					<span>Paragraph</span>
					{editor.isActive("paragraph") && <Check className="size-3 ml-auto" />}
				</ContextMenu.Item>
			</ContextMenu.Group>

			<ContextMenu.Separator className="h-px bg-base-300 my-1" />

			{/* Lists */}
			<ContextMenu.Group>
				<ContextMenu.Label className="px-2 py-1.5 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
					Lists
				</ContextMenu.Label>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleBulletList().run()}
				>
					<List className="size-4" />
					<span>Bullet List</span>
					{editor.isActive("bulletList") && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleOrderedList().run()}
				>
					<ListOrdered className="size-4" />
					<span>Numbered List</span>
					{editor.isActive("orderedList") && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().toggleBlockquote().run()}
				>
					<Quote className="size-4" />
					<span>Quote</span>
					{editor.isActive("blockquote") && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
			</ContextMenu.Group>

			<ContextMenu.Separator className="h-px bg-base-300 my-1" />

			{/* Alignment */}
			<ContextMenu.Group>
				<ContextMenu.Label className="px-2 py-1.5 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
					Alignment
				</ContextMenu.Label>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().setTextAlign("left").run()}
				>
					<AlignLeft className="size-4" />
					<span>Align Left</span>
					{editor.isActive({ textAlign: "left" }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().setTextAlign("center").run()}
				>
					<AlignCenter className="size-4" />
					<span>Align Center</span>
					{editor.isActive({ textAlign: "center" }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().setTextAlign("right").run()}
				>
					<AlignRight className="size-4" />
					<span>Align Right</span>
					{editor.isActive({ textAlign: "right" }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => editor.chain().focus().setTextAlign("justify").run()}
				>
					<AlignJustify className="size-4" />
					<span>Justify</span>
					{editor.isActive({ textAlign: "justify" }) && (
						<Check className="size-3 ml-auto" />
					)}
				</ContextMenu.Item>
			</ContextMenu.Group>

			<ContextMenu.Separator className="h-px bg-base-300 my-1" />

			{/* Media */}
			<ContextMenu.Group>
				<ContextMenu.Label className="px-2 py-1.5 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
					Media
				</ContextMenu.Label>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => setShowLinkForm(true)}
				>
					<LinkIcon className="size-4" />
					<span>Add Link</span>
				</ContextMenu.Item>
				<ContextMenu.Item
					className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-base-200 focus:bg-base-200 focus:outline-none"
					onSelect={() => setShowImageForm(true)}
				>
					<ImageIcon className="size-4" />
					<span>Add Image</span>
				</ContextMenu.Item>
			</ContextMenu.Group>

			{/* Link Form Modal */}
			{showLinkForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-base-100 rounded-lg p-6 w-96 max-w-[90vw]">
						<h3 className="text-lg font-semibold mb-4">Add Link</h3>
						<div className="space-y-3">
							<input
								type="text"
								placeholder="Link text"
								className="input input-bordered w-full"
								value={linkText}
								onChange={(e) => setLinkText(e.target.value)}
								onKeyDown={handleLinkKeyDown}
								autoFocus
							/>
							<input
								type="url"
								placeholder="URL"
								className="input input-bordered w-full"
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
								onKeyDown={handleLinkKeyDown}
							/>
						</div>
						<div className="flex gap-2 mt-4">
							<button className="btn btn-sm btn-ghost" onClick={cancelLink}>
								Cancel
							</button>
							<button
								className="btn btn-sm btn-primary"
								onClick={addLink}
								disabled={!linkUrl.trim() || !linkText.trim()}
							>
								Add Link
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Image Form Modal */}
			{showImageForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-base-100 rounded-lg p-6 w-96 max-w-[90vw]">
						<h3 className="text-lg font-semibold mb-4">Add Image</h3>
						<div className="space-y-3">
							<input
								type="url"
								placeholder="Image URL"
								className="input input-bordered w-full"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								onKeyDown={handleImageKeyDown}
								autoFocus
							/>
							<input
								type="text"
								placeholder="Alt text (optional)"
								className="input input-bordered w-full"
								value={imageAlt}
								onChange={(e) => setImageAlt(e.target.value)}
								onKeyDown={handleImageKeyDown}
							/>
						</div>
						<div className="flex gap-2 mt-4">
							<button className="btn btn-sm btn-ghost" onClick={cancelImage}>
								Cancel
							</button>
							<button
								className="btn btn-sm btn-primary"
								onClick={addImage}
								disabled={!imageUrl.trim()}
							>
								Add Image
							</button>
						</div>
					</div>
				</div>
			)}
		</ContextMenu.Content>
	);
};

export default function ContextMenuEditor({
	content,
	onChange,
	placeholder = "Start writing...",
	editable = true,
	className = "",
	onKeyDown,
	autoFocus,
}: ContextMenuEditorProps) {
	const [isFocused, setIsFocused] = useState(false);
	const editor = useEditor({
		onCreate: ({ editor }) => {
			console.log(
				"Editor created with extensions:",
				editor.extensionManager.extensions.map((ext) => ext.name)
			);
		},
		extensions: [
			StarterKit.configure({
				codeBlock: {},
				code: {},
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
			Underline,
			HardBreak.configure({
				HTMLAttributes: {
					style: "line-height: 1.5;",
				},
			}),
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
				title:
					"Right-click for formatting • Ctrl+B (bold) • Ctrl+I (italic) • Ctrl+U (underline)",
			},
			handleDOMEvents: {
				focus: () => {
					setIsFocused(true);
					return false;
				},
				blur: () => {
					setIsFocused(false);
					return false;
				},
			},
			handleKeyDown: (view, event) => {
				// Handle keyboard shortcuts
				if (event.ctrlKey || event.metaKey) {
					switch (event.key.toLowerCase()) {
						case "b":
							event.preventDefault();
							editor?.chain().focus().toggleBold().run();
							return true;
						case "i":
							event.preventDefault();
							editor?.chain().focus().toggleItalic().run();
							return true;
						case "u":
							event.preventDefault();
							editor?.chain().focus().toggleUnderline().run();
							return true;
						case "k":
							event.preventDefault();
							// You could add a quick link dialog here
							return true;
					}
				}

				// Handle Enter key in lists to continue list items
				if (event.key === "Enter" && !event.shiftKey) {
					const { state, dispatch } = view;
					const { selection } = state;
					const { $from } = selection;

					// Check if we're in a list item
					const listItem = $from.node($from.depth - 1);
					const list = $from.node($from.depth - 2);

					if (
						listItem &&
						listItem.type.name === "listItem" &&
						(list.type.name === "bulletList" ||
							list.type.name === "orderedList")
					) {
						// Let TipTap handle list continuation naturally
						return false;
					}
				}

				// Handle shift+enter and escape for external key handlers (save/cancel)
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

	// If not editable, render without context menu
	if (!editable) {
		return (
			<div className={`flex flex-col justify-between ${className}`}>
				<EditorContent editor={editor} />
			</div>
		);
	}

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger asChild>
				<div className={`flex flex-col justify-between ${className}`}>
					<EditorContent editor={editor} />
					{/* Helper text that appears when focused */}
					{isFocused && editable && (
						<div className="text-xs badge badge-ghost rounded-box mb-2 ml-2 text-base-content/50 mt-1 px-1 flex items-center gap-1 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
							<span>💡</span>
							<span>Right-click for formatting options</span>
						</div>
					)}
				</div>
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenuContent editor={editor} />
			</ContextMenu.Portal>
		</ContextMenu.Root>
	);
}
