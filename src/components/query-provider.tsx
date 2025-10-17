"use client";

import React from "react";
import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						gcTime: 24 * 60 * 60 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	const persister = React.useMemo(() => {
		return createSyncStoragePersister({
			storage: typeof window !== "undefined" ? window.localStorage : undefined,
			key: "deepflow-query-cache",
		});
	}, []);

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</PersistQueryClientProvider>
	);
}
