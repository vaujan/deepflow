"use client";

import React from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { useOnboarding } from "@/src/contexts/OnboardingContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
	CustomBadge,
	CustomControls,
	CustomPopover,
	CustomCloseButton,
	CustomSkipButton,
} from "./onboarding-tour-components";

const tourSteps = [
	{
		selector: "body",
		content: (
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-12">
					Welcome to DeepFlow!
				</h3>
				<p className="text-sm text-gray-11">
					DeepFlow helps you maintain focus and track your productive work.
					Let's take a quick tour to get you started.
				</p>
			</div>
		),
		position: "center" as const,
	},
	{
		selector: "[data-tour='timer-widget']",
		content: (
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-12">Timer Widget</h3>
				<p className="text-sm text-gray-11">
					This is your main focus tool. You can run different types of sessions:
				</p>
				<ul className="text-xs text-gray-10 space-y-1 ml-4">
					<li>
						• <strong>Time-boxed:</strong> Set a specific duration
					</li>
					<li>
						• <strong>Open:</strong> Run without time limits
					</li>
					<li>
						• <strong>Pomodoro:</strong> 25-minute focused work sessions
					</li>
				</ul>
			</div>
		),
		position: "top" as const,
	},
	{
		selector: "[data-tour='timer-start']",
		content: (
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-12">
					Start Your First Session
				</h3>
				<p className="text-sm text-gray-11">
					Click the start button to begin a focus session. You can set a goal
					and choose your session type.
				</p>
			</div>
		),
		position: "top" as const,
	},
	{
		selector: "[data-tour='widget-dock']",
		content: (
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-12">Widget Controls</h3>
				<p className="text-sm text-gray-11">
					Use these buttons to show or hide widgets. You can customize your
					workspace by toggling visibility without losing your data.
				</p>
			</div>
		),
		position: "top" as const,
	},
	{
		selector: "[data-tour='settings-button']",
		content: (
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-12">
					Settings & Customization
				</h3>
				<p className="text-sm text-gray-11">
					Click here to enable or disable widgets, manage your preferences, and
					customize your DeepFlow experience.
				</p>
			</div>
		),
		position: "left" as const,
	},
	{
		selector: "body",
		content: (
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-12">You're All Set!</h3>
				<p className="text-sm text-gray-11">
					You now know the basics of DeepFlow. Start a focus session and begin
					your productive journey. You can always replay this tour by clicking
					the "?" help icon in the header.
				</p>
			</div>
		),
		position: "center" as const,
	},
];

function TourContent() {
	const { isTourRunning, stopTour, completeOnboarding } = useOnboarding();
	const { setIsOpen, setCurrentStep, currentStep } = useTour();

	React.useEffect(() => {
		if (isTourRunning) {
			setIsOpen(true);
			setCurrentStep(0);
		} else {
			setIsOpen(false);
		}
	}, [isTourRunning, setIsOpen, setCurrentStep]);

	// Handle completion when reaching the last step
	React.useEffect(() => {
		if (currentStep === tourSteps.length - 1) {
			// Small delay to let user see the completion message
			const timer = setTimeout(() => {
				completeOnboarding();
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [currentStep, completeOnboarding]);

	return null;
}

export default function OnboardingTour() {
	const { theme } = useTheme();
	const { stopTour, completeOnboarding } = useOnboarding();

	return (
		<TourProvider
			steps={tourSteps}
			styles={{
				// Main popup container
				popover: (base) => ({
					...base,
					backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
					color: theme === "dark" ? "#f8fafc" : "#0f172a",
					borderRadius: "12px",
					padding: "20px",
					fontSize: "14px",
					maxWidth: "420px",
					minWidth: "320px",
					boxShadow:
						theme === "dark"
							? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
							: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)",
					border:
						theme === "dark"
							? "1px solid rgba(255, 255, 255, 0.1)"
							: "1px solid rgba(0, 0, 0, 0.1)",
				}),
				// Background overlay
				mask: (base) => ({
					...base,
					color: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)",
				}),
				// Highlight area (the cutout) - correct property name
				maskArea: (base) => ({
					...base,
					borderRadius: "12px",
					boxShadow:
						theme === "dark"
							? "0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 8px rgba(59, 130, 246, 0.1)"
							: "0 0 0 4px rgba(37, 99, 235, 0.3), 0 0 0 8px rgba(37, 99, 235, 0.1)",
				}),
				// Step indicator badge
				badge: (base) => ({
					...base,
					backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
					color: "white",
					fontSize: "12px",
					fontWeight: "600",
					padding: "4px 8px",
					borderRadius: "12px",
				}),
				// Controls container
				controls: (base) => ({
					...base,
					marginTop: "20px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: "12px",
				}),
				// Close button
				close: (base) => ({
					...base,
					color: theme === "dark" ? "#94a3b8" : "#64748b",
					fontSize: "16px",
					padding: "4px",
					borderRadius: "4px",
					transition: "all 0.2s ease",
					"&:hover": {
						backgroundColor:
							theme === "dark"
								? "rgba(255, 255, 255, 0.1)"
								: "rgba(0, 0, 0, 0.1)",
					},
				}),
				// Previous button
				prevButton: (base) => ({
					...base,
					color: theme === "dark" ? "#94a3b8" : "#64748b",
					backgroundColor: "transparent",
					border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
					borderRadius: "8px",
					padding: "8px 16px",
					fontSize: "14px",
					fontWeight: "500",
					transition: "all 0.2s ease",
					"&:hover": {
						backgroundColor:
							theme === "dark"
								? "rgba(255, 255, 255, 0.1)"
								: "rgba(0, 0, 0, 0.05)",
						borderColor: theme === "dark" ? "#4b5563" : "#9ca3af",
					},
				}),
				// Next button
				nextButton: (base) => ({
					...base,
					backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
					color: "white",
					borderRadius: "8px",
					padding: "8px 20px",
					fontSize: "14px",
					fontWeight: "600",
					border: "none",
					transition: "all 0.2s ease",
					"&:hover": {
						backgroundColor: theme === "dark" ? "#2563eb" : "#1d4ed8",
						transform: "translateY(-1px)",
						boxShadow:
							theme === "dark"
								? "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
								: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
					},
				}),
				// Skip button
				skipButton: (base) => ({
					...base,
					color: theme === "dark" ? "#94a3b8" : "#64748b",
					fontSize: "14px",
					fontWeight: "500",
					textDecoration: "underline",
					transition: "all 0.2s ease",
					"&:hover": {
						color: theme === "dark" ? "#cbd5e1" : "#374151",
					},
				}),
				// Progress bar
				progress: (base) => ({
					...base,
					backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb",
					height: "4px",
					borderRadius: "2px",
					overflow: "hidden",
				}),
				// Progress fill
				progressFill: (base) => ({
					...base,
					backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
					height: "100%",
					transition: "width 0.3s ease",
				}),
			}}
			// Spacing and positioning
			padding={10}
			offset={10} // Distance from target element
			// Display options
			showProgress
			showSkipButton
			showCloseButton
			showPrevButton
			showNextButton
			// Interaction settings
			disableBodyScroll={false}
			disableInteraction={false}
			disableDotsNavigation
			disableKeyboardNavigation={false}
			disableFocusLock={false}
			disableScrollLock={false}
			// Animation and transitions
			transition="all 0.3s ease"
			animationDuration={300}
			// Custom class for additional styling
			className="onboarding-tour"
			// Custom components (optional)
			components={{
				Badge: CustomBadge,
				Controls: CustomControls,
				Popover: CustomPopover,
				Close: CustomCloseButton,
				Skip: CustomSkipButton,
			}}
			afterClose={() => {
				stopTour();
			}}
		>
			<TourContent />
		</TourProvider>
	);
}
