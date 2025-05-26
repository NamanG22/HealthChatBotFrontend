"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-bold text-volcanic-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link 
            href="/" 
            className="bg-volcanic-800 text-white px-6 py-3 rounded-lg hover:bg-volcanic-900 transition-colors inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 