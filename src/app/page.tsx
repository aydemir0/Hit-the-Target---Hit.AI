"use client";

import { useState } from "react";

export default function Home() {
  const [linkedInProfile, setLinkedInProfile] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { linkedInProfile, jobDescription, cvFile });
    // TODO: Implement API call
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Hit.AI</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your AI-powered career assistant. Let&apos;s tailor your profile to your dream job.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3 dark:border-zinc-700">
              Analysis Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile Summary / Information
                </label>
                <textarea
                  id="linkedin"
                  name="linkedin"
                  rows={4}
                  className="block w-full rounded-lg border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 border transition-colors"
                  placeholder="Paste your LinkedIn 'About' section or profile details here..."
                  value={linkedInProfile}
                  onChange={(e) => setLinkedInProfile(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="cv" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Upload CV (PDF or Word)
                </label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-blue-900/30 dark:file:text-blue-400
                    cursor-pointer border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 transition-colors"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Target Job Description
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={6}
                  className="block w-full rounded-lg border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 border transition-colors"
                  placeholder="Paste the description of the job you want to apply for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Analyze & Generate Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
