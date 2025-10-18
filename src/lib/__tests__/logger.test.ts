import { logger, LogLevel } from "../logger";

// Mock console methods
const mockConsoleDebug = jest.spyOn(console, "debug").mockImplementation();
const mockConsoleInfo = jest.spyOn(console, "info").mockImplementation();
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("Logger", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset to development mode
		process.env.NODE_ENV = "development";
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("Development mode", () => {
		beforeEach(() => {
			process.env.NODE_ENV = "development";
		});

		it("should log debug messages in development", () => {
			logger.debug("Test debug message", { key: "value" });
			expect(mockConsoleDebug).toHaveBeenCalledWith(
				expect.stringContaining("[DEBUG] Test debug message")
			);
		});

		it("should log info messages in development", () => {
			logger.info("Test info message", { key: "value" });
			expect(mockConsoleInfo).toHaveBeenCalledWith(
				expect.stringContaining("[INFO] Test info message")
			);
		});

		it("should log warn messages in development", () => {
			logger.warn("Test warn message", { key: "value" });
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining("[WARN] Test warn message")
			);
		});

		it("should log error messages in development", () => {
			const error = new Error("Test error");
			logger.error("Test error message", error, { key: "value" });
			expect(mockConsoleError).toHaveBeenCalledWith(
				expect.stringContaining("[ERROR] Test error message")
			);
		});
	});

	describe("Production mode", () => {
		beforeEach(() => {
			process.env.NODE_ENV = "production";
		});

		it("should not log debug messages in production", () => {
			logger.debug("Test debug message", { key: "value" });
			expect(mockConsoleDebug).not.toHaveBeenCalled();
		});

		it("should log info messages in production", () => {
			logger.info("Test info message", { key: "value" });
			expect(mockConsoleInfo).toHaveBeenCalledWith(
				expect.stringContaining("[INFO] Test info message")
			);
		});

		it("should log warn messages in production", () => {
			logger.warn("Test warn message", { key: "value" });
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining("[WARN] Test warn message")
			);
		});

		it("should log error messages in production", () => {
			const error = new Error("Test error");
			logger.error("Test error message", error, { key: "value" });
			expect(mockConsoleError).toHaveBeenCalledWith(
				expect.stringContaining("[ERROR] Test error message")
			);
		});
	});

	describe("Log levels", () => {
		it("should have correct log level values", () => {
			expect(LogLevel.DEBUG).toBe(0);
			expect(LogLevel.INFO).toBe(1);
			expect(LogLevel.WARN).toBe(2);
			expect(LogLevel.ERROR).toBe(3);
		});
	});

	describe("Message formatting", () => {
		it("should format messages with context", () => {
			logger.info("Test message", { userId: "123", action: "test" });
			expect(mockConsoleInfo).toHaveBeenCalledWith(
				expect.stringContaining('Context: {"userId":"123","action":"test"}')
			);
		});

		it("should format messages with errors", () => {
			const error = new Error("Test error");
			error.stack = "Error stack trace";
			logger.error("Test message", error);
			expect(mockConsoleError).toHaveBeenCalledWith(
				expect.stringContaining("Error: Test error")
			);
			expect(mockConsoleError).toHaveBeenCalledWith(
				expect.stringContaining("Stack: Error stack trace")
			);
		});

		it("should include timestamp in messages", () => {
			const before = new Date().getTime();
			logger.info("Test message");
			const after = new Date().getTime();

			expect(mockConsoleInfo).toHaveBeenCalledWith(
				expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
			);
		});
	});
});
