"use client";

import React, { useEffect, useRef } from "react";
import { createEditor } from "@/src/lib/milkdown-helpers";
import { logger } from "../../lib/logger";

interface MilkdownEditorProps {
	content: string;
	onChange: (markdown: string) => void;
	className?: string;
	autoFocus?: boolean;
	placeholder?: string;
}

export default function MilkdownEditor({
	content,
	onChange,
	className = "",
	autoFocus = false,
	placeholder,
}: MilkdownEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const editorInstanceRef = useRef<any>(null);
	const onChangeRef = useRef(onChange);

	// Keep onChange ref up to date
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (!editorRef.current) return;

		let isActive = true;

		// Ensure container is empty before creating a new editor
		editorRef.current.innerHTML = "";

		// Clean up existing editor if it exists
		if (editorInstanceRef.current) {
			try {
				editorInstanceRef.current.destroy();
			} catch (e) {
				logger.warn("MilkdownEditor - Error destroying editor", { error: e });
			}
			editorInstanceRef.current = null;
		}

		// Create editor instance
		const initEditor = async () => {
			try {
				const instance = await createEditor({
					root: editorRef.current!,
					defaultValue: content,
					onChange: (markdown: string) => {
						logger.debug("MilkdownEditor - Content changed", {
							contentLength: markdown.length,
						});
						onChangeRef.current(markdown);
					},
					placeholder,
				});

				// If effect has been cleaned up, immediately destroy stray instance
				if (!isActive) {
					try {
						instance.destroy();
					} catch (e) {
						logger.warn("MilkdownEditor - Error destroying stray instance", {
							error: e,
						});
					}
					return;
				}

				editorInstanceRef.current = instance;

				// Auto-focus if requested
				if (autoFocus) {
					setTimeout(() => {
						if (!isActive) return;
						const editorElement = editorRef.current?.querySelector(
							'[contenteditable="true"]'
						) as HTMLElement;
						if (editorElement) {
							editorElement.focus();
						}
					}, 100);
				}
			} catch (error) {
				logger.error(
					"MilkdownEditor - Failed to create editor",
					error as Error
				);
			}
		};

		initEditor();

		// Cleanup on unmount
		return () => {
			isActive = false;
			if (editorInstanceRef.current) {
				try {
					editorInstanceRef.current.destroy();
				} catch (e) {
					console.warn("Error during cleanup:", e);
				}
				editorInstanceRef.current = null;
			}
			if (editorRef.current) {
				editorRef.current.innerHTML = "";
			}
		};
	}, []); // Only run once on mount

	// Note: Content updates are handled by recreating the editor instance
	// This ensures the editor always reflects the current note content

	return <div ref={editorRef} className={className} />;
}
