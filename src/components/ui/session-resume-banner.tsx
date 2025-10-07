"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "../../hooks/useSession";

export default function SessionResumeBanner() {
	const router = useRouter();
	const pathname = usePathname();
	const { currentSession, isActive, isPaused, stopSession, dismissSession } =
		useSession();

	const [open, setOpen] = useState(false);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const primaryBtnRef = useRef<HTMLButtonElement>(null);

	// Decide when to show
	useEffect(() => {
		const dismissed = sessionStorage.getItem("df:resume-banner:dismissed");
		const shouldShow = !!currentSession && (isActive || isPaused) && !dismissed;
		setOpen(shouldShow);
	}, [currentSession, isActive, isPaused]);

	// Sync with <dialog>
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open) {
			if (!dialog.open) dialog.showModal();
			const t = setTimeout(() => primaryBtnRef.current?.focus(), 0);
			return () => clearTimeout(t);
		} else {
			if (dialog.open) dialog.close();
		}
	}, [open]);

	// Mark dismissed when the dialog is closed via ESC/backdrop/close
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const onClose = () => {
			sessionStorage.setItem("df:resume-banner:dismissed", "1");
			setOpen(false);
		};
		dialog.addEventListener("close", onClose);
		return () => dialog.removeEventListener("close", onClose);
	}, []);

	const handleReturn = useCallback(() => {
		sessionStorage.setItem("df:resume-banner:dismissed", "1");
		setOpen(false);
		if (pathname !== "/") router.push("/");
	}, [pathname, router]);

	const handleDiscard = useCallback(async () => {
		try {
			await stopSession();
			dismissSession();
		} finally {
			sessionStorage.setItem("df:resume-banner:dismissed", "1");
			setOpen(false);
		}
	}, [stopSession, dismissSession]);

	if (!open) return null;

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="resume-session-title"
		>
			<div className="modal-box bg-base-300 border border-border p-0 w-full max-w-md">
				<section className="p-5">
					<div className="flex items-start justify-between gap-3 pb-4 mb-2">
						<h2 id="resume-session-title" className="font-medium">
							Your session is still active
						</h2>
						<form method="dialog">
							<button
								className="btn btn-ghost btn-sm btn-circle"
								aria-label="Close"
							>
								✕
							</button>
						</form>
					</div>
					<p className="text-sm text-base-content/70">
						It will be auto discarded if you don&apos;t return to it soon.
					</p>

					<div className="mt-5 flex w-full justify-center gap-3">
						<button
							ref={primaryBtnRef}
							onClick={handleReturn}
							className="btn btn-primary"
							style={{ touchAction: "manipulation" }}
							aria-label="Return to session"
						>
							Return to session
						</button>
						<button
							onClick={handleDiscard}
							className="btn btn-ghost"
							style={{ touchAction: "manipulation" }}
							aria-label="Discard session"
						>
							Discard session
						</button>
					</div>
				</section>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button aria-label="Close modal">close</button>
			</form>
		</dialog>
	);
}
