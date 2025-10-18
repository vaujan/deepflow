"use client";

import React from "react";

type UnsavedChangesContextValue = {
	isDirty: boolean;
	setDirty: (id: string, dirty: boolean) => void;
};

const UnsavedChangesContext =
	React.createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const dirtyIdsRef = React.useRef<Set<string>>(new Set());
	const [, forceRender] = React.useState(0);

	const setDirty = React.useCallback((id: string, dirty: boolean) => {
		if (!id) return;
		const set = dirtyIdsRef.current;
		const had = set.has(id);
		if (dirty && !had) {
			set.add(id);
			forceRender((v) => v + 1);
		} else if (!dirty && had) {
			set.delete(id);
			forceRender((v) => v + 1);
		}
	}, []);

	const value = React.useMemo<UnsavedChangesContextValue>(() => {
		return {
			isDirty: dirtyIdsRef.current.size > 0,
			setDirty,
		};
	}, [setDirty]);

	return (
		<UnsavedChangesContext.Provider value={value}>
			{children}
		</UnsavedChangesContext.Provider>
	);
}

export function useUnsavedChanges() {
	const ctx = React.useContext(UnsavedChangesContext);
	if (!ctx) {
		throw new Error(
			"useUnsavedChanges must be used within an UnsavedChangesProvider"
		);
	}
	return ctx;
}
