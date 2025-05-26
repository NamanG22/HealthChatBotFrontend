"use client";

import React from 'react';
import Link from 'next/link';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-volcanic-800 mb-4">
            Welcome to HealthChat Bot
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your AI-powered healthcare assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/soap" 
            className="bg-volcanic-800 text-white rounded-lg p-6 hover:bg-volcanic-900 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">SOAP Notes</h2>
            <p className="text-sm opacity-90">
              Record and transcribe patient conversations
            </p>
          </Link>

          <Link 
            href="/chat" 
            className="bg-volcanic-800 text-white rounded-lg p-6 hover:bg-volcanic-900 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Chat Assistant</h2>
            <p className="text-sm opacity-90">
              Get instant healthcare assistance
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
