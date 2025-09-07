"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	// Radix color customization
	colorPreferences: ColorPreferences;
	setColorPreferences: (updates: Partial<ColorPreferences>) => void;
	// Depth toggle
	depthEnabled: boolean;
	setDepthEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Restrict to Radix scales we already import in globals.css
export type RadixScaleName =
	| "blue"
	| "slate"
	| "gray"
	| "mauve"
	| "sage"
	| "olive"
	| "sand"
	| "orange"
	| "cyan"
	| "green"
	| "yellow"
	| "red";

export interface ColorPreferences {
	primary: RadixScaleName;
	secondary: RadixScaleName;
	accent: RadixScaleName;
	neutral: RadixScaleName;
	/** Neutral scale used for UI base/background (aliases gray-* vars) */
	baseNeutral: Extract<
		RadixScaleName,
		"gray" | "slate" | "mauve" | "sage" | "olive" | "sand"
	>;
}

const DEFAULT_COLOR_PREFERENCES: ColorPreferences = {
	primary: "blue",
	secondary: "slate",
	accent: "orange",
	neutral: "gray",
	baseNeutral: "gray",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("dark");
	const [colorPreferences, setColorPreferencesState] =
		useState<ColorPreferences>(DEFAULT_COLOR_PREFERENCES);
	const [depthEnabled, setDepthEnabledState] = useState<boolean>(true);

	useEffect(() => {
		// Check if theme is stored in localStorage
		const storedTheme = localStorage.getItem("theme") as Theme;
		if (storedTheme) {
			setTheme(storedTheme);
			document.documentElement.setAttribute("data-theme", storedTheme);
			if (storedTheme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		} else {
			// Default to dark theme
			const defaultTheme: Theme = "dark";
			setTheme(defaultTheme);
			document.documentElement.setAttribute("data-theme", defaultTheme);
			document.documentElement.classList.add("dark");
		}

		// Load color preferences
		try {
			const storedPrefsRaw = localStorage.getItem("colorPreferences");
			if (storedPrefsRaw) {
				const parsed = JSON.parse(storedPrefsRaw) as Partial<ColorPreferences>;
				const merged: ColorPreferences = {
					...DEFAULT_COLOR_PREFERENCES,
					...parsed,
				};
				setColorPreferencesState(merged);
				applyColorPreferencesToRoot(merged);
			} else {
				applyColorPreferencesToRoot(DEFAULT_COLOR_PREFERENCES);
			}
		} catch (_err) {
			// If parsing fails, fall back to defaults
			applyColorPreferencesToRoot(DEFAULT_COLOR_PREFERENCES);
		}

		// Load depth setting
		try {
			const storedDepth = localStorage.getItem("depthEnabled");
			const enabled = storedDepth === null ? true : storedDepth === "true";
			setDepthEnabledState(enabled);
			applyDepthVar(enabled);
		} catch (_err) {
			applyDepthVar(true);
		}
	}, []);

	// Theme variables are provided by CSS (DaisyUI themes in globals.css)

	const toggleTheme = () => {
		const newTheme: Theme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("theme", newTheme);
	};

	// Apply Radix color preferences to CSS variables
	function applyColorPreferencesToRoot(prefs: ColorPreferences) {
		const root = document.documentElement;
		root.style.setProperty("--color-primary", `var(--${prefs.primary}-9)`);
		root.style.setProperty("--color-secondary", `var(--${prefs.secondary}-9)`);
		root.style.setProperty("--color-accent", `var(--${prefs.accent}-9)`);
		root.style.setProperty("--color-neutral", `var(--${prefs.neutral}-9)`);

		// Alias gray-* tokens used across DaisyUI theme to selected neutral base scale
		for (let i = 1; i <= 12; i++) {
			if (prefs.baseNeutral === "gray") {
				// Clear overrides to use the original gray scale from Radix CSS
				root.style.removeProperty(`--gray-${i}`);
			} else {
				root.style.setProperty(
					`--gray-${i}`,
					`var(--${prefs.baseNeutral}-${i})`
				);
			}
		}
	}

	function applyDepthVar(enabled: boolean) {
		const root = document.documentElement;
		root.style.setProperty("--depth", enabled ? "1" : "0");
	}

	const setColorPreferences = (updates: Partial<ColorPreferences>) => {
		setColorPreferencesState((prev) => {
			const next = { ...prev, ...updates } as ColorPreferences;
			// Persist and apply immediately
			localStorage.setItem("colorPreferences", JSON.stringify(next));
			applyColorPreferencesToRoot(next);
			return next;
		});
	};

	const setDepthEnabled = (enabled: boolean) => {
		setDepthEnabledState(enabled);
		localStorage.setItem("depthEnabled", String(enabled));
		applyDepthVar(enabled);
	};

	// Re-apply preferences when theme changes (in case theme CSS toggles)
	useEffect(() => {
		applyColorPreferencesToRoot(colorPreferences);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme]);

	const contextValue = useMemo(
		() => ({
			theme,
			toggleTheme,
			colorPreferences,
			setColorPreferences,
			depthEnabled,
			setDepthEnabled,
		}),
		[theme, colorPreferences, depthEnabled]
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
