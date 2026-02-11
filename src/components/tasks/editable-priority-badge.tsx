"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowRight, ArrowDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { updateTaskPriority } from "@/app/actions/tasks";
import type { TaskPriority } from "@/types/database";

interface EditablePriorityBadgeProps {
  taskId: string;
  currentPriority: TaskPriority;
  projectId: string;
}

const priorityConfig = {
  1: {
    label: "Low",
    icon: ArrowDown,
    className: "text-gray-500",
  },
  2: {
    label: "Medium",
    icon: ArrowRight,
    className: "text-blue-600",
  },
  3: {
    label: "High",
    icon: ArrowUp,
    className: "text-red-600",
  },
};

const priorityOptions: TaskPriority[] = [1, 2, 3];

export function EditablePriorityBadge({
  taskId,
  currentPriority,
  projectId,
}: EditablePriorityBadgeProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticPriority, setOptimisticPriority] = useState(currentPriority);

  const config = priorityConfig[optimisticPriority];
  const Icon = config.icon;

  async function handlePriorityChange(newPriority: TaskPriority) {
    if (newPriority === currentPriority) return;

    // Optimistic update
    setOptimisticPriority(newPriority);
    setIsUpdating(true);

    try {
      const result = await updateTaskPriority(taskId, newPriority);

      if (result.error) {
        // Revert on error
        setOptimisticPriority(currentPriority);
        toast.error("Failed to update priority", {
          description: result.error,
        });
      } else {
        toast.success("Priority updated", {
          description: `Priority changed to ${priorityConfig[newPriority].label}`,
        });
        router.refresh();
      }
    } catch (error) {
      // Revert on error
      setOptimisticPriority(currentPriority);
      console.error("Priority update error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={isUpdating}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
          <Icon className={`w-4 h-4 ${config.className}`} />
          <span className={`text-sm font-medium ${config.className}`}>
            {config.label}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {priorityOptions.map((priority) => {
          const PriorityIcon = priorityConfig[priority].icon;
          return (
            <DropdownMenuItem
              key={priority}
              onClick={() => handlePriorityChange(priority)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <PriorityIcon
                  className={`w-4 h-4 ${priorityConfig[priority].className}`}
                />
                <span>{priorityConfig[priority].label}</span>
              </div>
              {optimisticPriority === priority && (
                <Check className="w-4 h-4 ml-2" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
