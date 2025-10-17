"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useUnsavedChanges } from "@/src/contexts/UnsavedChangesContext";
import {
	Bug,
	Lightbulb,
	MessageSquare,
	Smile,
	Meh,
	Frown,
	Loader2,
} from "lucide-react";

type FeedbackCategory = "bug" | "idea" | "other";

interface FeedbackModalProps {
	isOpen: boolean;
	onClose: () => void;
	returnFocusRef?:
		| React.RefObject<HTMLElement | null>
		| React.RefObject<HTMLButtonElement | null>;
}

export default function FeedbackModal({
	isOpen,
	onClose,
	returnFocusRef,
}: FeedbackModalProps) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const firstFieldRef = useRef<HTMLTextAreaElement | null>(null);
	const wasOpenRef = useRef<boolean>(false);
	const { setDirty } = useUnsavedChanges();
	const DIRTY_ID = "feedback-modal";

	const [category, setCategory] = useState<FeedbackCategory>("idea");
	const [message, setMessage] = useState("");
	const [rating, setRating] = useState<number | undefined>(undefined);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [mood, setMood] = useState<"happy" | "neutral" | "sad" | undefined>(
		undefined
	);

	// Sync open state with <dialog>
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			if (!dialog.open) dialog.showModal();
			setDirty(DIRTY_ID, false);
		} else {
			if (dialog.open) dialog.close();
		}
	}, [isOpen]);

	// Focus management: focus first field when opened
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			// Slight delay ensures element is available
			setTimeout(() => firstFieldRef.current?.focus(), 0);
		}
	}, [isOpen]);

	// Close handler (ESC, backdrop, header close)
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const handleClose = () => {
			setDirty(DIRTY_ID, false);
			onClose();
		};
		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	// Return focus to provided ref after close
	useEffect(() => {
		if (wasOpenRef.current && !isOpen) {
			returnFocusRef?.current?.focus?.();
		}
		wasOpenRef.current = isOpen;
	}, [isOpen, returnFocusRef]);

	const remaining = useMemo(
		() => Math.max(0, 4000 - message.length),
		[message.length]
	);

	const toIdempotencyKey = (prefix: string) => {
		try {
			return `${prefix}-${crypto.randomUUID()}`;
		} catch {
			return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		}
	};

	const validate = () => {
		const e: Record<string, string> = {};
		if (message.trim().length < 5)
			e.message = "Please add at least 5 characters.";
		if (!(["bug", "idea", "other"] as const).includes(category))
			e.category = "Pick a category.";
		if (typeof rating !== "undefined") {
			const r = Number(rating);
			if (!Number.isFinite(r) || r < 1 || r > 5)
				e.rating = "Rating must be 1–5.";
		}
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const onSubmit = async (ev?: React.FormEvent) => {
		ev?.preventDefault();
		if (!validate()) {
			// Focus first error field
			if (errors.message) firstFieldRef.current?.focus();
			return;
		}
		setSubmitting(true);
		try {
			const res = await fetch("/api/feedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": toIdempotencyKey("feedback:create"),
					"X-App-Version": process.env.NEXT_PUBLIC_APP_VERSION || "beta",
				},
				body: JSON.stringify({
					category,
					message: message.trim(),
					rating: typeof rating === "number" ? rating : undefined,
					metadata: {
						mood: mood || null,
					},
					page_url:
						typeof window !== "undefined" ? window.location.href : undefined,
				}),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data?.error || "Failed to submit feedback");
			toast.success("Thanks for your feedback!");
			setMessage("");
			setRating(undefined);
			setCategory("idea");
			setMood(undefined);
			setDirty(DIRTY_ID, false);
			onClose();
		} catch (err: any) {
			toast.error(err?.message || "Could not send feedback");
		} finally {
			setSubmitting(false);
		}
	};

	// Keyboard: Ctrl/Cmd+Enter submits when textarea focused
	const onTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			onSubmit();
		}
	};

	return (
		<dialog ref={dialogRef} className="modal" aria-labelledby="feedback-title">
			<div className="modal-box bg-base-300 border border-border p-0 w-full max-w-2xl">
				<section className="w-full p-5">
					<div className="flex items-start justify-between gap-3 pb-4 mb-4">
						<div>
							<h2 id="feedback-title" className="font-medium">
								Send feedback
							</h2>
							<p className="text-sm text-base-content/70">
								Help us improve Deepflow.
							</p>
						</div>
						<form method="dialog">
							<button
								className="btn btn-ghost btn-sm btn-circle"
								aria-label="Close feedback"
							>
								✕
							</button>
						</form>
					</div>

					<form className="flex flex-col gap-6" onSubmit={onSubmit}>
						<fieldset
							className="flex flex-wrap items-center gap-3"
							aria-label="Category"
						>
							{(
								[
									{ key: "bug", Icon: Bug, text: "I found a bug" },
									{
										key: "idea",
										Icon: Lightbulb,
										text: "I want to suggest a feature",
									},
									{ key: "other", Icon: MessageSquare, text: "Something else" },
								] as const
							).map(({ key, Icon, text }) => {
								const selected = category === key;
								return (
									<label
										key={key}
										className={`inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 cursor-pointer transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-primary ${
											selected
												? "bg-primary/15 border-primary"
												: "hover:bg-base-200/60"
										}`}
									>
										<input
											type="radio"
											name="category"
											className="sr-only"
											value={key}
											checked={selected}
											onChange={() => setCategory(key)}
										/>
										<Icon className="size-4" aria-hidden="true" />
										<span className="label-text text-sm">{text}</span>
									</label>
								);
							})}
						</fieldset>

						<div className="form-control">
							<textarea
								id="feedback-message"
								ref={firstFieldRef}
								className={`textarea scrollbar-thin w-full shadow-none border-0 min-h-48 leading-relaxed ${
									errors.message ? "textarea-error" : ""
								}`}
								placeholder={
									category === "bug"
										? "Describe what’s broken, steps to reproduce, expected vs. actual…"
										: category === "idea"
										? "I want to suggest a feature… What problem would it solve?"
										: "Tell us what’s on your mind…"
								}
								value={message}
								onChange={(e) => {
									setMessage(e.target.value);
									setDirty(DIRTY_ID, e.target.value.trim().length > 0);
								}}
								onKeyDown={onTextAreaKeyDown}
								maxLength={4000}
								spellCheck={true}
								aria-invalid={!!errors.message}
								aria-describedby="feedback-message-help"
								style={{ fontSize: 16 }}
							/>
							<div className="flex items-center justify-between mt-4">
								{remaining < 200 && (
									<span className="text-xs text-base-content/50">
										{remaining} characters left
									</span>
								)}
							</div>
							{errors.message && (
								<div className="text-xs text-error mt-1" role="alert">
									{errors.message}
								</div>
							)}
						</div>

						<div className="flex items-center justify-end gap-2 mt-2">
							<button
								type="button"
								className="btn btn-ghost"
								aria-label="Cancel feedback"
								onClick={() => dialogRef.current?.close()}
							>
								Cancel
							</button>
							<button
								type="submit"
								className={`btn btn-primary w-full sm:w-auto`}
								disabled={submitting}
								aria-busy={submitting}
							>
								{submitting && (
									<Loader2
										className="size-4 animate-spin mr-2"
										aria-hidden="true"
									/>
								)}
								Send feedback
							</button>
						</div>
					</form>
				</section>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button aria-label="Close modal">close</button>
			</form>
		</dialog>
	);
}
