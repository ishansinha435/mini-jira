import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import type { TaskPriority } from "@/types/database";

interface PriorityBadgeProps {
  priority: TaskPriority;
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

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-4 h-4 ${config.className}`} />
      <span className={`text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    </div>
  );
}
