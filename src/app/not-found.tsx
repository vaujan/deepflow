"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
				<div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-6">
					<svg
						className="w-8 h-8 text-blue-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</div>

				<h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					Page Not Found
				</h2>
				<p className="text-gray-600 mb-8">
					Sorry, we couldn&apos;t find the page you&apos;re looking for. It
					might have been moved, deleted, or you entered the wrong URL.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/"
						className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Home className="w-5 h-5 mr-2" />
						Go Home
					</Link>
					<button
						onClick={() => window.history.back()}
						className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Go Back
					</button>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500">
						If you believe this is an error, please{" "}
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
