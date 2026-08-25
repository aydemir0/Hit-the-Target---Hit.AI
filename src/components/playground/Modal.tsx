'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';

export interface ModalProps {
  triggerText: string;
  title: string;
  children: React.ReactNode;
}

export function Modal({ triggerText, title, children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Focus modal when it opens
      modalRef.current?.focus();
      // Prevent interaction with page behind
      document.body.style.overflow = 'hidden';
      wasOpen.current = true;
    } else {
      document.body.style.overflow = '';
      if (wasOpen.current && triggerRef.current) {
        // Return focus to the trigger element when modal closes
        triggerRef.current.focus();
        wasOpen.current = false;
      }
    }
    
    // Cleanup to ensure we don't leave body hidden if unmounted while open
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      e.stopPropagation();
      return;
    }

    if (e.key === 'Tab') {
      if (!modalRef.current) return;
      
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // If Shift+Tab on first element or modal wrapper itself, wrap to last
        if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // If Tab on last element, wrap to first
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        {triggerText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl focus:outline-none"
          >
            <h2 id="modal-title" className="text-xl font-bold mb-4">
              {title}
            </h2>
            <div className="mb-6">
              {children}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
