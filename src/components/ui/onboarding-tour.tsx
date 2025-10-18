"use client";

import React from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { useOnboarding } from "@/src/contexts/OnboardingContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
	CustomPopover,
	CustomCloseButton,
	CustomSkipButton,
} from "./onboarding-tour-components";

const tourSteps = [
	{
		selector: "body",
		content: (
			<div className="space-y-3">
				<div>
					<h3 className="card-title text-base-content">Welcome to DeepFlow</h3>
				</div>
				<p className="text-sm text-base-content/80">
					Focus hits different when it feels effortless. Let's get you set up
					with the basics.
				</p>
			</div>
		),
		position: "center" as const,
	},
	{
		selector: "[data-tour='timer-widget']",
		content: (
			<div className="space-y-3">
				<div>
					<h3 className="card-title text-base-content">Your Focus Engine</h3>
				</div>
				<p className="text-sm text-base-content/80">
					This is where the magic happens. Choose your flow style:
				</p>
				<div>
					<ul className="list-disc list-inside text-xs text-base-content/70 space-y-1">
						<li>
							<strong>Time-boxed:</strong> Set a specific duration
						</li>
						<li>
							<strong>Open:</strong> Run without time limits
						</li>
					</ul>
				</div>
			</div>
		),
		position: "top" as const,
	},
	{
		selector: "[data-tour='timer-start']",
		content: (
			<div className="space-y-3">
				<div>
					<h3 className="card-title text-base-content">Start Your Flow</h3>
				</div>
				<p className="text-sm text-base-content/80">
					Hit start and watch your focus build. Set a goal, pick your style,
					then go deep.
				</p>
			</div>
		),
		position: "top" as const,
	},
	{
		selector: "[data-tour='widget-dock']",
		content: (
			<div className="space-y-3">
				<div>
					<h3 className="card-title text-base-content">Your Workspace</h3>
				</div>
				<p className="text-sm text-base-content/80">
					Toggle widgets on and off to match your rhythm. Clean workspace, clear
					mind.
				</p>
			</div>
		),
		position: "top" as const,
	},
	{
		selector: "[data-tour='settings-button']",
		content: (
			<div className="space-y-3">
				<div>
					<h3 className="card-title text-base-content">Make It Yours</h3>
				</div>
				<p className="text-sm text-base-content/80">
					Fine-tune your setup. Colors, widgets, preferences — whatever helps
					you stay in flow.
				</p>
			</div>
		),
		position: "left" as const,
	},
	{
		selector: "body",
		content: (
			<div className="space-y-3">
				<div>
					<h3 className="card-title text-base-content">You're Ready</h3>
				</div>
				<p className="text-sm text-base-content/80">
					That's it. No tricks, no complexity. Just focus, when you need it. Hit
					the "?" anytime to replay this tour.
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

	// Handle tour close event
	React.useEffect(() => {
		const handleTourClose = () => {
			stopTour();
		};

		window.addEventListener("tour:close", handleTourClose);
		return () => window.removeEventListener("tour:close", handleTourClose);
	}, [stopTour]);

	return null;
}

export default function OnboardingTour() {
	const { theme, colorPreferences } = useTheme();
	const { stopTour, completeOnboarding } = useOnboarding();

	return (
		<TourProvider
			steps={tourSteps}
			styles={
				{
					// Main popup container - using theme CSS variables
					popover: (base: any) => ({
						...base,
						backgroundColor: `var(--color-base-200)`,
						color: `var(--color-base-content)`,
						borderRadius: "var(--radius-box)",
						padding: "20px",
						fontSize: "14px",
						maxWidth: "420px",
						minWidth: "320px",
						boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--color-border)`,
						border: `1px solid var(--color-border)`,
					}),
					// Background overlay
					mask: (base: any) => ({
						...base,
						color:
							theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)",
					}),
					// Highlight area (the cutout) - using primary color from theme
					maskArea: (base: any) => ({
						...base,
						borderRadius: "12px",
						boxShadow: `0 0 0 4px var(--color-primary), 0 0 0 8px var(--color-primary)`,
					}),
					// Step indicator badge - hidden
					badge: (base: any) => ({
						...base,
						display: "none",
					}),
					// Controls container
					controls: (base: any) => ({
						...base,
						marginTop: "20px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: "12px",
					}),
					// Close button - using neutral colors
					close: (base: any) => ({
						...base,
						color: `var(--color-neutral)`,
						fontSize: "16px",
						padding: "4px",
						borderRadius: "var(--radius-field)",
						transition: "all 0.2s ease",
						"&:hover": {
							backgroundColor: `var(--color-base-200)`,
						},
					}),
					// Previous button - using neutral colors
					prevButton: (base: any) => ({
						...base,
						color: `var(--color-neutral)`,
						backgroundColor: "transparent",
						border: `1px solid var(--color-border)`,
						borderRadius: "var(--radius-field)",
						padding: "8px 16px",
						fontSize: "14px",
						fontWeight: "500",
						transition: "all 0.2s ease",
						"&:hover": {
							backgroundColor: `var(--color-base-200)`,
							borderColor: `var(--color-base-300)`,
						},
					}),
					// Next button - using primary colors
					nextButton: (base: any) => ({
						...base,
						backgroundColor: `var(--color-primary)`,
						color: `var(--color-primary-content)`,
						borderRadius: "var(--radius-field)",
						padding: "8px 20px",
						fontSize: "14px",
						fontWeight: "600",
						border: "none",
						transition: "all 0.2s ease",
						"&:hover": {
							backgroundColor: `var(--color-primary-focus)`,
							transform: "translateY(-1px)",
							boxShadow: `0 10px 25px -5px var(--color-primary)`,
						},
					}),
					// Skip button - using neutral colors
					skipButton: (base: any) => ({
						...base,
						color: `var(--color-neutral)`,
						fontSize: "14px",
						fontWeight: "500",
						textDecoration: "underline",
						transition: "all 0.2s ease",
						"&:hover": {
							color: `var(--color-base-content)`,
						},
					}),
					// Progress bar - using base colors
					progress: (base: any) => ({
						...base,
						backgroundColor: `var(--color-base-200)`,
						height: "4px",
						borderRadius: "2px",
						overflow: "hidden",
					}),
					// Progress fill - using primary color
					progressFill: (base: any) => ({
						...base,
						backgroundColor: `var(--color-primary)`,
						height: "100%",
						transition: "width 0.3s ease",
					}),
				} as any
			}
			// Spacing and positioning
			padding={10}
			// Custom class for additional styling
			className="onboarding-tour"
			// Custom components (optional)
			components={
				{
					Popover: CustomPopover,
					Close: CustomCloseButton,
					Skip: CustomSkipButton,
				} as any
			}
		>
			<TourContent />
		</TourProvider>
	);
}
