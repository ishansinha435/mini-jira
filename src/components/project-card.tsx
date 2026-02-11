import { Folder, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ProjectCardProps {
  name: string;
  description: string;
  taskCount: number;
  lastActivity: string;
  color?: "blue" | "red";
}

export function ProjectCard({
  name,
  description,
  taskCount,
  lastActivity,
  color = "blue",
}: ProjectCardProps) {
  const iconColor = color === "red" ? "text-red-600" : "text-blue-600";
  const iconBgColor = color === "red" ? "bg-red-50" : "bg-blue-50";

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <Folder className={`w-5 h-5 ${iconColor}`} />
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between text-sm text-gray-500">
        <span>{taskCount} tasks</span>
        <span>{lastActivity}</span>
      </CardFooter>
    </Card>
  );
}
