"use client";

import type { TaskStatus } from "@/types/database";

interface TaskFiltersProps {
  activeFilter: TaskStatus | "all";
  onFilterChange: (filter: TaskStatus | "all") => void;
  counts: {
    all: number;
    todo: number;
    in_progress: number;
    done: number;
  };
}

const filters = [
  { value: "all" as const, label: "All Tasks" },
  { value: "todo" as const, label: "Todo" },
  { value: "in_progress" as const, label: "In Progress" },
  { value: "done" as const, label: "Done" },
];

export function TaskFilters({
  activeFilter,
  onFilterChange,
  counts,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = counts[filter.value];

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            {filter.label}
            <span
              className={`ml-2 ${
                isActive ? "text-blue-100" : "text-gray-500"
              }`}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
