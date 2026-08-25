'use client';
import { useState, useId } from 'react';

export interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export function Disclosure({ title, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-100 text-blue-900 rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {title}
      </button>
      <div
        id={contentId}
        hidden={!isOpen}
        className={`mt-4 ${isOpen ? 'block' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  );
}
