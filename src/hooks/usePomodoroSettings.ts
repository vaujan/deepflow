import { useCallback, useEffect, useState } from "react";

export interface PomodoroSettings {
	pomodoroMinutes: number; // focus duration
	shortBreakMinutes: number;
	longBreakMinutes: number;
	autoStartBreaks: boolean;
	autoStartPomodoros: boolean;
	longBreakInterval: number; // after how many pomodoros
}

const DEFAULT_SETTINGS: PomodoroSettings = {
	pomodoroMinutes: 25,
	shortBreakMinutes: 5,
	longBreakMinutes: 15,
	autoStartBreaks: false,
	autoStartPomodoros: false,
	longBreakInterval: 4,
};

const STORAGE_KEY = "pomodoroSettings";

export function usePomodoroSettings() {
	const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				setSettings({ ...DEFAULT_SETTINGS, ...parsed });
			}
		} catch (_err) {
			// Ignore; keep defaults
		}
	}, []);

	// Persist when settings change
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch (_err) {
			// Ignore storage errors
		}
	}, [settings]);

	const updateSettings = useCallback((partial: Partial<PomodoroSettings>) => {
		setSettings((prev) => ({ ...prev, ...partial }));
	}, []);

	return { settings, updateSettings, DEFAULT_SETTINGS };
}
