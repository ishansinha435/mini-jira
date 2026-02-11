"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateTaskStatus } from "@/app/actions/tasks";
import type { TaskStatus } from "@/types/database";

interface EditableStatusBadgeProps {
  taskId: string;
  currentStatus: TaskStatus;
  projectId: string;
}

const statusConfig = {
  todo: {
    label: "Todo",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
  in_progress: {
    label: "In Progress",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  done: {
    label: "Done",
    variant: "default" as const,
    className: "bg-green-100 text-green-700 hover:bg-green-200",
  },
};

const statusOptions: TaskStatus[] = ["todo", "in_progress", "done"];

export function EditableStatusBadge({
  taskId,
  currentStatus,
  projectId,
}: EditableStatusBadgeProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const config = statusConfig[optimisticStatus];

  async function handleStatusChange(newStatus: TaskStatus) {
    if (newStatus === currentStatus) return;

    // Optimistic update
    setOptimisticStatus(newStatus);
    setIsUpdating(true);

    try {
      const result = await updateTaskStatus(taskId, newStatus);

      if (result.error) {
        // Revert on error
        setOptimisticStatus(currentStatus);
        toast.error("Failed to update status", {
          description: result.error,
        });
      } else {
        toast.success("Status updated", {
          description: `Task moved to ${statusConfig[newStatus].label}`,
        });
        router.refresh();
      }
    } catch (error) {
      // Revert on error
      setOptimisticStatus(currentStatus);
      console.error("Status update error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Badge
          variant={config.variant}
          className={`${config.className} cursor-pointer transition-colors`}
        >
          {config.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className="flex items-center justify-between"
          >
            <span>{statusConfig[status].label}</span>
            {optimisticStatus === status && (
              <Check className="w-4 h-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
