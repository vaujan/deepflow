import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

// PATCH /api/notes/:id - update note
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
	if ("content" in body) update.content = body.content;

	const { data, error } = await supabase
		.from("notes")
		.update(update)
		.eq("id", id)
		.select("id, title, content, created_at, updated_at")
		.single();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({
		id: data!.id,
		title: data!.title ?? "",
		content: data!.content ?? "<p></p>",
		timestamp:
			data!.updated_at || data!.created_at
				? new Date(data!.updated_at || data!.created_at).toLocaleDateString(
						"en-US",
						{ month: "short", day: "numeric" }
				  )
				: "",
	});
}

// DELETE /api/notes/:id - delete note
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

	const { error } = await supabase.from("notes").delete().eq("id", id);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({ ok: true });
}
