import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { validateCSRF } from "../../../lib/csrf";

// Simple in-memory rate limiting and idempotency cache (best-effort, single instance)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // max requests per IP per window
const rateLimiter = new Map<string, { windowStart: number; count: number }>();

const IDEMPOTENCY_TTL_MS = 10 * 60_000; // 10 minutes
const idempotencyCache = new Map<string, number>(); // key -> expiresAt

function clientIp(req: NextRequest) {
	// Prefer standard proxy headers, fallback to connection
	const xfwd = req.headers.get("x-forwarded-for");
	if (xfwd) return xfwd.split(",")[0].trim();
	const xreal = req.headers.get("x-real-ip");
	if (xreal) return xreal;
	return "unknown";
}

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimiter.get(ip);
	if (!entry) {
		rateLimiter.set(ip, { windowStart: now, count: 1 });
		return true;
	}
	if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
		rateLimiter.set(ip, { windowStart: now, count: 1 });
		return true;
	}
	if (entry.count >= RATE_LIMIT_MAX) return false;
	entry.count += 1;
	return true;
}

function checkAndStoreIdempotency(key: string | null | undefined): boolean {
	if (!key) return true;
	const now = Date.now();
	// purge expired lazily
	for (const [k, exp] of idempotencyCache) {
		if (exp <= now) idempotencyCache.delete(k);
	}
	if (idempotencyCache.has(key)) return false;
	idempotencyCache.set(key, now + IDEMPOTENCY_TTL_MS);
	return true;
}

type FeedbackBody = {
	message?: string;
	category?: "bug" | "idea" | "other";
	contact?: string;
	rating?: number;
	metadata?: Record<string, unknown>;
	page_url?: string;
	app_version?: string;
};

export async function POST(request: NextRequest) {
	// CSRF protection
	if (!validateCSRF(request)) {
		return NextResponse.json(
			{ error: "Invalid request origin" },
			{ status: 403 }
		);
	}

	const ip = clientIp(request);
	if (!checkRateLimit(ip)) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	const idempotencyKey = request.headers.get("idempotency-key");
	if (!checkAndStoreIdempotency(idempotencyKey)) {
		return NextResponse.json({ ok: true, duplicate: true }, { status: 201 });
	}

	let body: FeedbackBody;
	try {
		body = (await request.json()) as FeedbackBody;
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const message = typeof body.message === "string" ? body.message.trim() : "";
	const category = body.category ?? "idea";
	const contact =
		typeof body.contact === "string" ? body.contact.trim() : undefined;
	const rating = body.rating;
	const metadata =
		body.metadata && typeof body.metadata === "object"
			? body.metadata
			: undefined;
	const pageUrl = body.page_url || request.headers.get("referer") || undefined;
	const appVersion =
		body.app_version ||
		request.headers.get("x-app-version") ||
		process.env.NEXT_PUBLIC_APP_VERSION ||
		"beta";

	// Validation
	const errors: Record<string, string> = {};
	if (message.length < 5 || message.length > 4000) {
		errors.message = "Message must be between 5 and 4000 characters.";
	}
	if (!["bug", "idea", "other"].includes(category)) {
		errors.category = "Invalid category.";
	}
	if (typeof rating !== "undefined") {
		const r = Number(rating);
		if (!Number.isFinite(r) || r < 1 || r > 5)
			errors.rating = "Rating must be 1–5.";
	}
	if (Object.keys(errors).length) {
		return NextResponse.json(
			{ error: "Validation failed", details: errors },
			{ status: 400 }
		);
	}

	const supabase = await getSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { error } = await supabase.from("feedback").insert({
		message,
		category,
		contact: contact || null,
		rating: typeof rating === "number" ? rating : null,
		app_version: appVersion,
		page_url: pageUrl || null,
		metadata: metadata ? (metadata as Record<string, unknown>) : null,
		user_id: user?.id ?? null,
	});
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ ok: true }, { status: 201 });
}
