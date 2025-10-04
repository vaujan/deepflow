import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

// GET /api/notes - list notes for current user
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
		.from("notes")
		.select("id, title, content, created_at, updated_at")
		.order("created_at", { ascending: false });

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(
		(data || []).map((n: any) => ({
			id: n.id,
			title: n.title ?? "",
			content: n.content ?? "<p></p>",
			timestamp:
				n.updated_at || n.created_at
					? new Date(n.updated_at || n.created_at).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
					  })
					: "",
		}))
	);
}

// POST /api/notes - create note
export async function POST(request: Request) {
	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const { title, content } = body ?? {};
	if (typeof title !== "string" || title.length < 1)
		return NextResponse.json({ error: "Title is required" }, { status: 400 });
	if (typeof content !== "string" || content.length < 1)
		return NextResponse.json({ error: "Content is required" }, { status: 400 });

	const { data, error } = await supabase
		.from("notes")
		.insert({ user_id: user.id, title, content })
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
