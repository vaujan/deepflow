"use client";

import React from "react";
import {
	CheckCircle,
	ArrowRight,
	ArrowLeft,
	X,
	SkipForward,
} from "lucide-react";

// Custom Badge Component
export function CustomBadge({ children, ...props }: any) {
	return (
		<div
			{...props}
			className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg"
		>
			<CheckCircle className="w-3 h-3" />
			{children}
		</div>
	);
}

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
				className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
					isFirstStep
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-gray-100 dark:hover:bg-gray-700"
				}`}
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
								? "bg-blue-500 scale-125"
								: i < currentStep
								? "bg-blue-300"
								: "bg-gray-300 dark:bg-gray-600"
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
				className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all"
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
			className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md"
		>
			{children}
		</div>
	);
}

// Custom Close Button
export function CustomCloseButton({ onClick, ...props }: any) {
	return (
		<button
			{...props}
			onClick={onClick}
			className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
			aria-label="Close tour"
		>
			<X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
		</button>
	);
}

// Custom Skip Button
export function CustomSkipButton({ onClick, ...props }: any) {
	return (
		<button
			{...props}
			onClick={onClick}
			className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
		>
			<SkipForward className="w-4 h-4" />
			Skip Tour
		</button>
	);
}
