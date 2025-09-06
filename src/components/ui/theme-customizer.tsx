"use client";

import { Brush, ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const SCALE_OPTIONS = [
	"blue",
	"slate",
	"gray",
	"mauve",
	"sage",
	"olive",
	"sand",
	"orange",
	"cyan",
	"green",
	"yellow",
	"red",
] as const;

type ScaleOption = (typeof SCALE_OPTIONS)[number];

function ColorChip({
	label,
	selected,
	onClick,
}: {
	label: string;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			className={`flex items-center gap-2 px-3 py-2 rounded-box border transition-colors text-xs ${
				selected
					? "border-base-content/40 ring-2 ring-base-content/20"
					: "border-base-300 hover:bg-base-200"
			}`}
			onClick={onClick}
			title={label}
		>
			<span
				className="size-4 rounded-full border border-base-300"
				style={{ backgroundColor: `var(--${label}-9)` }}
			/>
			<span className="capitalize">{label}</span>
		</button>
	);
}

export default function ThemeCustomizer() {
	const {
		colorPreferences,
		setColorPreferences,
		depthEnabled,
		setDepthEnabled,
	} = useTheme();
	const [isOpen, setIsOpen] = useState(false);

	const previewGradient = useMemo(() => {
		const p = colorPreferences;
		return `linear-gradient(90deg, var(--${p.primary}-9), var(--${p.secondary}-9), var(--${p.accent}-9), var(--${p.neutral}-9))`;
	}, [colorPreferences]);

	return (
		<div className="relative">
			<button
				className="btn btn-sm btn-ghost gap-2"
				onClick={() => setIsOpen((v) => !v)}
				title="Customize theme colors"
			>
				<Brush className="size-4" />
				<span className="hidden sm:inline">Theme</span>
				<span
					className="h-3 w-10 rounded-full border border-base-300"
					style={{ background: previewGradient }}
				/>
				<ChevronDown className="size-3" />
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>

					{/* Dropdown */}
					<div className="absolute right-0 top-full mt-2 w-96 max-h-[28rem] overflow-y-auto bg-base-100 border border-base-300 rounded-box shadow-lg z-50">
						<div className="p-4 space-y-5">
							<h3 className="text-sm font-semibold text-base-content/80">
								Customize Theme
							</h3>

							<section>
								<div className="form-control">
									<label className="label cursor-pointer justify-start gap-3">
										<input
											type="checkbox"
											className="toggle toggle-sm"
											checked={depthEnabled}
											onChange={(e) => setDepthEnabled(e.target.checked)}
										/>
										<span className="label-text text-sm">Enable depth</span>
									</label>
								</div>
							</section>

							<section>
								<h4 className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
									Base Neutral (UI Background)
								</h4>
								<div className="grid grid-cols-3 gap-2">
									{["gray", "slate", "mauve", "sage", "olive", "sand"].map(
										(s) => (
											<ColorChip
												key={`base-${s}`}
												label={s}
												selected={(colorPreferences as any).baseNeutral === s}
												onClick={() =>
													setColorPreferences({ baseNeutral: s } as any)
												}
											/>
										)
									)}
								</div>
							</section>

							<section>
								<h4 className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
									Primary
								</h4>
								<div className="grid grid-cols-3 gap-2">
									{SCALE_OPTIONS.map((s) => (
										<ColorChip
											key={`primary-${s}`}
											label={s}
											selected={colorPreferences.primary === s}
											onClick={() => setColorPreferences({ primary: s })}
										/>
									))}
								</div>
							</section>

							<section>
								<h4 className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
									Secondary
								</h4>
								<div className="grid grid-cols-3 gap-2">
									{SCALE_OPTIONS.map((s) => (
										<ColorChip
											key={`secondary-${s}`}
											label={s}
											selected={colorPreferences.secondary === s}
											onClick={() => setColorPreferences({ secondary: s })}
										/>
									))}
								</div>
							</section>

							<section>
								<h4 className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
									Accent
								</h4>
								<div className="grid grid-cols-3 gap-2">
									{SCALE_OPTIONS.map((s) => (
										<ColorChip
											key={`accent-${s}`}
											label={s}
											selected={colorPreferences.accent === s}
											onClick={() => setColorPreferences({ accent: s })}
										/>
									))}
								</div>
							</section>

							<section>
								<h4 className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
									Neutral
								</h4>
								<div className="grid grid-cols-3 gap-2">
									{SCALE_OPTIONS.map((s) => (
										<ColorChip
											key={`neutral-${s}`}
											label={s}
											selected={colorPreferences.neutral === s}
											onClick={() => setColorPreferences({ neutral: s })}
										/>
									))}
								</div>
							</section>

							<div className="flex justify-end pt-1">
								<button className="btn btn-sm" onClick={() => setIsOpen(false)}>
									Close
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
