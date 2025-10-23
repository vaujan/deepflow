// Helper functions for Milkdown editor setup
import { Editor, defaultValueCtx, rootCtx } from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { history } from "@milkdown/plugin-history";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";

export interface CreateEditorOptions {
	root: HTMLElement;
	defaultValue?: string;
	onChange?: (markdown: string) => void;
	placeholder?: string;
}

export async function createEditor(options: CreateEditorOptions) {
	const { root, defaultValue = "", onChange, placeholder } = options;

	const editor = await Editor.make()
		.config((ctx) => {
			ctx.set(rootCtx, root);
			ctx.set(defaultValueCtx, defaultValue);
		})
		.config(nord)
		.use(commonmark)
		.use(history)
		.use(listener)
		.create();

	// Configure listener after editor is created
	if (onChange) {
		editor.action((ctx) => {
			const listener = ctx.get(listenerCtx);
			listener.markdownUpdated((_ctx, markdown) => {
				onChange(markdown);
			});
		});
	}

	// Add placeholder if provided and content is empty
	if (placeholder && (!defaultValue || defaultValue.trim() === "")) {
		const editorElement = root.querySelector(
			'[contenteditable="true"]'
		) as HTMLElement;
		if (editorElement) {
			editorElement.setAttribute("data-placeholder", placeholder);
			editorElement.style.position = "relative";

			// Add placeholder styling
			const style = document.createElement("style");
			style.textContent = `
				[data-placeholder]:empty::before {
					content: attr(data-placeholder);
					position: absolute;
					color: #9ca3af;
					pointer-events: none;
					font-style: italic;
				}
			`;
			document.head.appendChild(style);
		}
	}

	// Enable opening links on click (commonmark already parses [text](url)).
	// Attach to root in capture phase to bypass ProseMirror's internal handlers.
	try {
		const handleClick = (e: Event) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;
			const anchor = target.closest("a") as HTMLAnchorElement | null;
			if (!anchor) return;
			const href = anchor.getAttribute("href");
			if (!href) return;
			e.preventDefault();
			e.stopPropagation();
			window.open(href, "_blank", "noopener,noreferrer");
		};
		root.addEventListener("click", handleClick, { capture: true });
	} catch {}

	return editor;
}
