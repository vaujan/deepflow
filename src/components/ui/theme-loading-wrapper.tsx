"use client";

import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useState } from "react";

interface ThemeLoadingWrapperProps {
	children: React.ReactNode;
}

export function ThemeLoadingWrapper({ children }: ThemeLoadingWrapperProps) {
	const { isThemeLoaded } = useTheme();
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		if (isThemeLoaded) {
			// Add a small delay to ensure smooth transition
			const timer = setTimeout(() => {
				setShowContent(true);
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [isThemeLoaded]);

	// Show loading state while theme is being applied
	if (!showContent) {
		return (
			<div className="min-h-screen bg-base-100 flex items-center justify-center">
				<div className="loading loading-spinner loading-lg text-primary"></div>
			</div>
		);
	}

	return <>{children}</>;
}

