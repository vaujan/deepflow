"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import { Github, Loader2 } from "lucide-react";

export default function LoginPage() {
	const [loading, setLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const headingRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		// Focus heading on mount for accessibility
		if (headingRef.current) {
			headingRef.current.focus();
		}

		// Check for error parameters in URL
		const searchParams = new URLSearchParams(window.location.search);
		const errorParam = searchParams.get("error");
		if (errorParam) {
			if (errorParam === "supabase-not-configured") {
				setError(
					"Supabase is not configured. Please set up your Supabase project and update the environment variables."
				);
			} else if (errorParam === "auth-callback-error") {
				setError("Authentication failed. Please try again.");
			}
		}
	}, []);

	const signInWithOAuth = async (provider: "google" | "github") => {
		setLoading(provider);
		setError(null);

		// Check if Supabase is configured
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (
			!supabaseUrl ||
			!supabaseAnonKey ||
			supabaseUrl.includes("your-project-ref") ||
			supabaseAnonKey.includes("your-anon-key")
		) {
			setError(
				"Supabase is not configured. Please set up your Supabase project and update the environment variables."
			);
			setLoading(null);
			return;
		}

		try {
			const { getSupabaseBrowserClient } = await import(
				"../../lib/supabase/client"
			);
			const supabase = getSupabaseBrowserClient();

			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
				},
			});

			if (error) {
				setError(error.message);
				setLoading(null);
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
			setLoading(null);
		}
	};

	// Google icon component
	const GoogleIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
	);

	return (
		<div className="min-h-screen bg-gray-2 flex items-center justify-center p-4">
			<div className="w-full bg-base-300 border border-border card max-w-md rounded-box shadow-xl p-8">
				<div className="space-y-4">
					<button
						onClick={() => signInWithOAuth("google")}
						disabled={loading !== null}
						className="w-full btn min-h-[48px] gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
						aria-label="Continue with Google"
					>
						{loading === "google" ? (
							<Loader2 size={20} className="animate-spin" />
						) : (
							<GoogleIcon />
						)}
						{loading === "google" ? "Signing in..." : "Continue with Google"}
					</button>

					<button
						onClick={() => signInWithOAuth("github")}
						disabled={loading !== null}
						className="w-full btn min-h-[48px] gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
						aria-label="Continue with GitHub"
					>
						{loading === "github" ? (
							<Loader2 size={20} className="animate-spin" />
						) : (
							<Github size={20} />
						)}
						{loading === "github" ? "Signing in..." : "Continue with GitHub"}
					</button>
				</div>

				{error && (
					<div
						role="alert"
						aria-live="polite"
						className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm"
					>
						{error}
					</div>
				)}
			</div>
		</div>
	);
}
