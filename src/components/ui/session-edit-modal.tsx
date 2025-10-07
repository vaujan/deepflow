"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DataItem } from "../../data/mockDataTable";
import { useUpdateSession } from "@/src/hooks/useSessionsQuery";
import { useUnsavedChanges } from "@/src/contexts/UnsavedChangesContext";

interface SessionEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: DataItem | null;
	onSuccess?: () => void;
	returnFocusRef?:
		| React.RefObject<HTMLElement | null>
		| React.RefObject<HTMLButtonElement | null>;
}

export function SessionEditModal({
	isOpen,
	onClose,
	session,
	onSuccess,
	returnFocusRef,
}: SessionEditModalProps) {
	const [formData, setFormData] = useState<Partial<DataItem>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [statusMessage, setStatusMessage] = useState("");
	const updateSession = useUpdateSession();
	const { setDirty } = useUnsavedChanges();
	const DIRTY_ID = "session-edit";

	// Modal refs and state
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const firstFieldRef = useRef<HTMLInputElement | null>(null);
	const wasOpenRef = useRef<boolean>(false);

	// Initialize form data when session changes
	useEffect(() => {
		if (session) {
			setFormData({
				goal: session.goal,
				sessionType: session.sessionType,
				duration: session.duration,
				focusLevel: session.focusLevel ?? undefined,
				quality: session.quality,
				notes: session.notes,
				tags: session.tags,
				sessionDate: session.sessionDate,
			});
			setErrors({});
			setDirty(DIRTY_ID, false);
		}
	}, [session]);

	// Sync open state with <dialog>
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			if (!dialog.open) dialog.showModal();
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

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.goal?.trim()) {
			newErrors.goal = "Goal is required";
		}

		if (typeof formData.duration === "number" && formData.duration < 0) {
			newErrors.duration = "Duration must be 0 or greater";
		}

		if (
			typeof formData.focusLevel === "number" &&
			(formData.focusLevel < 1 || formData.focusLevel > 10)
		) {
			newErrors.focusLevel = "Focus level must be between 1 and 10";
		}

		if (
			typeof formData.quality === "number" &&
			(formData.quality < 1 || formData.quality > 10)
		) {
			newErrors.quality = "Quality must be between 1 and 10";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session || !validateForm()) {
			// Focus first error field
			if (errors.goal) firstFieldRef.current?.focus();
			return;
		}

		// Map form data to API payload
		const payload: Record<string, any> = {};
		if (formData.goal !== session.goal) payload.goal = formData.goal;
		if (formData.sessionType !== session.sessionType)
			payload.sessionType = formData.sessionType;
		if (formData.duration !== session.duration)
			payload.duration = formData.duration;
		if (formData.focusLevel !== session.focusLevel)
			payload.focusLevel = formData.focusLevel;
		if (formData.quality !== session.quality)
			payload.deepWorkQuality = formData.quality;
		if (formData.notes !== session.notes) payload.notes = formData.notes;
		if (JSON.stringify(formData.tags) !== JSON.stringify(session.tags))
			payload.tags = formData.tags;
		if (formData.sessionDate !== session.sessionDate)
			payload.sessionDate = formData.sessionDate;

		if (Object.keys(payload).length === 0) {
			setDirty(DIRTY_ID, false);
			onClose();
			return;
		}

		setIsSubmitting(true);
		try {
			await updateSession.mutateAsync({ id: session.id, payload });

			// Build revert payload from original values for fields we changed
			const revertPayload: Record<string, any> = {};
			if ("goal" in payload) revertPayload.goal = session.goal;
			if ("sessionType" in payload)
				revertPayload.sessionType = session.sessionType;
			if ("duration" in payload) revertPayload.duration = session.duration;
			if ("focusLevel" in payload)
				revertPayload.focusLevel = session.focusLevel;
			if ("deepWorkQuality" in payload)
				revertPayload.deepWorkQuality = session.quality;
			if ("notes" in payload) revertPayload.notes = session.notes;
			if ("tags" in payload) revertPayload.tags = session.tags;
			if ("sessionDate" in payload)
				revertPayload.sessionDate = session.sessionDate;

			toast.success("Session updated", {
				description: "Your changes have been saved",
				action: {
					label: "Undo",
					onClick: async () => {
						try {
							await updateSession.mutateAsync({
								id: session.id,
								payload: revertPayload,
							});
							setStatusMessage("Changes reverted");
							toast.success("Reverted", {
								description: "Previous values restored",
							});
						} catch (err: any) {
							toast.error("Failed to revert", {
								description: err?.message || "Try again",
							});
						}
					},
				},
			});
			setStatusMessage("Saved");
			setDirty(DIRTY_ID, false);
			onSuccess?.();
			onClose();
		} catch (error: any) {
			toast.error("Failed to update session", {
				description: error?.message || "Please try again later",
			});
			console.error("Failed to update session:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Keyboard: Ctrl/Cmd+Enter submits when textarea focused
	const onTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			handleSubmit(e);
		}
	};

	// Mark dirty on any field change
	const onFieldChange = <K extends keyof DataItem>(
		key: K,
		value: DataItem[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		setDirty(DIRTY_ID, true);
	};

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="session-edit-title"
		>
			<div className="modal-box bg-base-300 border max-h-[700px] scrollbar-thin border-border p-0 w-full max-w-2xl">
				<section className="w-full p-5 h-full">
					<div className="flex items-start justify-between gap-3 pb-4 mb-4">
						<p role="status" aria-live="polite" className="sr-only">
							{statusMessage}
						</p>
						<div>
							<h2 id="session-edit-title" className="font-medium">
								Edit Session
							</h2>
							<p className="text-sm text-base-content/70">
								Update session details and metadata.
							</p>
						</div>
						<form method="dialog">
							<button
								className="btn btn-ghost btn-sm btn-circle"
								aria-label="Close session editor"
							>
								✕
							</button>
						</form>
					</div>

					<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
						{/* Goal */}
						<div className="form-control">
							<label className="label">
								<span className="label-text text-sm font-medium">Goal</span>
							</label>
							<input
								ref={firstFieldRef}
								type="text"
								className={`input w-full border-0 shadow-none ${
									errors.goal ? "input-error" : ""
								}`}
								value={formData.goal || ""}
								onChange={(e) => onFieldChange("goal", e.target.value as any)}
								placeholder="What did you work on?"
								aria-invalid={!!errors.goal}
								aria-describedby={errors.goal ? "goal-error" : undefined}
								style={{ fontSize: 16 }}
							/>
							{errors.goal && (
								<div
									id="goal-error"
									className="text-xs text-error mt-1"
									role="alert"
								>
									{errors.goal}
								</div>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Session Type */}
							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm font-medium">
										Session Type
									</span>
								</label>
								<select
									className="select w-full border-0 shadow-none"
									value={formData.sessionType || "planned session"}
									onChange={(e) =>
										onFieldChange("sessionType" as any, e.target.value as any)
									}
								>
									<option value="planned session">Planned Session</option>
									<option value="open session">Open Session</option>
								</select>
							</div>

							{/* Duration */}
							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm font-medium">
										Duration (minutes)
									</span>
								</label>
								<input
									type="number"
									min="0"
									className={`input w-full border-0 shadow-none ${
										errors.duration ? "input-error" : ""
									}`}
									value={formData.duration || 0}
									onChange={(e) =>
										onFieldChange(
											"duration",
											(Number(e.target.value) || 0) as any
										)
									}
									aria-invalid={!!errors.duration}
									aria-describedby={
										errors.duration ? "duration-error" : undefined
									}
								/>
								{errors.duration && (
									<div
										id="duration-error"
										className="text-xs text-error mt-1"
										role="alert"
									>
										{errors.duration}
									</div>
								)}
							</div>

							{/* Session Date */}
							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm font-medium">
										Session Date
									</span>
								</label>
								<input
									type="date"
									className="input w-full border-0 shadow-none"
									value={formData.sessionDate || ""}
									onChange={(e) =>
										onFieldChange("sessionDate" as any, e.target.value as any)
									}
								/>
							</div>

							{/* Focus Level */}
							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm font-medium">
										Focus Level (1-10)
									</span>
								</label>
								<input
									type="number"
									min="1"
									max="10"
									className={`input w-full border-0 shadow-none ${
										errors.focusLevel ? "input-error" : ""
									}`}
									value={formData.focusLevel || 5}
									onChange={(e) =>
										onFieldChange(
											"focusLevel" as any,
											Number(e.target.value) as any
										)
									}
									aria-invalid={!!errors.focusLevel}
									aria-describedby={
										errors.focusLevel ? "focus-error" : undefined
									}
								/>
								{errors.focusLevel && (
									<div
										id="focus-error"
										className="text-xs text-error mt-1"
										role="alert"
									>
										{errors.focusLevel}
									</div>
								)}
							</div>

							{/* Quality */}
							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm font-medium">
										Quality (1-10)
									</span>
								</label>
								<input
									type="number"
									min="1"
									max="10"
									className={`input w-full border-0 shadow-none ${
										errors.quality ? "input-error" : ""
									}`}
									value={formData.quality || 5}
									onChange={(e) =>
										onFieldChange(
											"quality" as any,
											Number(e.target.value) as any
										)
									}
									aria-invalid={!!errors.quality}
									aria-describedby={
										errors.quality ? "quality-error" : undefined
									}
								/>
								{errors.quality && (
									<div
										id="quality-error"
										className="text-xs text-error mt-1"
										role="alert"
									>
										{errors.quality}
									</div>
								)}
							</div>
						</div>

						{/* Tags */}
						<div className="form-control">
							<label className="label">
								<span className="label-text text-sm font-medium">Tags</span>
							</label>
							<input
								type="text"
								className="input w-full border-0 shadow-none"
								placeholder="tag1, tag2, tag3"
								value={(formData.tags || []).join(", ")}
								onChange={(e) =>
									onFieldChange(
										"tags" as any,
										e.target.value
											.split(",")
											.map((t) => t.trim())
											.filter(Boolean) as any
									)
								}
							/>
							<label className="label">
								<p className="text-xs text-base-content/70">
									Separate tags with commas
								</p>
							</label>
						</div>

						{/* Notes */}
						<div className="form-control">
							<label className="label">
								<span className="label-text text-sm font-medium">Notes</span>
							</label>
							<textarea
								className="textarea border-0 shadow-none w-full min-h-32 leading-relaxed"
								placeholder="Any additional notes about this session..."
								value={formData.notes || ""}
								onChange={(e) =>
									onFieldChange("notes" as any, e.target.value as any)
								}
								onKeyDown={onTextAreaKeyDown}
							/>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end gap-2 mt-2">
							<button
								type="button"
								className="btn btn-ghost"
								aria-label="Cancel editing"
								onClick={() => dialogRef.current?.close()}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary w-full sm:w-auto"
								disabled={isSubmitting}
								aria-busy={isSubmitting}
							>
								{isSubmitting && (
									<Loader2
										className="size-4 animate-spin mr-2"
										aria-hidden="true"
									/>
								)}
								<Save className="size-4 mr-2" />
								Save Changes
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
