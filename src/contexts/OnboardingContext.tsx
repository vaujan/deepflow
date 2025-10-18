"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import OnboardingTour from "../components/ui/onboarding-tour";

interface OnboardingContextType {
	hasCompletedOnboarding: boolean;
	isTourRunning: boolean;
	startTour: () => void;
	stopTour: () => void;
	resetOnboarding: () => void;
	completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
	undefined
);

export function OnboardingProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(
		() => {
			if (typeof window !== "undefined") {
				const saved = localStorage.getItem("hasCompletedOnboarding");
				return saved === "true";
			}
			return false;
		}
	);

	const [isTourRunning, setIsTourRunning] = useState<boolean>(false);

	const startTour = () => {
		setIsTourRunning(true);
	};

	const stopTour = () => {
		setIsTourRunning(false);
	};

	const resetOnboarding = () => {
		setHasCompletedOnboarding(false);
		if (typeof window !== "undefined") {
			localStorage.removeItem("hasCompletedOnboarding");
		}
	};

	const completeOnboarding = () => {
		setHasCompletedOnboarding(true);
		setIsTourRunning(false);
		if (typeof window !== "undefined") {
			localStorage.setItem("hasCompletedOnboarding", "true");
		}
	};

	// Sync with localStorage changes from other tabs/windows
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "hasCompletedOnboarding") {
				setHasCompletedOnboarding(e.newValue === "true");
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<OnboardingContext.Provider
			value={{
				hasCompletedOnboarding,
				isTourRunning,
				startTour,
				stopTour,
				resetOnboarding,
				completeOnboarding,
			}}
		>
			{children}
			<OnboardingTour />
		</OnboardingContext.Provider>
	);
}

export function useOnboarding(): OnboardingContextType {
	const context = useContext(OnboardingContext);
	if (context === undefined) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
}
