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
	const dayKey = (d: Date) => d.toISOString().split("T")[0];
	const days = new Set<string>();
	sessions.forEach((s) => days.add(dayKey(s.startTime)));

	// Current streak
	let currentStreak = 0;
	const today = new Date();
	const cursor = new Date(today);
	cursor.setHours(0, 0, 0, 0);
	while (true) {
		const key = dayKey(cursor);
		if (days.has(key)) {
			currentStreak += 1;
			cursor.setDate(cursor.getDate() - 1);
			continue;
		}
		break;
	}

	// Longest streak
	const sortedDayKeys = Array.from(days).sort();
	let longest = 0;
	let run = 0;
	let prev: Date | null = null;
	for (const key of sortedDayKeys) {
		const d = new Date(key + "T00:00:00");
		if (prev) {
			const diff = (d.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
			if (diff === 1) {
				run += 1;
			} else {
				longest = Math.max(longest, run);
				run = 1;
			}
		} else {
			run = 1;
		}
		prev = d;
	}
	longest = Math.max(longest, run);

	return { currentStreakDays: currentStreak, longestStreakDays: longest };
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
