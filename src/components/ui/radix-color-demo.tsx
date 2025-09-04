"use client";

import React from "react";
import {
	radixColorScales,
	getRadixColor,
	getRadixColorAlpha,
} from "../../utils/radixColorMapping";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Radix Color Integration Demo Component
 *
 * This component demonstrates the hybrid approach of using Radix Color
 * with DaisyUI components, showing both semantic tokens and direct
 * Radix Color scale usage.
 */
export default function RadixColorDemo() {
	const { theme } = useTheme();

	// Sample color scales to showcase
	const colorScales = [
		{
			name: "Blue",
			scale: radixColorScales.blue,
			category: "primary" as const,
		},
		{
			name: "Slate",
			scale: radixColorScales.slate,
			category: "secondary" as const,
		},
		{
			name: "Orange",
			scale: radixColorScales.orange,
			category: "accent" as const,
		},
		{
			name: "Green",
			scale: radixColorScales.green,
			category: "status" as const,
		},
		{ name: "Red", scale: radixColorScales.red, category: "status" as const },
	];

	return (
		<div className="p-6 space-y-8">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-base-content mb-2">
					Radix Color Integration Demo
				</h1>
				<p className="text-base-content/70">
					Hybrid approach: Radix Color scales + DaisyUI semantic tokens
				</p>
				<div className="badge badge-primary mt-2">Current Theme: {theme}</div>
			</div>

			{/* DaisyUI Components with Radix Colors */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-base-content">
					DaisyUI Components with Radix Colors
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{/* Buttons */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title text-base-content">Buttons</h3>
							<div className="space-y-2">
								<button className="btn btn-primary w-full">
									Primary Button
								</button>
								<button className="btn btn-secondary w-full">
									Secondary Button
								</button>
								<button className="btn btn-accent w-full">Accent Button</button>
								<button className="btn btn-neutral w-full">
									Neutral Button
								</button>
							</div>
						</div>
					</div>

					{/* Status Indicators */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title text-base-content">Status Colors</h3>
							<div className="space-y-2">
								<div className="alert alert-info">
									<span>Info message</span>
								</div>
								<div className="alert alert-success">
									<span>Success message</span>
								</div>
								<div className="alert alert-warning">
									<span>Warning message</span>
								</div>
								<div className="alert alert-error">
									<span>Error message</span>
								</div>
							</div>
						</div>
					</div>

					{/* Form Elements */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title text-base-content">Form Elements</h3>
							<div className="space-y-3">
								<input
									type="text"
									placeholder="Input field"
									className="input input-bordered w-full"
								/>
								<select className="select select-bordered w-full">
									<option>Select option</option>
								</select>
								<textarea
									className="textarea textarea-bordered w-full"
									placeholder="Textarea"
								></textarea>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Direct Radix Color Scale Usage */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-base-content">
					Direct Radix Color Scale Usage
				</h2>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{colorScales.map(({ name, scale, category }) => (
						<div key={name} className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<h3 className="card-title text-base-content">{name} Scale</h3>
								<div className="space-y-2">
									{/* Color scale visualization */}
									<div className="grid grid-cols-12 gap-1">
										{Object.entries(scale).map(([key, value]) => (
											<div
												key={key}
												className="h-8 rounded flex items-center justify-center text-xs font-mono"
												style={{
													backgroundColor: value,
													color:
														parseInt(key.replace(/\D/g, "")) > 6
															? "#ffffff"
															: "#000000",
												}}
												title={`${key}: ${value}`}
											>
												{key.replace(/\D/g, "")}
											</div>
										))}
									</div>

									{/* Semantic usage examples */}
									<div className="mt-4 space-y-2">
										<div
											className="p-2 rounded text-sm"
											style={{
												backgroundColor: getRadixColor(
													category,
													"primary",
													theme
												),
												color: getRadixColor(
													category,
													"primary-content",
													theme
												),
											}}
										>
											Primary: {getRadixColor(category, "primary", theme)}
										</div>
										<div
											className="p-2 rounded text-sm"
											style={{
												backgroundColor: getRadixColorAlpha(
													category,
													"primary",
													theme,
													0.2
												),
												color: getRadixColor(category, "primary", theme),
											}}
										>
											Primary with 20% alpha
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Alpha Variants Demo */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-base-content">
					Alpha Variants & Transparency
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[0.1, 0.3, 0.5, 0.7, 0.9].map((alpha) => (
						<div key={alpha} className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<h3 className="card-title text-base-content">
									Alpha: {Math.round(alpha * 100)}%
								</h3>
								<div
									className="p-4 rounded-lg"
									style={{
										backgroundColor: getRadixColorAlpha(
											"primary",
											"primary",
											theme,
											alpha
										),
										color: theme === "dark" ? "#ffffff" : "#000000",
									}}
								>
									<p className="text-sm">
										This demonstrates how Radix Color alpha variants work with
										different transparency levels.
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Migration Benefits */}
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-base-content mb-4">
						Migration Benefits
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<h3 className="font-semibold text-base-content">
								✅ Accessibility
							</h3>
							<p className="text-sm text-base-content/70">
								WCAG contrast ratios built-in, ensuring readable text
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-base-content">
								✅ Consistency
							</h3>
							<p className="text-sm text-base-content/70">
								12-step scales provide granular color control
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-base-content">
								✅ Alpha Support
							</h3>
							<p className="text-sm text-base-content/70">
								Built-in transparency variants for overlays
							</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-base-content">
								✅ Theme Switching
							</h3>
							<p className="text-sm text-base-content/70">
								Seamless light/dark mode transitions
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
