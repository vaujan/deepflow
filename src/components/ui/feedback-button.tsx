"use client";

import React, { useRef, useState } from "react";
import FeedbackModal from "./feedback-modal";
import { Mail } from "lucide-react";

export default function FeedbackButton() {
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	return (
		<>
			<div
				className="fixed bottom-6 left-6 z-50"
				style={{ pointerEvents: "none" }}
			>
				<button
					ref={buttonRef}
					className="btn shadow-lg opacity-80 backdrop-blur-md btn-circle"
					aria-label="Give feedback"
					onClick={() => setOpen(true)}
					style={{ pointerEvents: "auto" }}
				>
					<Mail className="size-4" />
				</button>
			</div>
			<FeedbackModal
				isOpen={open}
				onClose={() => setOpen(false)}
				returnFocusRef={buttonRef}
			/>
		</>
	);
}
