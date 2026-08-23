"use client";

import { useState } from "react";

export function AnalysisSettingsForm() {
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Junior");
  const [outputLanguage, setOutputLanguage] = useState("English");
  const [strictMatching, setStrictMatching] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    const trimmedRole = targetRole.trim();
    if (trimmedRole.length < 2 || trimmedRole.length > 80) {
      setError("Target role must be between 2 and 80 characters.");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-black rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Analysis Settings</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label htmlFor="target-role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Target role <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="target-role"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            required
            aria-invalid={!!error}
            aria-describedby={error ? "target-role-error" : undefined}
            className="block w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Junior Full-Stack Software Engineer"
          />
          {error && (
            <p id="target-role-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="experience-level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Experience level
          </label>
          <select
            id="experience-level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="block w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label htmlFor="output-language" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Output language
          </label>
          <select
            id="output-language"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
            className="block w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="English">English</option>
            <option value="Turkish">Turkish</option>
          </select>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="strict-matching"
              type="checkbox"
              checked={strictMatching}
              onChange={(e) => setStrictMatching(e.target.checked)}
              aria-describedby="strict-matching-help"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="strict-matching" className="font-semibold text-gray-700 dark:text-gray-300">
              Strict matching
            </label>
            <p id="strict-matching-help" className="text-gray-500 dark:text-gray-400 mt-1">
              Enabling this makes the future analysis prioritize closer keyword/requirement matches.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold rounded-lg p-3 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          Save Settings
        </button>

        {success && (
          <p className="text-green-600 dark:text-green-400 text-sm mt-4 font-medium" role="status">
            Settings saved for this session.
          </p>
        )}
      </form>
    </div>
  );
}

