"use client";

import React, { useState } from 'react';
import { JobApplication, JobStatus } from '../types';

interface JobApplicationListProps {
  applications: JobApplication[];
  onDelete: (id: string) => void;
}

const ALL_STATUSES: JobStatus[] = ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'];

export function JobApplicationList({ applications, onDelete }: JobApplicationListProps) {
  const [filter, setFilter] = useState<JobStatus | 'All'>('All');

  const filteredApplications = applications.filter(
    (app) => filter === 'All' || app.status === filter
  );

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'Saved': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Interview': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Offer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCount = (status: JobStatus | 'All') => {
    if (status === 'All') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Applications ({getStatusCount('All')})
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('All')}
            aria-pressed={filter === 'All'}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'All' 
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
          >
            All ({getStatusCount('All')})
          </button>
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {status} ({getStatusCount(status)})
            </button>
          ))}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            {filter === 'All' 
              ? "You haven't added any job applications yet."
              : `No applications with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <div 
              key={app.id} 
              className="bg-white dark:bg-zinc-900 p-5 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{app.jobTitle}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{app.companyName}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
              
              <div className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                Applied: {new Date(app.applicationDate).toLocaleDateString()}
              </div>

              {app.notes && (
                <div className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 p-3 rounded mb-4 flex-grow whitespace-pre-wrap">
                  {app.notes}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => onDelete(app.id)}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors focus:outline-none focus:underline"
                  aria-label={`Delete application for ${app.jobTitle} at ${app.companyName}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
