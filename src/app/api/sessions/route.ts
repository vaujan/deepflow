import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

// GET /api/sessions - list sessions for current user
export async function GET(request: NextRequest) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");
	const limit = Number(searchParams.get("limit") ?? 200);
	const offset = Number(searchParams.get("offset") ?? 0);

	let query = supabase
		.from("sessions")
		.select(
			"id, goal, session_type, focus_level, tags, notes, planned_duration_minutes, start_time, expected_end_time, end_time, elapsed_seconds, status, completion_type, deep_work_quality"
		)
		.eq("user_id", user.id)
		// Exclude ended sessions shorter than 5 minutes (discarded)
		// Keep active/paused (end_time is null) so timers can resume
		.or("end_time.is.null,elapsed_seconds.gte.300")
		.order("start_time", { ascending: false })
		.range(offset, offset + limit - 1);

	if (from) query = query.gte("start_time", from);
	if (to) query = query.lte("start_time", to);

	const { data, error } = await query;
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(
		(data || []).map((s: any) => ({
			id: s.id,
			goal: s.goal,
			sessionType: s.session_type,
			focusLevel: s.focus_level,
			tags: Array.isArray(s.tags) ? s.tags : [],
			notes: s.notes ?? "",
			duration: s.planned_duration_minutes ?? null,
			startTime: s.start_time,
			expectedEndTime: s.expected_end_time,
			endTime: s.end_time,
			// Compute effective elapsed for active sessions using server time
			elapsedTime:
				s.status === "active" && s.start_time
					? Math.max(
							0,
							Math.floor(
								(Date.now() - new Date(s.start_time as string).getTime()) / 1000
							)
					  )
					: Number(s.elapsed_seconds ?? 0),
			status: s.status,
			completionType: s.completion_type ?? null,
			deepWorkQuality: s.deep_work_quality ?? null,
		}))
	);
}

// POST /api/sessions - create session on start
export async function POST(request: Request) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const { goal, sessionType, focusLevel, tags, notes, duration } = body ?? {};

	if (!goal || typeof goal !== "string")
		return NextResponse.json({ error: "Invalid goal" }, { status: 400 });
	if (!sessionType || !["time-boxed", "open", "pomodoro"].includes(sessionType))
		return NextResponse.json({ error: "Invalid sessionType" }, { status: 400 });
	const parsedFocus = Number(focusLevel);
	if (!Number.isFinite(parsedFocus) || parsedFocus < 1 || parsedFocus > 10)
		return NextResponse.json({ error: "Invalid focusLevel" }, { status: 400 });

	let expectedEndTime: string | null = null;
	const plannedMinutes = typeof duration === "number" ? duration : null;
	if (plannedMinutes && plannedMinutes > 0) {
		const end = new Date(Date.now() + plannedMinutes * 60 * 1000);
		expectedEndTime = end.toISOString();
	}

	const { data, error } = await supabase
		.from("sessions")
		.insert({
			user_id: user.id,
			goal,
			session_type: sessionType,
			focus_level: parsedFocus,
			tags: Array.isArray(tags) ? tags : [],
			notes: typeof notes === "string" ? notes : null,
			planned_duration_minutes: plannedMinutes,
			expected_end_time: expectedEndTime,
			status: "active",
			elapsed_seconds: 0,
		})
		.select(
			"id, goal, session_type, focus_level, tags, notes, planned_duration_minutes, start_time, expected_end_time, end_time, elapsed_seconds, status, completion_type, deep_work_quality"
		)
		.single();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({
		id: data!.id,
		goal: data!.goal,
		sessionType: data!.session_type,
		focusLevel: data!.focus_level,
		tags: Array.isArray(data!.tags) ? data!.tags : [],
		notes: data!.notes ?? "",
		duration: data!.planned_duration_minutes ?? null,
		startTime: data!.start_time,
		expectedEndTime: data!.expected_end_time,
		endTime: data!.end_time,
		elapsedTime: data!.elapsed_seconds ?? 0,
		status: data!.status,
		completionType: data!.completion_type ?? null,
		deepWorkQuality: data!.deep_work_quality ?? null,
	});
}
