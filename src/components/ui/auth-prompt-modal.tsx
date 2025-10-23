"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import Image from "next/image";

interface AuthPromptModalProps {
	onClose: () => void;
}

export default function AuthPromptModal({ onClose }: AuthPromptModalProps) {
	const router = useRouter();
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	// Sync open state with <dialog>
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		dialog.showModal();
	}, []);

	// Close handler (ESC, backdrop, header close)
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const handleClose = () => {
			onClose();
		};
		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	const handleSignUp = () => {
		router.push("/login");
		onClose();
	};

	const handleLogIn = () => {
		router.push("/login");
		onClose();
	};

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="auth-prompt-title"
		>
			<div className="modal-box bg-base-300 border border-border p-0 w-full max-w-xl">
				<div className="p-5">
					<div className="flex items-start justify-between gap-3 pb-4 mb-4">
						<div>
							<h2 id="auth-prompt-title" className="font-medium">
								Sign in to start sessions
							</h2>
							<p className="text-sm text-base-content/70">
								Track your deep work sessions and view your progress
							</p>
						</div>
						<form method="dialog">
							<button
								className="btn btn-ghost btn-sm btn-circle"
								aria-label="Close modal"
							>
								✕
							</button>
						</form>
					</div>

					<div className="space-y-4">
						<div className="bg-base-200 rounded-lg p-4 space-y-2">
							<h3 className="font-medium text-sm">With an account you can:</h3>
							<ul className="text-xs text-base-content/70 space-y-1">
								<li>• Track your focus sessions and time</li>
								<li>• View detailed statistics and progress</li>
								<li>• Sync your data across devices</li>
								<li>• Save session notes and ratings</li>
							</ul>
						</div>

						<div className="mt-4">
							<Image
								src="/onboarding-4.png"
								alt="Stats page showing active days and total focus time"
								width={720}
								height={420}
								className="w-full h-auto rounded-lg border border-base-300"
							/>
						</div>

						<div className="flex gap-3">
							<button onClick={handleSignUp} className="btn btn-primary flex-1">
								<UserPlus className="size-4" />
								Sign Up
							</button>
							<button onClick={handleLogIn} className="btn btn-outline flex-1">
								<LogIn className="size-4" />
								Log In
							</button>
						</div>

						<p className="text-xs text-base-content/50 text-center">
							You can still use notes and tasks without an account
						</p>
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button aria-label="Close modal">close</button>
			</form>
		</dialog>
	);
}
