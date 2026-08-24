"use client";

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { JobApplication } from '../types';
import { JobApplicationForm } from './JobApplicationForm';
import { JobApplicationList } from './JobApplicationList';

const STORAGE_KEY = 'hitai_job_applications';

const emptySubscribe = () => () => {};

function readStoredApplications(): JobApplication[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as JobApplication[]) : [];
  } catch {
    return [];
  }
}

export function JobApplicationTracker() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [applications, setApplications] =
    useState<JobApplication[]>(readStoredApplications);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(applications)
    );
  }, [applications, isClient]);

  const handleAddApplication = (newApp: Omit<JobApplication, 'id'>) => {
    const application: JobApplication = {
      ...newApp,
      id: crypto.randomUUID(),
    };
    setApplications((prev) => [application, ...prev]);
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    }
  };

  // Avoid hydration mismatch by not rendering until loaded
  if (!isClient) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-6"></div>
        <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-8"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Job Application Tracker</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Keep track of your job search progress.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <JobApplicationForm onAdd={handleAddApplication} />
        </div>
        <div className="xl:col-span-2">
          <JobApplicationList 
            applications={applications} 
            onDelete={handleDeleteApplication} 
          />
        </div>
      </div>
    </div>
  );
}
