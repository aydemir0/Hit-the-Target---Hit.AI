'use client';

import { useState } from 'react';
import { prioritizeJobPosting } from './actions';
import { PrioritizationResult } from '@/lib/ai/prioritize-schema';

export default function PrioritizePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<PrioritizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Job description is required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await prioritizeJobPosting(jobDescription);
      setResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred.');
      } else {
        setError('An error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Apply': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maybe': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Skip': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Job Application Prioritizer</h1>
        <p className="text-muted-foreground text-lg">
          Paste a job posting and Hit.AI will compare it with the saved candidate profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          placeholder="Paste job posting here..."
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            if (error) setError(null);
          }}
          disabled={isLoading}
        />
        
        {error && (
          <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-md">
            <p>{error}</p>
            <button 
              type="button"
              onClick={handleSubmit}
              className="mt-2 text-sm font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !jobDescription.trim()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Analyzing...' : 'Analyze opportunity'}
        </button>
      </form>

      {result && (
        <div className="border rounded-xl shadow-sm overflow-hidden bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`px-6 py-4 border-b ${getRecommendationColor(result.recommendation)} flex items-center justify-between`}>
            <h2 className="text-2xl font-bold">
              Recommendation: {result.recommendation}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Why</h3>
              <p className="text-card-foreground leading-relaxed">
                {result.reason}
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Confirmed matches</h3>
                {result.confirmedMatches.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {result.confirmedMatches.map((match, i) => (
                      <li key={i} className="text-card-foreground">{match}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">None identified</p>
                )}
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Gaps / unknowns</h3>
                {result.gapsOrUnknowns.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {result.gapsOrUnknowns.map((gap, i) => (
                      <li key={i} className="text-card-foreground">{gap}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">None identified</p>
                )}
              </section>
            </div>

            {result.nextActions.length > 0 && (
              <section className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Before applying</h3>
                <ul className="list-decimal pl-5 space-y-1">
                  {result.nextActions.map((action, i) => (
                    <li key={i} className="text-card-foreground">{action}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
