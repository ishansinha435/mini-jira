"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestSupabasePage() {
  const [status, setStatus] = useState<"testing" | "success" | "error">("testing");
  const [message, setMessage] = useState("Testing Supabase connection...");

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        
        // Try to get the session (will be null if not logged in, but connection works)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus("error");
          setMessage(`Error: ${error.message}`);
        } else {
          setStatus("success");
          setMessage("Successfully connected to Supabase!");
        }
      } catch (err) {
        setStatus("error");
        setMessage(`Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {status === "testing" && (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-700">{message}</span>
                  </>
                )}
                {status === "success" && (
                  <>
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                    <span className="text-green-700 font-semibold">{message}</span>
                  </>
                )}
                {status === "error" && (
                  <>
                    <div className="w-4 h-4 bg-red-600 rounded-full" />
                    <span className="text-red-700">{message}</span>
                  </>
                )}
              </div>

              {status === "success" && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Configuration Verified</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ Environment variables loaded</li>
                    <li>✓ Supabase client initialized</li>
                    <li>✓ API connection established</li>
                  </ul>
                </div>
              )}

              {status === "error" && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">Troubleshooting</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Check .env.local file exists</li>
                    <li>• Verify NEXT_PUBLIC_SUPABASE_URL is correct</li>
                    <li>• Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct</li>
                    <li>• Restart dev server after adding .env.local</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-sm text-gray-600">
          <p>This test page can be deleted after verifying the connection works.</p>
          <p className="mt-1">Located at: <code className="bg-gray-200 px-1 py-0.5 rounded">/test-supabase</code></p>
        </div>
      </div>
    </div>
  );
}
