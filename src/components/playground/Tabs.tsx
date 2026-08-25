'use client';
import { useState, useRef, KeyboardEvent } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  ariaLabel: string;
}

export function Tabs({ tabs, ariaLabel }: TabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [rovingId, setRovingId] = useState(tabs[0]?.id);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // If focus is leaving the tablist completely, reset the roving tabindex to the active tab
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setRovingId(activeId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextId = tabs[nextIndex].id;
      setRovingId(nextId);
      tabRefs.current.get(nextId)?.focus();
    }
  };

  return (
    <div className="mb-4">
      <div 
        role="tablist" 
        aria-label={ariaLabel} 
        className="flex border-b border-gray-300"
        onBlur={handleBlur}
      >
        {tabs.map((tab, index) => {
          const isSelected = activeId === tab.id;
          const tabIndex = rovingId === tab.id ? 0 : -1;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={tabIndex}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              onClick={() => {
                setActiveId(tab.id);
                setRovingId(tab.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-2 border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:z-10 ${
                isSelected ? 'border-blue-600 font-bold text-blue-800' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => {
        const isSelected = activeId === tab.id;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isSelected}
            tabIndex={0}
            className={`p-4 border border-t-0 border-gray-300 rounded-b focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${!isSelected ? 'hidden' : ''}`}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
