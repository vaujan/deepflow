"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import { Github, Chrome, Loader2 } from "lucide-react";

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
          "Supabase is not configured. Please set up your Supabase project and update the environment variables.",
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
        "Supabase is not configured. Please set up your Supabase project and update the environment variables.",
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

  return (
    <div className="min-h-screen bg-gray-2 flex bg-dots items-center justify-center p-4">
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
              <Chrome size={20} />
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
