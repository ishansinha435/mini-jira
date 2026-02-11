import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types/database";

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig = {
  todo: {
    label: "Todo",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  in_progress: {
    label: "In Progress",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  done: {
    label: "Done",
    variant: "default" as const,
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
