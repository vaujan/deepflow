import React, { useEffect } from "react";
import { CheckCircle, Pause, Play, Square, X } from "lucide-react";

interface ToastProps {
	message: string;
	type: "success" | "info" | "warning" | "error";
	isVisible: boolean;
	onClose: () => void;
	duration?: number;
}

const toastIcons = {
	success: CheckCircle,
	info: Play,
	warning: Pause,
	error: Square,
};

const toastColors = {
	success: "bg-success text-success-content",
	info: "bg-info text-info-content",
	warning: "bg-warning text-warning-content",
	error: "bg-error text-error-content",
};

export default function Toast({
	message,
	type,
	isVisible,
	onClose,
	duration = 3000,
}: ToastProps) {
	const Icon = toastIcons[type];

	useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	if (!isVisible) return null;

	return (
		<div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
			<div className={`toast ${toastColors[type]} shadow-lg`}>
				<div className="flex items-center gap-2">
					<Icon className="size-5" />
					<span className="font-medium">{message}</span>
					<button
						onClick={onClose}
						className="btn btn-ghost btn-xs text-current hover:bg-current/20"
					>
						<X className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
