import { Session } from "../hooks/useSession";

export type Period = "7d" | "30d";

export function getDateRangeSessions(
	sessions: Session[],
	period: Period
): Session[] {
	const now = new Date();
	const start = new Date(now);
	start.setHours(0, 0, 0, 0);
	if (period === "7d") {
		start.setDate(start.getDate() - 6);
	} else if (period === "30d") {
		start.setDate(start.getDate() - 29);
	}
	return sessions.filter((s) => s.startTime >= start && s.startTime <= now);
}

export function computeCoreKpis(sessions: Session[]) {
	const totalFocusMinutes = Math.round(
		sessions.reduce((acc, s) => acc + (s.elapsedTime || 0), 0) / 60
	);
	const sessionsCount = sessions.length;
	const avgSessionMinutes =
		sessionsCount > 0 ? Math.round(totalFocusMinutes / sessionsCount) : 0;
	const qualities = sessions.map((s) => s.deepWorkQuality ?? 0);
	const avgQuality =
		qualities.length > 0
			? Number(
					(qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(1)
			  )
			: 0;
	const completed = sessions.filter(
		(s) => s.completionType === "completed"
	).length;
	const completionRate =
		sessionsCount > 0
			? Number(((completed / sessionsCount) * 100).toFixed(1))
			: 0;

	return {
		totalFocusMinutes,
		sessionsCount,
		avgSessionMinutes,
		avgQuality,
		completionRate,
	};
}

export function computeStreaks(sessions: Session[]) {
	const coerceDate = (value: any): Date | null => {
		const d = value instanceof Date ? value : new Date(value as any);
		return Number.isFinite(d.getTime()) ? d : null;
	};
	const dayKey = (d: Date) => d.toISOString().split("T")[0];
	const days = new Set<string>();
	for (const s of sessions) {
		const dt = coerceDate((s as any).startTime);
		if (!dt) continue;
		days.add(dayKey(dt));
	}

	// ISO week helpers (Monday first day)
	const startOfIsoWeek = (date: Date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
		d.setDate(d.getDate() - day);
		return d;
	};
	const weekKey = (date: Date) =>
		startOfIsoWeek(date).toISOString().split("T")[0];

	// Set of active weeks (by ISO week start date)
	const weeks = new Set<string>();
	for (const s of sessions) {
		const dt = coerceDate((s as any).startTime);
		if (!dt) continue;
		weeks.add(weekKey(dt));
	}

	// Current day streak
	let currentStreakDays = 0;
	const today = new Date();
	const cursorDay = new Date(today);
	cursorDay.setHours(0, 0, 0, 0);
	while (true) {
		const key = dayKey(cursorDay);
		if (days.has(key)) {
			currentStreakDays += 1;
			cursorDay.setDate(cursorDay.getDate() - 1);
			continue;
		}
		break;
	}

	// Longest day streak
	const sortedDayKeys = Array.from(days).sort();
	let longestDay = 0;
	let runDay = 0;
	let prevDay: Date | null = null;
	for (const key of sortedDayKeys) {
		const d = new Date(key + "T00:00:00");
		if (prevDay) {
			const diff = (d.getTime() - prevDay.getTime()) / (1000 * 60 * 60 * 24);
			if (diff === 1) {
				runDay += 1;
			} else {
				longestDay = Math.max(longestDay, runDay);
				runDay = 1;
			}
		} else {
			runDay = 1;
		}
		prevDay = d;
	}
	longestDay = Math.max(longestDay, runDay);

	// Current weekly streak (consecutive ISO weeks with any activity)
	let currentStreakWeeks = 0;
	const currentWeekStart = startOfIsoWeek(today);
	const cursorWeek = new Date(currentWeekStart);
	while (true) {
		const key = cursorWeek.toISOString().split("T")[0];
		if (weeks.has(key)) {
			currentStreakWeeks += 1;
			cursorWeek.setDate(cursorWeek.getDate() - 7);
			continue;
		}
		break;
	}

	// Longest weekly streak
	const sortedWeekKeys = Array.from(weeks)
		.map((k) => new Date(k + "T00:00:00"))
		.sort((a, b) => a.getTime() - b.getTime());
	let longestWeek = 0;
	let runWeek = 0;
	let prevWeek: Date | null = null;
	for (const d of sortedWeekKeys) {
		if (prevWeek) {
			const diffWeeks =
				(d.getTime() - prevWeek.getTime()) / (1000 * 60 * 60 * 24 * 7);
			if (diffWeeks === 1) {
				runWeek += 1;
			} else {
				longestWeek = Math.max(longestWeek, runWeek);
				runWeek = 1;
			}
		} else {
			runWeek = 1;
		}
		prevWeek = d;
	}
	longestWeek = Math.max(longestWeek, runWeek);

	return {
		currentStreakDays: currentStreakDays,
		longestStreakDays: longestDay,
		currentStreakWeeks: currentStreakWeeks,
		longestStreakWeeks: longestWeek,
	};
}

export function computeTagFocus(sessions: Session[]) {
	const map = new Map<
		string,
		{ totalMinutes: number; totalQuality: number; count: number }
	>();
	for (const s of sessions) {
		const minutes = (s.elapsedTime || 0) / 60;
		const quality = s.deepWorkQuality ?? 0;
		for (const tag of s.tags || []) {
			const prev = map.get(tag) || {
				totalMinutes: 0,
				totalQuality: 0,
				count: 0,
			};
			map.set(tag, {
				totalMinutes: prev.totalMinutes + minutes,
				totalQuality: prev.totalQuality + quality,
				count: prev.count + 1,
			});
		}
	}
	return Array.from(map.entries())
		.map(([tag, v]) => ({
			tag,
			totalMinutes: Math.round(v.totalMinutes),
			avgQuality: v.count ? Number((v.totalQuality / v.count).toFixed(1)) : 0,
			sessions: v.count,
		}))
		.sort((a, b) => b.totalMinutes - a.totalMinutes);
}

export function computeHourlyFocus(sessions: Session[]) {
	const buckets: {
		totalMinutes: number;
		totalQuality: number;
		count: number;
	}[] = Array.from({ length: 24 }, () => ({
		totalMinutes: 0,
		totalQuality: 0,
		count: 0,
	}));
	for (const s of sessions) {
		const hour = s.startTime.getHours();
		buckets[hour].totalMinutes += (s.elapsedTime || 0) / 60;
		buckets[hour].totalQuality += s.deepWorkQuality ?? 0;
		buckets[hour].count += 1;
	}
	return buckets.map((b, hour) => ({
		hour,
		totalMinutes: Math.round(b.totalMinutes),
		avgQuality: b.count ? Number((b.totalQuality / b.count).toFixed(1)) : 0,
	}));
}

export function findPeakWindow(
	hourly: { hour: number; totalMinutes: number; avgQuality: number }[],
	windowHours: number
) {
	const weightTime = 0.7;
	const weightQuality = 0.3;
	let best = { startHour: 0, endHour: windowHours - 1, score: -Infinity };
	for (let start = 0; start <= 24 - windowHours; start++) {
		let timeSum = 0;
		let qualitySum = 0;
		let count = 0;
		for (let i = 0; i < windowHours; i++) {
			const h = hourly[start + i];
			timeSum += h.totalMinutes;
			qualitySum += h.avgQuality;
			count += 1;
		}
		const avgQuality = count ? qualitySum / count : 0;
		const score = weightTime * timeSum + weightQuality * avgQuality * 10; // scale quality
		if (score > best.score) {
			best = {
				startHour: start,
				endHour: start + windowHours - 1,
				score: Number(score.toFixed(2)),
			};
		}
	}
	return best;
}
