"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
// import { useSession } from "../../hooks/useSession";

interface EarlyStopConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	elapsedSeconds: number;
	onProceedToComplete: () => void;
}

export default function EarlyStopConfirmationModal({
	isOpen,
	onClose,
	elapsedSeconds,
	onProceedToComplete,
}: EarlyStopConfirmationModalProps) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const primaryBtnRef = useRef<HTMLButtonElement>(null);
	const [isProceeding, setIsProceeding] = useState(false);

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
			setIsProceeding(false);
			onClose();
		};
		dialog.addEventListener("close", onClose);
		return () => dialog.removeEventListener("close", onClose);
	}, [onClose]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleProceed = useCallback(() => {
		setIsProceeding(true);
		onProceedToComplete();
	}, [onProceedToComplete]);

	const handleCancel = useCallback(() => {
		onClose();
	}, [onClose]);

	if (!isOpen) return null;

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="early-stop-title"
		>
			<div className="modal-box bg-base-100 border border-border p-0 w-full max-w-lg">
				<section className="p-6">
					<div className="flex items-start gap-4 mb-6">
						<div className="flex-shrink-0">
							<div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-warning"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
						</div>
						<div className="flex-1">
							<h2 id="early-stop-title" className="text-lg font-semibold mb-2">
								Session Too Short
							</h2>
							<p className="text-base-content/70 mb-4">
								Your session has only been running for{" "}
								<strong>{formatTime(elapsedSeconds)}</strong>. Sessions shorter
								than 5 minutes are automatically discarded and won&apos;t be
								saved.
							</p>
							<div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
								<p className="text-sm text-warning-content">
									<strong>What happens if you stop now:</strong>
								</p>
								<ul className="text-sm text-warning-content/80 mt-2 space-y-1">
									<li>• Session will be completely discarded</li>
									<li>• No progress will be saved</li>
									<li>• You&apos;ll need to start over</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="flex gap-3 justify-end">
						<button
							ref={primaryBtnRef}
							onClick={handleCancel}
							className="btn btn-ghost"
							disabled={isProceeding}
						>
							Continue Session
						</button>
						<button
							onClick={handleProceed}
							className="btn btn-warning"
							disabled={isProceeding}
						>
							{isProceeding ? (
								<>
									<span className="loading loading-spinner loading-sm"></span>
									Proceeding...
								</>
							) : (
								"Stop Anyway"
							)}
						</button>
					</div>
				</section>
			</div>
		</dialog>
	);
}
