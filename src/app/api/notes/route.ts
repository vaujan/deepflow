import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { starterNotes } from "../../../data/starterNotes";

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

	// If user has no notes, create the welcome note
	if (!data || data.length === 0) {
		const welcomeNote = starterNotes[0];
		const { data: newNote, error: insertError } = await supabase
			.from("notes")
			.insert({
				user_id: user.id,
				title: welcomeNote.title,
				content: welcomeNote.content,
			})
			.select("id, title, content, created_at, updated_at")
			.single();

		if (insertError) {
			return NextResponse.json({ error: insertError.message }, { status: 500 });
		}

		// Return the welcome note
		return NextResponse.json([
			{
				id: newNote!.id,
				title: newNote!.title ?? "",
				content: newNote!.content ?? "",
				timestamp:
					newNote!.updated_at || newNote!.created_at
						? new Date(
								newNote!.updated_at || newNote!.created_at
						  ).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
						  })
						: "",
			},
		]);
	}

	return NextResponse.json(
		(data || []).map((n: Record<string, unknown>) => ({
			id: n.id,
			title: n.title ?? "",
			content: n.content ?? "",
			timestamp:
				n.updated_at || n.created_at
					? new Date(
							(n.updated_at || n.created_at) as string
					  ).toLocaleDateString("en-US", {
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
	if (typeof content !== "string")
		return NextResponse.json(
			{ error: "Content must be a string" },
			{ status: 400 }
		);

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
		content: data!.content ?? "",
		timestamp:
			data!.updated_at || data!.created_at
				? new Date(data!.updated_at || data!.created_at).toLocaleDateString(
						"en-US",
						{ month: "short", day: "numeric" }
				  )
				: "",
	});
}
