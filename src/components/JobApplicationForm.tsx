"use client";

import React, { useState } from 'react';
import { JobApplication, JobStatus } from '../types';

interface JobApplicationFormProps {
  onAdd: (app: Omit<JobApplication, 'id'>) => void;
}

const STATUS_OPTIONS: JobStatus[] = ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'];

export function JobApplicationForm({ onAdd }: JobApplicationFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState<JobStatus>('Saved');
  const [applicationDate, setApplicationDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!applicationDate) newErrors.applicationDate = 'Application date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        status,
        applicationDate,
        notes: notes.trim(),
      });
      
      // Reset form
      setCompanyName('');
      setJobTitle('');
      setStatus('Saved');
      setApplicationDate('');
      setNotes('');
      setErrors({});
    }
  };

  return (
    <form aria-labelledby="form-heading" onSubmit={handleSubmit} noValidate className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
      <h2 id="form-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Add Application</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Company Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            required
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={errors.companyName ? "companyName-error" : undefined}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            placeholder="e.g. Acme Corp"
          />
          {errors.companyName && (
            <p id="companyName-error" role="alert" className="text-sm text-red-500">
              {errors.companyName}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Job Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="jobTitle"
            type="text"
            required
            aria-invalid={Boolean(errors.jobTitle)}
            aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            placeholder="e.g. Frontend Engineer"
          />
          {errors.jobTitle && (
            <p id="jobTitle-error" role="alert" className="text-sm text-red-500">
              {errors.jobTitle}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="applicationDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Application Date <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="applicationDate"
            type="date"
            required
            aria-invalid={Boolean(errors.applicationDate)}
            aria-describedby={errors.applicationDate ? "applicationDate-error" : undefined}
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
          />
          {errors.applicationDate && (
            <p id="applicationDate-error" role="alert" className="text-sm text-red-500">
              {errors.applicationDate}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
          placeholder="Optional notes about the application..."
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        Add Application
      </button>
    </form>
  );
}
