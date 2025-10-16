"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSession } from "../../hooks/useSession";

interface CompleteSessionFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: {
		id: string;
		goal: string;
		notes?: string;
		deepWorkQuality?: number;
		tags: string[];
	};
	elapsedSeconds: number;
}

export default function CompleteSessionFormModal({
	isOpen,
	onClose,
	session,
	elapsedSeconds,
}: CompleteSessionFormModalProps) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const primaryBtnRef = useRef<HTMLButtonElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notes, setNotes] = useState("");
	const [deepWorkQuality, setDeepWorkQuality] = useState<number | null>(null);
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");

	const { updateSessionMeta, forceStopSession } = useSession();

	// Sync with <dialog>
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			if (!dialog.open) dialog.showModal();
			const t = setTimeout(() => primaryBtnRef.current?.focus(), 0);
			return () => clearTimeout(t);
		} else {
			if (dialog.open) dialog.close();
		}
	}, [isOpen]);

	// Handle dialog close events
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const onClose = () => {
			setIsSubmitting(false);
			onClose();
		};
		dialog.addEventListener("close", onClose);
		return () => dialog.removeEventListener("close", onClose);
	}, [onClose]);

	// Initialize form with session data
	useEffect(() => {
		if (session) {
			setNotes(session.notes || "");
			setDeepWorkQuality(session.deepWorkQuality || null);
			setTags(session.tags || []);
		}
	}, [session]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		}
	};

	const addTag = () => {
		const newTag = tagInput.trim();
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (isSubmitting) return;

			setIsSubmitting(true);
			try {
				// Update session metadata first
				await updateSessionMeta(session.id, {
					notes,
					deepWorkQuality: deepWorkQuality ?? undefined,
					tags,
				});

				// Then stop the session
				await forceStopSession();
				onClose();
			} catch (error) {
				console.error("Failed to complete session:", error);
				// Still close the modal even if there's an error
				onClose();
			} finally {
				setIsSubmitting(false);
			}
		},
		[
			isSubmitting,
			session,
			notes,
			deepWorkQuality,
			tags,
			updateSessionMeta,
			forceStopSession,
			onClose,
		]
	);

	const handleCancel = useCallback(() => {
		onClose();
	}, [onClose]);

	if (!isOpen || !session) return null;

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="complete-session-title"
		>
			<div className="modal-box bg-base-100 border border-border p-0 w-full max-w-2xl">
				<section className="p-6">
					<div className="flex items-start gap-4 mb-6">
						<div className="flex-shrink-0">
							<div className="w-12 h-12 rounded-full bg-info/20 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-info"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						</div>
						<div className="flex-1">
							<h2
								id="complete-session-title"
								className="text-lg font-semibold mb-2"
							>
								Complete Session Form
							</h2>
							<p className="text-base-content/70 mb-4">
								Since you&apos;re stopping early ({formatTime(elapsedSeconds)}),
								this session will be discarded. However, you can still fill out
								this form for your own reference.
							</p>
							<div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-4">
								<p className="text-sm text-info-content">
									<strong>Note:</strong> This session will not be saved to your
									statistics, but you can use this form to reflect on your
									progress.
								</p>
							</div>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Session Goal */}
						<div>
							<label className="label">
								<span className="label-text font-medium">Session Goal</span>
							</label>
							<div className="p-3 bg-base-200 rounded-lg">
								<p className="text-sm">{session.goal}</p>
							</div>
						</div>

						{/* Session Duration */}
						<div>
							<label className="label">
								<span className="label-text font-medium">Duration</span>
							</label>
							<div className="p-3 bg-base-200 rounded-lg">
								<p className="text-sm">{formatTime(elapsedSeconds)}</p>
							</div>
						</div>

						{/* Deep Work Quality Rating */}
						<div>
							<label className="label">
								<span className="label-text font-medium">
									How was your focus quality?
								</span>
							</label>
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
									<button
										key={rating}
										type="button"
										onClick={() => setDeepWorkQuality(rating)}
										className={`btn btn-sm ${
											deepWorkQuality === rating ? "btn-primary" : "btn-ghost"
										}`}
									>
										{rating}
									</button>
								))}
							</div>
						</div>

						{/* Notes */}
						<div>
							<label className="label">
								<span className="label-text font-medium">Notes</span>
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="textarea textarea-bordered w-full"
								placeholder="What did you work on? Any insights or observations?"
								rows={4}
							/>
						</div>

						{/* Tags */}
						<div>
							<label className="label">
								<span className="label-text font-medium">Tags</span>
							</label>
							<div className="space-y-2">
								<div className="flex gap-2">
									<input
										type="text"
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyDown={handleTagInputKeyDown}
										className="input input-bordered flex-1"
										placeholder="Add tags (press Enter or comma to add)"
									/>
									<button
										type="button"
										onClick={addTag}
										className="btn btn-outline"
									>
										Add
									</button>
								</div>
								{tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag, index) => (
											<span
												key={index}
												className="badge badge-outline flex items-center gap-1"
											>
												{tag}
												<button
													type="button"
													onClick={() => removeTag(tag)}
													className="ml-1 text-xs"
												>
													×
												</button>
											</span>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 justify-end pt-4">
							<button
								type="button"
								onClick={handleCancel}
								className="btn btn-ghost"
								disabled={isSubmitting}
							>
								Skip
							</button>
							<button
								ref={primaryBtnRef}
								type="submit"
								className="btn btn-primary"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<span className="loading loading-spinner loading-sm"></span>
										Completing...
									</>
								) : (
									"Complete Session"
								)}
							</button>
						</div>
					</form>
				</section>
			</div>
		</dialog>
	);
}
