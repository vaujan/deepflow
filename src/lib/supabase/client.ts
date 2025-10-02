import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseBrowserClient() {
	// Only create client on the client side
	if (typeof window === "undefined") {
		throw new Error("Supabase browser client can only be used in the browser");
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// Check for placeholder values
	const isPlaceholderUrl = supabaseUrl?.includes("your-project-ref");
	const isPlaceholderKey = supabaseAnonKey?.includes("your-anon-key");

	if (
		!supabaseUrl ||
		!supabaseAnonKey ||
		isPlaceholderUrl ||
		isPlaceholderKey
	) {
		throw new Error(
			"Missing or invalid Supabase environment variables. Please check your .env.local file."
		);
	}

	// Create the client if it doesn't exist
	if (!supabaseClient) {
		supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
	}

	return supabaseClient;
}

// Export the client for backward compatibility - lazy initialization
export const supabase =
	typeof window !== "undefined" ? getSupabaseBrowserClient() : null;
