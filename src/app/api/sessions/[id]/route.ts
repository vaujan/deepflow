import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

// Helper to compute completion_type based on expected vs actual
function computeCompletionType(expectedEnd: string | null, endIso: string) {
	if (!expectedEnd) return "completed";
	try {
		const expected = new Date(expectedEnd).getTime();
		const actual = new Date(endIso).getTime();
		const diff = actual - expected;
		const toleranceMs = 60_000;
		if (diff < -toleranceMs) return "premature";
		if (diff > toleranceMs) return "overtime";
		return "completed";
	} catch {
		return "completed";
	}
}

// PATCH /api/sessions/:id
export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const supabase = await getSupabaseServerClient();
	const { id } = await context.params;
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const action = body?.action as
		| "pause"
		| "resume"
		| "complete"
		| "stop"
		| "updateMeta";

	// Load current row to compute elapsed/expectedEndType on server time
	const { data: current, error: loadErr } = await supabase
		.from("sessions")
		.select(
			"id, start_time, expected_end_time, elapsed_seconds, status, planned_duration_minutes"
		)
		.eq("id", id)
		.single();
	if (loadErr || !current)
		return NextResponse.json(
			{ error: loadErr?.message || "Not found" },
			{ status: 404 }
		);

	const nowIso = new Date().toISOString();
	let update: Record<string, unknown> = {};

	// Compute next elapsed based on current row and server time if transitioning to non-active
	const startMs = new Date(current.start_time as string).getTime();
	const already = Number(current.elapsed_seconds ?? 0);
	const nowMs = Date.now();
	const computedElapsed = Math.max(0, Math.floor((nowMs - startMs) / 1000));

	switch (action) {
		case "pause": {
			update.status = "paused";
			update.elapsed_seconds = computedElapsed;
			break;
		}
		case "resume": {
			update.status = "active";
			// Preserve elapsed as of pause and shift start_time forward so future
			// elapsed calculations exclude paused duration.
			// This keeps elapsed_time monotonic without jumps on resume.
			update.elapsed_seconds = already;
			const adjustedStartMs = nowMs - already * 1000;
			update.start_time = new Date(adjustedStartMs).toISOString();
			break;
		}
		case "complete": {
			update.status = "completed";
			update.end_time = nowIso;
			update.elapsed_seconds = computedElapsed;
			// Allow completing with metadata in a single request
			if ("notes" in body)
				update.notes = typeof body.notes === "string" ? body.notes : null;
			if ("deepWorkQuality" in body)
				update.deep_work_quality = Number(body.deepWorkQuality);
			if (Array.isArray(body.tags)) update.tags = body.tags;
			update.completion_type = computeCompletionType(
				current.expected_end_time as string | null,
				nowIso
			);
			break;
		}
		case "stop": {
			update.status = "stopped";
			update.end_time = nowIso;
			update.elapsed_seconds = computedElapsed;
			update.completion_type = computeCompletionType(
				current.expected_end_time as string | null,
				nowIso
			);
			break;
		}
		case "updateMeta": {
			if ("notes" in body)
				update.notes = typeof body.notes === "string" ? body.notes : null;
			if ("deepWorkQuality" in body)
				update.deep_work_quality = Number(body.deepWorkQuality);
			if (Array.isArray(body.tags)) update.tags = body.tags;
			break;
		}
		default:
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
	}

	const { data, error } = await supabase
		.from("sessions")
		.update(update)
		.eq("id", id)
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

// GET /api/sessions/:id
export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const supabase = await getSupabaseServerClient();
	const { id } = await context.params;
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { data, error } = await supabase
		.from("sessions")
		.select(
			"id, goal, session_type, focus_level, tags, notes, planned_duration_minutes, start_time, expected_end_time, end_time, elapsed_seconds, status, completion_type, deep_work_quality"
		)
		.eq("id", id)
		.single();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 404 });

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

// DELETE /api/sessions/:id (optional)
export async function DELETE(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const supabase = await getSupabaseServerClient();
	const { id } = await context.params;
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { error } = await supabase.from("sessions").delete().eq("id", id);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ ok: true });
}
