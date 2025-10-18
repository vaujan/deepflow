"use client";

import React from "react";
import {
	ArrowRight,
	ArrowLeft,
	X,
	SkipForward,
	CheckCircle,
} from "lucide-react";

// Custom Controls Component
export function CustomControls({
	currentStep,
	stepsLength,
	setIsOpen,
	setCurrentStep,
	...props
}: any) {
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === stepsLength - 1;

	return (
		<div {...props} className="flex items-center justify-between w-full gap-3">
			{/* Previous Button */}
			<button
				onClick={() => setCurrentStep(currentStep - 1)}
				disabled={isFirstStep}
				className={`btn btn-ghost btn-sm ${isFirstStep ? "btn-disabled" : ""}`}
			>
				<ArrowLeft className="w-4 h-4" />
				Previous
			</button>

			{/* Progress Indicator */}
			<div className="flex items-center gap-2">
				{Array.from({ length: stepsLength }, (_, i) => (
					<div
						key={i}
						className={`w-2 h-2 rounded-full transition-all ${
							i === currentStep
								? "bg-primary scale-125"
								: i < currentStep
								? "bg-primary/60"
								: "bg-base-300"
						}`}
					/>
				))}
			</div>

			{/* Next/Skip Button */}
			<button
				onClick={() => {
					if (isLastStep) {
						setIsOpen(false);
					} else {
						setCurrentStep(currentStep + 1);
					}
				}}
				className="btn btn-primary btn-sm"
			>
				{isLastStep ? "Finish" : "Next"}
				{isLastStep ? (
					<CheckCircle className="w-4 h-4" />
				) : (
					<ArrowRight className="w-4 h-4" />
				)}
			</button>
		</div>
	);
}

// Custom Popover Component
export function CustomPopover({ children, ...props }: any) {
	return (
		<div
			{...props}
			className="card bg-base-100 shadow-xl border border-base-300 max-w-md"
		>
			<div className="card-body p-6">{children}</div>
		</div>
	);
}

// Custom Close Button
export function CustomCloseButton({ onClick, ...props }: any) {
	return (
		<button
			{...props}
			onClick={(e) => {
				onClick?.(e);
				// Trigger the tour close event
				const event = new CustomEvent("tour:close");
				window.dispatchEvent(event);
			}}
			className="btn btn-ghost btn-sm btn-circle absolute top-4 right-4"
			aria-label="Close tour"
		>
			<X className="w-5 h-5" />
		</button>
	);
}

// Custom Skip Button
export function CustomSkipButton({ onClick, ...props }: any) {
	return (
		<button
			{...props}
			onClick={onClick}
			className="btn btn-ghost btn-sm text-neutral-content hover:text-base-content"
		>
			<SkipForward className="w-4 h-4" />
			Skip Tour
		</button>
	);
}
