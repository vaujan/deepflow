/**
 * Radix Color Integration for DeepFlow
 *
 * This file maps Radix Color scales to DaisyUI semantic tokens,
 * providing a hybrid approach that combines Radix's excellent
 * color science with DaisyUI's component system.
 */

import * as RadixColors from "@radix-ui/colors";

// Color scale mappings
export const radixColorMapping = {
	// Base colors (backgrounds)
	base: {
		light: {
			"base-100": RadixColors.whiteA.whiteA12, // Pure white
			"base-200": RadixColors.gray.gray2, // Light gray
			"base-300": RadixColors.gray.gray3, // Medium light gray
			"base-content": RadixColors.gray.gray12, // Dark text
		},
		dark: {
			"base-100": RadixColors.gray.gray2, // Dark background
			"base-200": RadixColors.gray.gray3, // Slightly lighter
			"base-300": RadixColors.gray.gray4, // Medium dark
			"base-content": RadixColors.gray.gray12, // Light text
		},
	},

	// Primary colors (brand/accent)
	primary: {
		light: {
			primary: RadixColors.blue.blue9, // Main blue
			"primary-content": RadixColors.blue.blue12, // Text on primary
			"primary-focus": RadixColors.blue.blue10, // Focus state
			"primary-hover": RadixColors.blue.blue8, // Hover state
		},
		dark: {
			primary: RadixColors.blue.blue9, // Same blue for consistency
			"primary-content": RadixColors.blue.blue12, // Text on primary
			"primary-focus": RadixColors.blue.blue10, // Focus state
			"primary-hover": RadixColors.blue.blue8, // Hover state
		},
	},

	// Secondary colors
	secondary: {
		light: {
			secondary: RadixColors.slate.slate9, // Neutral secondary
			"secondary-content": RadixColors.slate.slate12, // Text on secondary
			"secondary-focus": RadixColors.slate.slate10, // Focus state
			"secondary-hover": RadixColors.slate.slate8, // Hover state
		},
		dark: {
			secondary: RadixColors.slate.slate9, // Same for consistency
			"secondary-content": RadixColors.slate.slate12, // Text on secondary
			"secondary-focus": RadixColors.slate.slate10, // Focus state
			"secondary-hover": RadixColors.slate.slate8, // Hover state
		},
	},

	// Accent colors
	accent: {
		light: {
			accent: RadixColors.orange.orange9, // Warm accent
			"accent-content": RadixColors.orange.orange12, // Text on accent
			"accent-focus": RadixColors.orange.orange10, // Focus state
			"accent-hover": RadixColors.orange.orange8, // Hover state
		},
		dark: {
			accent: RadixColors.orange.orange9, // Same for consistency
			"accent-content": RadixColors.orange.orange12, // Text on accent
			"accent-focus": RadixColors.orange.orange10, // Focus state
			"accent-hover": RadixColors.orange.orange8, // Hover state
		},
	},

	// Neutral colors
	neutral: {
		light: {
			neutral: RadixColors.gray.gray9, // Neutral gray
			"neutral-content": RadixColors.gray.gray12, // Text on neutral
			"neutral-focus": RadixColors.gray.gray10, // Focus state
			"neutral-hover": RadixColors.gray.gray8, // Hover state
		},
		dark: {
			neutral: RadixColors.gray.gray9, // Same for consistency
			"neutral-content": RadixColors.gray.gray12, // Text on neutral
			"neutral-focus": RadixColors.gray.gray10, // Focus state
			"neutral-hover": RadixColors.gray.gray8, // Hover state
		},
	},

	// Status colors
	status: {
		light: {
			info: RadixColors.cyan.cyan9, // Info blue
			"info-content": RadixColors.cyan.cyan12, // Text on info
			success: RadixColors.green.green9, // Success green
			"success-content": RadixColors.green.green12, // Text on success
			warning: RadixColors.yellow.yellow9, // Warning yellow
			"warning-content": RadixColors.yellow.yellow12, // Text on warning
			error: RadixColors.red.red9, // Error red
			"error-content": RadixColors.red.red12, // Text on error
		},
		dark: {
			info: RadixColors.cyan.cyan9, // Same for consistency
			"info-content": RadixColors.cyan.cyan12, // Text on info
			success: RadixColors.green.green9, // Success green
			"success-content": RadixColors.green.green12, // Text on success
			warning: RadixColors.yellow.yellow9, // Warning yellow
			"warning-content": RadixColors.yellow.yellow12, // Text on warning
			error: RadixColors.red.red9, // Error red
			"error-content": RadixColors.red.red12, // Text on error
		},
	},
};

// Generate CSS custom properties for a theme
export function generateRadixTheme(theme: "light" | "dark") {
	const themeColors = {
		base: radixColorMapping.base[theme],
		primary: radixColorMapping.primary[theme],
		secondary: radixColorMapping.secondary[theme],
		accent: radixColorMapping.accent[theme],
		neutral: radixColorMapping.neutral[theme],
		status: radixColorMapping.status[theme],
	};

	const cssVars: Record<string, string> = {};

	// Convert to CSS custom properties
	Object.entries(themeColors).forEach(([category, colors]) => {
		Object.entries(colors).forEach(([key, value]) => {
			const cssVarName = `--color-${key}`;
			cssVars[cssVarName] = value;
		});
	});

	return cssVars;
}

// Get a specific color value
export function getRadixColor(
	category: keyof typeof radixColorMapping,
	colorKey: string,
	theme: "light" | "dark" = "dark"
): string {
	const categoryColors = radixColorMapping[category][theme];
	return categoryColors[colorKey as keyof typeof categoryColors] || "";
}

// Get alpha variant of a color
export function getRadixColorAlpha(
	category: keyof typeof radixColorMapping,
	colorKey: string,
	theme: "light" | "dark" = "dark",
	alpha: number = 0.5
): string {
	const baseColor = getRadixColor(category, colorKey, theme);
	if (!baseColor) return "";

	// Convert hex to rgba for alpha support
	if (baseColor.startsWith("#")) {
		const hex = baseColor.replace("#", "");
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	return baseColor;
}

// Export individual color scales for direct use
export const radixColorScales = {
	blue: RadixColors.blue,
	slate: RadixColors.slate,
	gray: RadixColors.gray,
	orange: RadixColors.orange,
	cyan: RadixColors.cyan,
	green: RadixColors.green,
	yellow: RadixColors.yellow,
	red: RadixColors.red,
	// Add more scales as needed
} as const;

export type RadixColorScale = keyof typeof radixColorScales;
