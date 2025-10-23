import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
	// Skip middleware if environment variables are not configured
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (
		!supabaseUrl ||
		!supabaseAnonKey ||
		supabaseUrl.includes("your-project-ref") ||
		supabaseAnonKey.includes("your-anon-key")
	) {
		// If Supabase is not configured, allow access to login page, redirect others to login
		if (req.nextUrl.pathname === "/login") {
			return NextResponse.next();
		} else {
			const redirectUrl = req.nextUrl.clone();
			redirectUrl.pathname = "/login";
			return NextResponse.redirect(redirectUrl);
		}
	}

	let response = NextResponse.next({
		request: {
			headers: req.headers,
		},
	});

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return req.cookies.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				req.cookies.set({
					name,
					value,
					...options,
				});
				response = NextResponse.next({
					request: {
						headers: req.headers,
					},
				});
				response.cookies.set({
					name,
					value,
					...options,
				});
			},
			remove(name: string, options: CookieOptions) {
				req.cookies.set({
					name,
					value: "",
					...options,
				});
				response = NextResponse.next({
					request: {
						headers: req.headers,
					},
				});
				response.cookies.set({
					name,
					value: "",
					...options,
				});
			},
		},
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// If user is signed in and the current path is /login, redirect to home
	if (session && req.nextUrl.pathname === "/login") {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = "/";
		return NextResponse.redirect(redirectUrl);
	}

	// Allow guest access to main routes - only redirect to login for protected routes
	// Guest mode is handled by the client-side useAuthUser hook
	const protectedRoutes = ["/profile"];
	if (!session && protectedRoutes.includes(req.nextUrl.pathname)) {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = "/login";
		return NextResponse.redirect(redirectUrl);
	}

	return response;
}

export const config = {
	matcher: ["/", "/stats", "/profile"],
};
