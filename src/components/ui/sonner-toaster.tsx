"use client";

import React from "react";
import { Toaster } from "sonner";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Sonner Toaster that adapts to the app theme (DaisyUI/Radix vars).
 * Ensures dark mode compliance by switching class names based on ThemeContext.
 */
export function SonnerToaster() {
	const { theme } = useTheme();

	// Base class names: let Sonner inherit our CSS variables and theme tokens
	const baseClassName = "[--sonner-z-index:60] font-sans";

	// Map toast styling to DaisyUI tokens via className overrides
	const classNames = {
		toast:
			"border border-base-300 shadow-lg rounded-box bg-base-200 text-base-content",
		title: "text-sm font-medium text-base-content",
		description: "text-xs text-base-content/70",
		actionButton: "btn btn-xs btn-neutral",
		cancelButton: "btn btn-xs btn-ghost",
		closeButton: "btn btn-xs btn-ghost",
		success: "bg-base-200 text-base-content border-base-300",
		info: "bg-base-200 text-base-content border-base-300",
		warning: "bg-base-200 text-base-content border-base-300",
		error: "bg-base-200 text-base-content border-base-300",
	} as const;

	return (
		<Toaster
			// Explicitly sync Sonner theme
			theme={theme === "dark" ? "dark" : "light"}
			richColors
			position="bottom-right"
			expand={false}
			closeButton={false}
			className={`${baseClassName}`}
			toastOptions={{ classNames }}
		/>
	);
}

export default SonnerToaster;
