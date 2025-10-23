"use client";

import { useEffect, useState } from "react";

interface AuthState {
	user: { id: string } | null;
	isGuest: boolean;
	loading: boolean;
}

export function useAuthUser(): AuthState {
	const [state, setState] = useState<AuthState>({
		user: null,
		isGuest: true,
		loading: true,
	});

	useEffect(() => {
		let unsub: (() => void) | null = null;
		(async () => {
			try {
				const { getSupabaseBrowserClient } = await import(
					"../lib/supabase/client"
				);
				const supabase = getSupabaseBrowserClient();
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setState({
					user: session?.user ?? null,
					isGuest: !session?.user,
					loading: false,
				});

				const {
					data: { subscription },
				} = supabase.auth.onAuthStateChange((_event, nextSession) => {
					setState({
						user: nextSession?.user ?? null,
						isGuest: !nextSession?.user,
						loading: false,
					});
				});
				unsub = () => subscription.unsubscribe();
			} catch {
				setState({ user: null, isGuest: true, loading: false });
			}
		})();
		return () => {
			if (unsub) unsub();
		};
	}, []);

	return state;
}
