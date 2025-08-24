"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		// Check if theme is stored in localStorage
		const storedTheme = localStorage.getItem("theme") as Theme;
		if (storedTheme) {
			setTheme(storedTheme);
			document.documentElement.setAttribute("data-theme", storedTheme);
		} else {
			// Check system preference
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			const defaultTheme: Theme = prefersDark ? "dark" : "light";
			setTheme(defaultTheme);
			document.documentElement.setAttribute("data-theme", defaultTheme);
		}
	}, []);

	const toggleTheme = () => {
		const newTheme: Theme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
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
