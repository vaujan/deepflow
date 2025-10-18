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
	const [dontAskAgain, setDontAskAgain] = useState(false);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const primaryBtnRef = useRef<HTMLButtonElement>(null);

	// Decide when to show - only on home page
	useEffect(() => {
		const dismissed = localStorage.getItem("df:resume-banner:dismissed");
		const shouldShow =
			!!currentSession &&
			(isActive || isPaused) &&
			!dismissed &&
			pathname === "/";
		setOpen(shouldShow);
	}, [currentSession, isActive, isPaused, pathname]);

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
			if (dontAskAgain) {
				localStorage.setItem("df:resume-banner:dismissed", "1");
			} else {
				sessionStorage.setItem("df:resume-banner:dismissed", "1");
			}
			setOpen(false);
		};
		dialog.addEventListener("close", onClose);
		return () => dialog.removeEventListener("close", onClose);
	}, [dontAskAgain]);

	const handleReturn = useCallback(() => {
		if (dontAskAgain) {
			localStorage.setItem("df:resume-banner:dismissed", "1");
		} else {
			sessionStorage.setItem("df:resume-banner:dismissed", "1");
		}
		setOpen(false);
		if (pathname !== "/") router.push("/");
	}, [pathname, router, dontAskAgain]);

	const handleDiscard = useCallback(async () => {
		try {
			await stopSession();
			dismissSession();
		} finally {
			if (dontAskAgain) {
				localStorage.setItem("df:resume-banner:dismissed", "1");
			} else {
				sessionStorage.setItem("df:resume-banner:dismissed", "1");
			}
			setOpen(false);
		}
	}, [stopSession, dismissSession, dontAskAgain]);

	if (!open) return null;

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="resume-session-title"
		>
			<div className="modal-box bg-base-100 border border-border p-0 w-full max-w-2xl">
				<section className="p-6">
					<div className="flex items-start justify-between gap-3 mb-4">
						<h2
							id="resume-session-title"
							className="text-lg font-semibold text-base-content"
						>
							Complete your focus session?
						</h2>
						<form method="dialog">
							<button
								className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
								aria-label="Close"
							>
								✕
							</button>
						</form>
					</div>
					<p className="text-base-content/80 leading-relaxed mb-6">
						It looks like you&apos;re leaving your focus session. Every
						completed session helps build better focus habits and tracks your
						progress.
					</p>

					<div className="flex items-center justify-between w-full gap-3">
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="dont-ask-again"
								checked={dontAskAgain}
								onChange={(e) => setDontAskAgain(e.target.checked)}
								className="checkbox checkbox-sm"
								aria-describedby="dont-ask-again-label"
							/>
							<label
								htmlFor="dont-ask-again"
								id="dont-ask-again-label"
								className="text-sm text-base-content/80 cursor-pointer select-none"
							>
								Don&apos;t ask me again
							</label>
						</div>

						<div className="flex gap-3">
							{/* <button
								onClick={handleDiscard}
								className="btn btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200"
								style={{ touchAction: "manipulation" }}
								aria-label="Discard session"
							>
								I&apos;ll finish later
							</button> */}
							<button
								ref={primaryBtnRef}
								onClick={handleReturn}
								className="btn btn-primary bg-primary text-primary-content hover:bg-primary/90"
								style={{ touchAction: "manipulation" }}
								aria-label="Return to session"
							>
								Let&apos;s Complete
							</button>
						</div>
					</div>
				</section>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button aria-label="Close modal">close</button>
			</form>
		</dialog>
	);
}
