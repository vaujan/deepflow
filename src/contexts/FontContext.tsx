"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Font categories and options
export interface FontOption {
	id: string;
	name: string;
	category: string;
	description: string;
	googleFont?: string;
	fallback: string;
}

export const FONT_OPTIONS: FontOption[] = [
	// Sans-serif fonts
	{
		id: "inter",
		name: "Inter",
		category: "Sans-serif",
		description: "Modern, clean, and highly readable",
		googleFont: "Inter",
		fallback:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
	},
	{
		id: "system",
		name: "System Default",
		category: "Sans-serif",
		description: "Your operating system's default font",
		fallback:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
	},
	{
		id: "roboto",
		name: "Roboto",
		category: "Sans-serif",
		description: "Google's signature font, friendly and approachable",
		googleFont: "Roboto",
		fallback: "Arial, sans-serif",
	},
	{
		id: "open-sans",
		name: "Open Sans",
		category: "Sans-serif",
		description: "Humanist sans-serif, excellent for body text",
		googleFont: "Open Sans",
		fallback: "Arial, sans-serif",
	},
	{
		id: "lato",
		name: "Lato",
		category: "Sans-serif",
		description: "Semi-rounded details, warm feeling",
		googleFont: "Lato",
		fallback: "Arial, sans-serif",
	},
	{
		id: "poppins",
		name: "Poppins",
		category: "Sans-serif",
		description: "Geometric sans-serif, modern and friendly",
		googleFont: "Poppins",
		fallback: "Arial, sans-serif",
	},
	{
		id: "nunito",
		name: "Nunito",
		category: "Sans-serif",
		description: "Rounded terminals, friendly and approachable",
		googleFont: "Nunito",
		fallback: "Arial, sans-serif",
	},
	{
		id: "source-sans",
		name: "Source Sans Pro",
		category: "Sans-serif",
		description: "Adobe's first open source font family",
		googleFont: "Source Sans Pro",
		fallback: "Arial, sans-serif",
	},

	// Serif fonts
	{
		id: "merriweather",
		name: "Merriweather",
		category: "Serif",
		description: "Designed for pleasant reading on screens",
		googleFont: "Merriweather",
		fallback: "Georgia, serif",
	},
	{
		id: "lora",
		name: "Lora",
		category: "Serif",
		description: "Well-balanced contemporary serif",
		googleFont: "Lora",
		fallback: "Georgia, serif",
	},
	{
		id: "playfair",
		name: "Playfair Display",
		category: "Serif",
		description: "Elegant high-contrast serif for headings",
		googleFont: "Playfair Display",
		fallback: "Georgia, serif",
	},
	{
		id: "crimson",
		name: "Crimson Text",
		category: "Serif",
		description: "Old-style serif, excellent for long-form reading",
		googleFont: "Crimson Text",
		fallback: "Georgia, serif",
	},
	{
		id: "libre-baskerville",
		name: "Libre Baskerville",
		category: "Serif",
		description: "Web font optimized for body text",
		googleFont: "Libre Baskerville",
		fallback: "Georgia, serif",
	},

	// Monospace fonts
	{
		id: "fira-code",
		name: "Fira Code",
		category: "Monospace",
		description: "Monospace font with programming ligatures",
		googleFont: "Fira Code",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},
	{
		id: "jetbrains-mono",
		name: "JetBrains Mono",
		category: "Monospace",
		description: "Designed for developers, with ligatures",
		googleFont: "JetBrains Mono",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},
	{
		id: "source-code-pro",
		name: "Source Code Pro",
		category: "Monospace",
		description: "Monospace font family for user interfaces",
		googleFont: "Source Code Pro",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},
	{
		id: "inconsolata",
		name: "Inconsolata",
		category: "Monospace",
		description: "Designed for code listings and technical documentation",
		googleFont: "Inconsolata",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},

	// Display fonts
	{
		id: "montserrat",
		name: "Montserrat",
		category: "Display",
		description: "Geometric sans-serif, inspired by urban typography",
		googleFont: "Montserrat",
		fallback: "Arial, sans-serif",
	},
	{
		id: "raleway",
		name: "Raleway",
		category: "Display",
		description: "Elegant sans-serif, great for headings",
		googleFont: "Raleway",
		fallback: "Arial, sans-serif",
	},
	{
		id: "oswald",
		name: "Oswald",
		category: "Display",
		description: "Reworking of classic styles, condensed width",
		googleFont: "Oswald",
		fallback: "Arial, sans-serif",
	},
	{
		id: "bebas-neue",
		name: "Bebas Neue",
		category: "Display",
		description: "Condensed display typeface, bold impact",
		googleFont: "Bebas Neue",
		fallback: "Arial, sans-serif",
	},

	// Additional Sans-serif fonts
	{
		id: "work-sans",
		name: "Work Sans",
		category: "Sans-serif",
		description: "Designed for screen reading, clean and modern",
		googleFont: "Work Sans",
		fallback: "Arial, sans-serif",
	},
	{
		id: "dm-sans",
		name: "DM Sans",
		category: "Sans-serif",
		description: "Low-contrast sans-serif, excellent for UI",
		googleFont: "DM Sans",
		fallback: "Arial, sans-serif",
	},
	{
		id: "manrope",
		name: "Manrope",
		category: "Sans-serif",
		description: "Open-source font, geometric and friendly",
		googleFont: "Manrope",
		fallback: "Arial, sans-serif",
	},
	{
		id: "rubik",
		name: "Rubik",
		category: "Sans-serif",
		description: "Rounded corners, playful and approachable",
		googleFont: "Rubik",
		fallback: "Arial, sans-serif",
	},
	{
		id: "quicksand",
		name: "Quicksand",
		category: "Sans-serif",
		description: "Display sans-serif with rounded terminals",
		googleFont: "Quicksand",
		fallback: "Arial, sans-serif",
	},
	{
		id: "ubuntu",
		name: "Ubuntu",
		category: "Sans-serif",
		description: "Humanist sans-serif, friendly and professional",
		googleFont: "Ubuntu",
		fallback: "Arial, sans-serif",
	},
	{
		id: "noto-sans",
		name: "Noto Sans",
		category: "Sans-serif",
		description: "Google's font for all languages, highly readable",
		googleFont: "Noto Sans",
		fallback: "Arial, sans-serif",
	},
	{
		id: "source-sans-3",
		name: "Source Sans 3",
		category: "Sans-serif",
		description: "Updated version of Source Sans Pro",
		googleFont: "Source Sans 3",
		fallback: "Arial, sans-serif",
	},

	// Additional Serif fonts
	{
		id: "crimson-pro",
		name: "Crimson Pro",
		category: "Serif",
		description: "Variable font version of Crimson Text",
		googleFont: "Crimson Pro",
		fallback: "Georgia, serif",
	},
	{
		id: "libre-caslon",
		name: "Libre Caslon Text",
		category: "Serif",
		description: "Classic serif with modern touches",
		googleFont: "Libre Caslon Text",
		fallback: "Georgia, serif",
	},
	{
		id: "spectral",
		name: "Spectral",
		category: "Serif",
		description: "Designed for both print and digital reading",
		googleFont: "Spectral",
		fallback: "Georgia, serif",
	},
	{
		id: "vollkorn",
		name: "Vollkorn",
		category: "Serif",
		description: "High-quality serif for body text",
		googleFont: "Vollkorn",
		fallback: "Georgia, serif",
	},
	{
		id: "pt-serif",
		name: "PT Serif",
		category: "Serif",
		description: "Universal serif font family",
		googleFont: "PT Serif",
		fallback: "Georgia, serif",
	},

	// Additional Monospace fonts
	{
		id: "ibm-plex-mono",
		name: "IBM Plex Mono",
		category: "Monospace",
		description: "Corporate monospace, designed by IBM",
		googleFont: "IBM Plex Mono",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},
	{
		id: "space-mono",
		name: "Space Mono",
		category: "Monospace",
		description: "Original monospace font for Google Fonts",
		googleFont: "Space Mono",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},
	{
		id: "roboto-mono",
		name: "Roboto Mono",
		category: "Monospace",
		description: "Monospace companion to Roboto",
		googleFont: "Roboto Mono",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},
	{
		id: "overpass-mono",
		name: "Overpass Mono",
		category: "Monospace",
		description: "Open source monospace, inspired by Highway Gothic",
		googleFont: "Overpass Mono",
		fallback:
			"ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
	},

	// Additional Display fonts
	{
		id: "anton",
		name: "Anton",
		category: "Display",
		description: "Condensed sans-serif, strong and impactful",
		googleFont: "Anton",
		fallback: "Arial, sans-serif",
	},
	{
		id: "barlow",
		name: "Barlow",
		category: "Display",
		description: "Low-contrast sans-serif, excellent for headlines",
		googleFont: "Barlow",
		fallback: "Arial, sans-serif",
	},
	{
		id: "comfortaa",
		name: "Comfortaa",
		category: "Display",
		description: "Rounded geometric sans-serif, friendly",
		googleFont: "Comfortaa",
		fallback: "Arial, sans-serif",
	},
	{
		id: "exo-2",
		name: "Exo 2",
		category: "Display",
		description: "Geometric sans-serif, futuristic feel",
		googleFont: "Exo 2",
		fallback: "Arial, sans-serif",
	},
	{
		id: "orbitron",
		name: "Orbitron",
		category: "Display",
		description: "Futuristic display font, geometric and bold",
		googleFont: "Orbitron",
		fallback: "Arial, sans-serif",
	},
	{
		id: "rajdhani",
		name: "Rajdhani",
		category: "Display",
		description: "Devanagari and Latin, modern and clean",
		googleFont: "Rajdhani",
		fallback: "Arial, sans-serif",
	},
	{
		id: "righteous",
		name: "Righteous",
		category: "Display",
		description: "Display sans-serif, bold and rounded",
		googleFont: "Righteous",
		fallback: "Arial, sans-serif",
	},
	{
		id: "teko",
		name: "Teko",
		category: "Display",
		description: "Condensed sans-serif, strong and modern",
		googleFont: "Teko",
		fallback: "Arial, sans-serif",
	},

	// Handwriting/Script fonts
	{
		id: "dancing-script",
		name: "Dancing Script",
		category: "Handwriting",
		description: "Casual script with bouncing letters",
		googleFont: "Dancing Script",
		fallback: "cursive",
	},
	{
		id: "pacifico",
		name: "Pacifico",
		category: "Handwriting",
		description: "Brush script, casual and friendly",
		googleFont: "Pacifico",
		fallback: "cursive",
	},
	{
		id: "caveat",
		name: "Caveat",
		category: "Handwriting",
		description: "Handwriting font, natural and flowing",
		googleFont: "Caveat",
		fallback: "cursive",
	},
	{
		id: "kalam",
		name: "Kalam",
		category: "Handwriting",
		description: "Informal handwriting, Devanagari and Latin",
		googleFont: "Kalam",
		fallback: "cursive",
	},
	{
		id: "permanent-marker",
		name: "Permanent Marker",
		category: "Handwriting",
		description: "Marker-style font, bold and casual",
		googleFont: "Permanent Marker",
		fallback: "cursive",
	},

	// Special/Decorative fonts
	{
		id: "fredoka-one",
		name: "Fredoka One",
		category: "Decorative",
		description: "Rounded sans-serif, playful and fun",
		googleFont: "Fredoka One",
		fallback: "Arial, sans-serif",
	},
	{
		id: "lobster",
		name: "Lobster",
		category: "Decorative",
		description: "Script font, elegant and sophisticated",
		googleFont: "Lobster",
		fallback: "cursive",
	},
	{
		id: "bungee",
		name: "Bungee",
		category: "Decorative",
		description: "Condensed display font, urban and bold",
		googleFont: "Bungee",
		fallback: "Arial, sans-serif",
	},
	{
		id: "creepster",
		name: "Creepster",
		category: "Decorative",
		description: "Halloween-style display font, spooky",
		googleFont: "Creepster",
		fallback: "Arial, sans-serif",
	},
	{
		id: "press-start-2p",
		name: "Press Start 2P",
		category: "Decorative",
		description: "Pixel font, retro gaming style",
		googleFont: "Press Start 2P",
		fallback: "monospace",
	},
];

interface FontContextType {
	selectedFont: FontOption;
	setSelectedFont: (font: FontOption) => void;
	fontOptions: FontOption[];
	fontCategories: string[];
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
	const [selectedFont, setSelectedFont] = useState<FontOption>(FONT_OPTIONS[0]); // Default to Inter

	useEffect(() => {
		// Check if font is stored in localStorage
		const storedFontId = localStorage.getItem("selectedFont");
		if (storedFontId) {
			const font = FONT_OPTIONS.find((f) => f.id === storedFontId);
			if (font) {
				setSelectedFont(font);
			}
		}
	}, []);

	useEffect(() => {
		// Apply font to document
		document.documentElement.style.setProperty(
			"--font-family-sans",
			selectedFont.googleFont
				? `"${selectedFont.googleFont}", ${selectedFont.fallback}`
				: selectedFont.fallback
		);

		// Store in localStorage
		localStorage.setItem("selectedFont", selectedFont.id);
	}, [selectedFont]);

	const fontCategories = Array.from(
		new Set(FONT_OPTIONS.map((font) => font.category))
	);

	return (
		<FontContext.Provider
			value={{
				selectedFont,
				setSelectedFont,
				fontOptions: FONT_OPTIONS,
				fontCategories,
			}}
		>
			{children}
		</FontContext.Provider>
	);
}

export function useFont() {
	const context = useContext(FontContext);
	if (context === undefined) {
		throw new Error("useFont must be used within a FontProvider");
	}
	return context;
}
