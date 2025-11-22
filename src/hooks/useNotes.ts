import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "./useAuthUser";
import { guestStorage } from "../lib/guestStorage";
import { toast } from "sonner";
import { useRef } from "react";

export interface Note {
	id: number;
	title: string;
	content: string;
	timestamp: string;
	_clientId?: string; // Stable client-side ID for React keys
}

// Helper to generate idempotency key
const generateIdempotencyKey = (prefix: string) => {
	try {
		return `${prefix}-${crypto.randomUUID()}`;
	} catch {
		return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	}
};

// Helper to extract title from markdown content
const extractTitle = (content: string): string => {
	const match = content.match(/^#\s+(.+)$/m);
	return match ? match[1].trim() : "Untitled";
};

export const useNotes = () => {
	const { isGuest } = useAuthUser();
	const queryClient = useQueryClient();

	// Track saving status for UI feedback
	const savingNotesRef = useRef<Set<number>>(new Set());

	// Fetch Notes
	const {
		data: notes,
		isLoading,
		error,
	} = useQuery<Note[]>({
		queryKey: ["notes", isGuest ? "guest" : "user"],
		queryFn: async () => {
			if (isGuest) {
				return guestStorage.getNotes() as Note[];
			}
			const res = await fetch("/api/notes");
			if (!res.ok) {
				throw new Error((await res.json()).error || "Failed to load notes");
			}
			const data = await res.json();
			// Ensure client IDs exist
			return data.map((note: Note) => ({
				...note,
				_clientId: note._clientId || crypto.randomUUID(),
			}));
		},
		staleTime: 1000 * 60, // 1 minute
		refetchInterval: 1000 * 30, // 30 seconds background sync
		refetchOnWindowFocus: true,
	});

	// Create Note Mutation
	const createNoteMutation = useMutation({
		mutationFn: async (note: {
			title: string;
			content: string;
			tempId: number;
			_clientId: string;
		}) => {
			if (isGuest) {
				// Guest mode handled in onMutate/onSuccess via cache update
				return {
					id: note.tempId,
					title: note.title,
					content: note.content,
					timestamp: "Just now",
					_clientId: note._clientId,
				};
			}
			const res = await fetch("/api/notes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": generateIdempotencyKey("notes:create"),
				},
				body: JSON.stringify({ title: note.title, content: note.content }),
			});
			if (!res.ok) {
				throw new Error((await res.json()).error || "Failed to create note");
			}
			return await res.json();
		},
		onMutate: async (newNote) => {
			await queryClient.cancelQueries({
				queryKey: ["notes", isGuest ? "guest" : "user"],
			});
			const previousNotes = queryClient.getQueryData<Note[]>([
				"notes",
				isGuest ? "guest" : "user",
			]);

			const optimisticNote: Note = {
				id: newNote.tempId,
				title: newNote.title,
				content: newNote.content,
				timestamp: "Just now",
				_clientId: newNote._clientId,
			};

			queryClient.setQueryData<Note[]>(
				["notes", isGuest ? "guest" : "user"],
				(old) => {
					return [optimisticNote, ...(old || [])];
				}
			);

			if (isGuest) {
				guestStorage.setNotes([optimisticNote, ...(previousNotes || [])]);
			}

			return { previousNotes };
		},
		onError: (err, newNote, context) => {
			queryClient.setQueryData(
				["notes", isGuest ? "guest" : "user"],
				context?.previousNotes
			);
			toast.error("Failed to create note");
		},
		onSuccess: (data, variables) => {
			// Replace temp ID with real ID in cache
			queryClient.setQueryData<Note[]>(
				["notes", isGuest ? "guest" : "user"],
				(old) => {
					return (old || []).map((n) =>
						n.id === variables.tempId
							? { ...data, _clientId: variables._clientId }
							: n
					);
				}
			);
		},
	});

	// Update Note Mutation
	const updateNoteMutation = useMutation({
		mutationFn: async ({ id, content }: { id: number; content: string }) => {
			const title = extractTitle(content);
			if (isGuest) {
				return { id, content, title };
			}
			if (id > 1000000000000) {
				throw new Error("Cannot update unsaved note");
			}

			const res = await fetch(`/api/notes/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": generateIdempotencyKey(`notes:update:${id}`),
				},
				body: JSON.stringify({ content, title }),
			});
			if (!res.ok) {
				throw new Error("Failed to update note");
			}
			return await res.json();
		},
		onMutate: async ({ id, content }) => {
			await queryClient.cancelQueries({
				queryKey: ["notes", isGuest ? "guest" : "user"],
			});
			const previousNotes = queryClient.getQueryData<Note[]>([
				"notes",
				isGuest ? "guest" : "user",
			]);

			const title = extractTitle(content);

			queryClient.setQueryData<Note[]>(
				["notes", isGuest ? "guest" : "user"],
				(old) => {
					return (old || []).map((note) =>
						note.id === id
							? { ...note, content, title, timestamp: "Just now" }
							: note
					);
				}
			);

			if (isGuest) {
				const updatedNotes = (previousNotes || []).map((note) =>
					note.id === id
						? { ...note, content, title, timestamp: "Just now" }
						: note
				);
				guestStorage.setNotes(updatedNotes);
			}

			savingNotesRef.current.add(id);

			return { previousNotes };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(
				["notes", isGuest ? "guest" : "user"],
				context?.previousNotes
			);
		},
		onSettled: (data, error, variables) => {
			savingNotesRef.current.delete(variables.id);
			queryClient.invalidateQueries({
				queryKey: ["notes", isGuest ? "guest" : "user"],
			});
		},
	});

	// Delete Note Mutation
	const deleteNoteMutation = useMutation({
		mutationFn: async (id: number) => {
			if (isGuest) {
				return;
			}
			if (id > 1000000000000) return;

			const res = await fetch(`/api/notes/${id}`, {
				method: "DELETE",
				headers: {
					"Idempotency-Key": generateIdempotencyKey(`notes:delete:${id}`),
				},
			});
			if (!res.ok) {
				throw new Error("Failed to delete note");
			}
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({
				queryKey: ["notes", isGuest ? "guest" : "user"],
			});
			const previousNotes = queryClient.getQueryData<Note[]>([
				"notes",
				isGuest ? "guest" : "user",
			]);

			queryClient.setQueryData<Note[]>(
				["notes", isGuest ? "guest" : "user"],
				(old) => {
					return (old || []).filter((note) => note.id !== id);
				}
			);

			if (isGuest) {
				const updatedNotes = (previousNotes || []).filter(
					(note) => note.id !== id
				);
				guestStorage.setNotes(updatedNotes);
			}

			return { previousNotes };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(
				["notes", isGuest ? "guest" : "user"],
				context?.previousNotes
			);
			toast.error("Failed to delete note");
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["notes", isGuest ? "guest" : "user"],
			});
		},
	});

	return {
		notes,
		isLoading,
		error,
		createNote: createNoteMutation.mutateAsync,
		updateNote: updateNoteMutation.mutateAsync,
		deleteNote: deleteNoteMutation.mutateAsync,
		isCreating: createNoteMutation.isPending,
		isUpdating: updateNoteMutation.isPending,
		isDeleting: deleteNoteMutation.isPending,
		savingNotes: savingNotesRef.current,
	};
};
