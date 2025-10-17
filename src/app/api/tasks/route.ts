import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

// GET /api/tasks - list tasks for current user
export async function GET() {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data, error } = await supabase
		.from("tasks")
		.select("id, title, description, completed, due_date, project")
		.order("created_at", { ascending: false });

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(
		(data || []).map((t) => ({
			id: t.id,
			title: t.title,
			description: t.description ?? "",
			completed: t.completed,
			dueDate: t.due_date ?? null,
			project: t.project ?? "",
		}))
	);
}

// POST /api/tasks - create task
export async function POST(request: Request) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const { title, description, dueDate, project } = body ?? {};
	if (!title || typeof title !== "string")
		return NextResponse.json({ error: "Invalid title" }, { status: 400 });

	const { data, error } = await supabase
		.from("tasks")
		.insert({
			user_id: user.id,
			title,
			description: description ?? null,
			due_date: dueDate ?? null,
			project: project ?? null,
		})
		.select("id, title, description, completed, due_date, project")
		.single();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({
		id: data!.id,
		title: data!.title,
		description: data!.description ?? "",
		completed: data!.completed,
		dueDate: data!.due_date ?? null,
		project: data!.project ?? "",
	});
}
