"use client";

import { useEffect, useState } from "react";

export default function HealthPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error("Failed to fetch health data");
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
    
    checkHealth();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">System Health</h1>
      
      <div className="bg-card border border-border rounded-lg p-6">
        {loading && <p className="text-muted-foreground">Checking health status...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {data && (
          <pre className="bg-muted p-4 rounded text-sm overflow-auto text-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
