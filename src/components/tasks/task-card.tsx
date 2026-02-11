import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EditableStatusBadge } from "@/components/tasks/editable-status-badge";
import { EditablePriorityBadge } from "@/components/tasks/editable-priority-badge";
import type { Task } from "@/types/database";

interface TaskCardProps {
  task: Task;
  projectId: string;
}

function formatDueDate(dateString: string | null): string | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Format the date
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Check if overdue
  if (diffDays < 0) {
    return `${formatted} (Overdue)`;
  } else if (diffDays === 0) {
    return `${formatted} (Today)`;
  } else if (diffDays === 1) {
    return `${formatted} (Tomorrow)`;
  } else {
    return formatted;
  }
}

export function TaskCard({ task, projectId }: TaskCardProps) {
  const dueDateDisplay = formatDueDate(task.due_date);
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <Link href={`/app/tasks/${task.id}`}>
      <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and Status */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900 flex-1 hover:text-blue-600 transition-colors">
                {task.title}
              </h3>
              <div onClick={(e) => e.preventDefault()}>
                <EditableStatusBadge
                  taskId={task.id}
                  currentStatus={task.status}
                  projectId={projectId}
                />
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Priority and Due Date */}
            <div className="flex items-center justify-between text-sm">
              <div onClick={(e) => e.preventDefault()}>
                <EditablePriorityBadge
                  taskId={task.id}
                  currentPriority={task.priority}
                  projectId={projectId}
                />
              </div>
              
              {dueDateDisplay && (
                <div className={`flex items-center gap-1.5 ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                  <Calendar className="w-4 h-4" />
                  <span className={isOverdue ? "font-medium" : ""}>
                    {dueDateDisplay}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
