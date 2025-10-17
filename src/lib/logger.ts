/**
 * Production-ready logging service
 * Replaces console.log statements with proper logging levels
 */

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
}

interface LogEntry {
	level: LogLevel;
	message: string;
	timestamp: string;
	context?: Record<string, unknown>;
	error?: Error;
}

class Logger {
	private minLevel: LogLevel;
	private isDevelopment: boolean;

	constructor() {
		this.isDevelopment = process.env.NODE_ENV === "development";
		this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
	}

	private shouldLog(level: LogLevel): boolean {
		return level >= this.minLevel;
	}

	private formatMessage(
		level: LogLevel,
		message: string,
		context?: Record<string, unknown>,
		error?: Error
	): string {
		const timestamp = new Date().toISOString();
		const levelName = LogLevel[level];

		let formattedMessage = `[${timestamp}] [${levelName}] ${message}`;

		if (context && Object.keys(context).length > 0) {
			formattedMessage += ` | Context: ${JSON.stringify(context)}`;
		}

		if (error) {
			formattedMessage += ` | Error: ${error.message}`;
			if (error.stack) {
				formattedMessage += ` | Stack: ${error.stack}`;
			}
		}

		return formattedMessage;
	}

	private log(
		level: LogLevel,
		message: string,
		context?: Record<string, unknown>,
		error?: Error
	): void {
		if (!this.shouldLog(level)) return;

		const formattedMessage = this.formatMessage(level, message, context, error);

		// In development, use console methods for better debugging
		if (this.isDevelopment) {
			switch (level) {
				case LogLevel.DEBUG:
					console.debug(formattedMessage);
					break;
				case LogLevel.INFO:
					console.info(formattedMessage);
					break;
				case LogLevel.WARN:
					console.warn(formattedMessage);
					break;
				case LogLevel.ERROR:
					console.error(formattedMessage);
					break;
			}
		} else {
			// In production, you might want to send logs to a service like Sentry, LogRocket, etc.
			// For now, we'll use console methods but you can replace this with your logging service
			switch (level) {
				case LogLevel.DEBUG:
					// Don't log debug in production
					break;
				case LogLevel.INFO:
					console.info(formattedMessage);
					break;
				case LogLevel.WARN:
					console.warn(formattedMessage);
					break;
				case LogLevel.ERROR:
					console.error(formattedMessage);
					// Here you could send to error tracking service
					// Example: Sentry.captureException(error);
					break;
			}
		}
	}

	debug(message: string, context?: Record<string, unknown>): void {
		this.log(LogLevel.DEBUG, message, context);
	}

	info(message: string, context?: Record<string, unknown>): void {
		this.log(LogLevel.INFO, message, context);
	}

	warn(message: string, context?: Record<string, unknown>): void {
		this.log(LogLevel.WARN, message, context);
	}

	error(
		message: string,
		error?: Error,
		context?: Record<string, unknown>
	): void {
		this.log(LogLevel.ERROR, message, context, error);
	}
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { debug, info, warn, error } = logger;
