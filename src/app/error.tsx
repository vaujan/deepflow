"use client";

import { useEffect } from "react";

import Link from "next/link";
import { logger } from "../lib/logger";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to our logging service
    logger.error("Error page - Client-side error", error, {
      digest: error.digest,
      page: "error",
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Don&apos;t worry, our team has
          been notified and we&apos;re working to fix it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-mono text-gray-800 mb-2">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-sm font-mono text-gray-800 mb-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              <pre className="text-xs text-gray-600 overflow-auto">
                {error.stack}
              </pre>
            </div>
          </details>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please{" "}
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
