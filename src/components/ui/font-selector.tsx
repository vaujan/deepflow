"use client";

import { ChevronDown, Type } from "lucide-react";
import React, { useState } from "react";
import { useFont, FontOption } from "../../contexts/FontContext";

export default function FontSelector() {
	const { selectedFont, setSelectedFont, fontOptions, fontCategories } =
		useFont();
	const [isOpen, setIsOpen] = useState(false);

	const handleFontSelect = (font: FontOption) => {
		setSelectedFont(font);
		setIsOpen(false);
	};

	const groupedFonts = fontCategories.reduce((acc, category) => {
		acc[category] = fontOptions.filter((font) => font.category === category);
		return acc;
	}, {} as Record<string, FontOption[]>);

	return (
		<div className="relative">
			<button
				className="btn btn-sm btn-ghost gap-2"
				onClick={() => setIsOpen(!isOpen)}
				title="Select font"
			>
				<Type className="size-4" />
				<span className="hidden sm:inline">{selectedFont.name}</span>
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
					<div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-base-100 border border-base-300 rounded-box shadow-lg z-50">
						<div className="p-4">
							<h3 className="text-sm font-semibold text-base-content/80 mb-3">
								Choose Font
							</h3>

							{Object.entries(groupedFonts).map(([category, fonts]) => (
								<div key={category} className="mb-4 last:mb-0">
									<h4 className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
										{category}
									</h4>
									<div className="space-y-1">
										{fonts.map((font) => (
											<button
												key={font.id}
												className={`w-full text-left p-3 rounded-box transition-colors ${
													selectedFont.id === font.id
														? "bg-primary text-primary-content"
														: "hover:bg-base-200"
												}`}
												onClick={() => handleFontSelect(font)}
												style={{
													fontFamily: font.googleFont
														? `"${font.googleFont}", ${font.fallback}`
														: font.fallback,
												}}
											>
												<div className="flex justify-between items-start">
													<div>
														<div className="font-medium text-sm">
															{font.name}
														</div>
														<div
															className={`text-xs mt-1 ${
																selectedFont.id === font.id
																	? "text-primary-content/80"
																	: "text-base-content/60"
															}`}
														>
															{font.description}
														</div>
													</div>
													{selectedFont.id === font.id && (
														<div className="text-primary-content text-xs">
															✓
														</div>
													)}
												</div>
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
