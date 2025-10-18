"use client";

import { useEffect } from "react";
import { useSession } from "../../hooks/useSession";
import { useUnsavedChanges } from "../../contexts/UnsavedChangesContext";

export default function ReloadGuard() {
	const { isActive, isPaused, hasPendingSave } = useSession();
	const { isDirty } = useUnsavedChanges();

	useEffect(() => {
		const shouldGuard = isActive || isPaused || hasPendingSave || isDirty;
		if (!shouldGuard) return;

		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};

		const onKeyDown = (e: KeyboardEvent) => {
			const isReloadCombo =
				(e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r";
			const isF5 = e.key === "F5";
			if (isReloadCombo || isF5) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		window.addEventListener("beforeunload", onBeforeUnload);
		window.addEventListener("keydown", onKeyDown, { capture: true });

		return () => {
			window.removeEventListener("beforeunload", onBeforeUnload);
			window.removeEventListener(
				"keydown",
				onKeyDown as any,
				{ capture: true } as any
			);
		};
	}, [isActive, isPaused, hasPendingSave, isDirty]);

	return null;
}
