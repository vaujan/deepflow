import { sessionDataTransformer } from "../sessionDataTransformer";

describe("sessionDataTransformer", () => {
	const mockServerSession = {
		id: "test-session-id",
		goal: "Test goal",
		session_type: "time-boxed",
		tags: ["work", "important"],
		notes: "Test notes",
		planned_duration_minutes: 25,
		start_time: "2024-01-01T10:00:00Z",
		expected_end_time: "2024-01-01T10:25:00Z",
		end_time: "2024-01-01T10:25:00Z",
		elapsed_seconds: 1500,
		status: "completed",
		completion_type: "completed",
		deep_work_quality: 8,
	};

	it("should transform server session data correctly", () => {
		const result = sessionDataTransformer(mockServerSession);

		expect(result).toEqual({
			id: "test-session-id",
			goal: "Test goal",
			sessionType: "time-boxed",
			tags: ["work", "important"],
			notes: "Test notes",
			duration: 25,
			startTime: "2024-01-01T10:00:00Z",
			expectedEndTime: "2024-01-01T10:25:00Z",
			endTime: "2024-01-01T10:25:00Z",
			elapsedTime: 1500,
			status: "completed",
			completionType: "completed",
			deepWorkQuality: 8,
		});
	});

	it("should handle missing optional fields", () => {
		const minimalSession = {
			id: "test-session-id",
			goal: "Test goal",
			session_type: "open",
			tags: [],
			notes: null,
			planned_duration_minutes: null,
			start_time: "2024-01-01T10:00:00Z",
			expected_end_time: null,
			end_time: null,
			elapsed_seconds: 0,
			status: "active",
			completion_type: null,
			deep_work_quality: null,
		};

		const result = sessionDataTransformer(minimalSession);

		expect(result).toEqual({
			id: "test-session-id",
			goal: "Test goal",
			sessionType: "open",
			tags: [],
			notes: "",
			duration: null,
			startTime: "2024-01-01T10:00:00Z",
			expectedEndTime: null,
			endTime: null,
			elapsedTime: 0,
			status: "active",
			completionType: null,
			deepWorkQuality: null,
		});
	});

	it("should handle non-array tags", () => {
		const sessionWithInvalidTags = {
			...mockServerSession,
			tags: "invalid-tags",
		};

		const result = sessionDataTransformer(sessionWithInvalidTags);

		expect(result.tags).toEqual([]);
	});

	it("should handle undefined notes", () => {
		const sessionWithUndefinedNotes = {
			...mockServerSession,
			notes: undefined,
		};

		const result = sessionDataTransformer(sessionWithUndefinedNotes);

		expect(result.notes).toBe("");
	});

	it("should handle null notes", () => {
		const sessionWithNullNotes = {
			...mockServerSession,
			notes: null,
		};

		const result = sessionDataTransformer(sessionWithNullNotes);

		expect(result.notes).toBe("");
	});

	it("should handle empty string notes", () => {
		const sessionWithEmptyNotes = {
			...mockServerSession,
			notes: "",
		};

		const result = sessionDataTransformer(sessionWithEmptyNotes);

		expect(result.notes).toBe("");
	});

	it("should handle different session types", () => {
		const sessionTypes = ["time-boxed", "open", "pomodoro"];

		sessionTypes.forEach((sessionType) => {
			const session = {
				...mockServerSession,
				session_type: sessionType,
			};

			const result = sessionDataTransformer(session);
			expect(result.sessionType).toBe(sessionType);
		});
	});

	it("should handle different statuses", () => {
		const statuses = ["active", "paused", "completed", "stopped"];

		statuses.forEach((status) => {
			const session = {
				...mockServerSession,
				status: status,
			};

			const result = sessionDataTransformer(session);
			expect(result.status).toBe(status);
		});
	});

	it("should handle different completion types", () => {
		const completionTypes = ["completed", "premature", "overtime"];

		completionTypes.forEach((completionType) => {
			const session = {
				...mockServerSession,
				completion_type: completionType,
			};

			const result = sessionDataTransformer(session);
			expect(result.completionType).toBe(completionType);
		});
	});

	it("should handle numeric deep work quality", () => {
		const session = {
			...mockServerSession,
			deep_work_quality: 7.5,
		};

		const result = sessionDataTransformer(session);
		expect(result.deepWorkQuality).toBe(7.5);
	});

	it("should handle string deep work quality", () => {
		const session = {
			...mockServerSession,
			deep_work_quality: "9",
		};

		const result = sessionDataTransformer(session);
		expect(result.deepWorkQuality).toBe(9);
	});
});
