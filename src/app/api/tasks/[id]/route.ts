import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

// PATCH /api/tasks/:id - update task
export async function PATCH(
	request: Request,
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
	const update: Record<string, unknown> = {};
	if ("title" in body) update.title = body.title;
	if ("description" in body) update.description = body.description ?? null;
	if ("completed" in body) update.completed = !!body.completed;
	if ("dueDate" in body) update.due_date = body.dueDate ?? null;
	if ("project" in body) update.project = body.project ?? null;

	const { data, error } = await supabase
		.from("tasks")
		.update(update)
		.eq("id", id)
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

// DELETE /api/tasks/:id - delete task
export async function DELETE(
	_request: Request,
	context: { params: Promise<{ id: string }> }
) {
	const supabase = await getSupabaseServerClient();
	const { id } = await context.params;
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { error } = await supabase.from("tasks").delete().eq("id", id);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({ ok: true });
}
