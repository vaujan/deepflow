import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	// Check if Supabase is properly configured
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (
		!supabaseUrl ||
		!supabaseAnonKey ||
		supabaseUrl.includes("your-project-ref") ||
		supabaseAnonKey.includes("your-anon-key")
	) {
		// If Supabase is not configured, redirect to login with error
		return NextResponse.redirect(
			`${origin}/login?error=supabase-not-configured`
		);
	}

	if (!code) {
		return NextResponse.redirect(`${origin}/login?error=missing_code`);
	}

	const cookieStore = await cookies();
	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				cookieStore.set({ name, value, ...options });
			},
			remove(name: string, options: CookieOptions) {
				cookieStore.set({ name, value: "", ...options });
			},
		},
	});

	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (!error) {
		const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
		const isLocalEnv = process.env.NODE_ENV === "development";
		if (isLocalEnv) {
			return NextResponse.redirect(`${origin}${next}`);
		} else if (forwardedHost) {
			return NextResponse.redirect(`https://${forwardedHost}${next}`);
		} else {
			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/login?error=auth-callback-error`);
}
