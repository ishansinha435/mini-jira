"use client";

import { useState, useMemo } from "react";
import { CheckSquare } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { TaskFilters } from "@/components/tasks/task-filters";
import type { Task, TaskStatus } from "@/types/database";

interface TaskListProps {
  projectId: string;
  initialTasks: Task[];
}

export function TaskList({ projectId, initialTasks }: TaskListProps) {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "all">("all");

  // Calculate counts for each filter
  const counts = useMemo(() => {
    return {
      all: initialTasks.length,
      todo: initialTasks.filter((t) => t.status === "todo").length,
      in_progress: initialTasks.filter((t) => t.status === "in_progress").length,
      done: initialTasks.filter((t) => t.status === "done").length,
    };
  }, [initialTasks]);

  // Filter tasks based on active filter
  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") {
      return initialTasks;
    }
    return initialTasks.filter((task) => task.status === activeFilter);
  }, [initialTasks, activeFilter]);

  if (initialTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first task for this project.
        </p>
        <NewTaskDialog projectId={projectId} />
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <TaskFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {activeFilter.replace("_", " ")} tasks
          </h3>
          <p className="text-gray-500">
            Try selecting a different filter or create a new task.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}
