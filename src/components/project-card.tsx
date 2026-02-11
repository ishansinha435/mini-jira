import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
  taskCount?: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export function ProjectCard({ project, taskCount = 0 }: ProjectCardProps) {
  const formattedDate = formatDate(project.created_at);

  return (
    <Link href={`/app/projects/${project.id}`}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
          <p className="text-sm text-gray-500">
            Created {formattedDate}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between text-sm text-gray-500">
          <span>{taskCount} tasks</span>
          <span>Last activity: {formattedDate}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
