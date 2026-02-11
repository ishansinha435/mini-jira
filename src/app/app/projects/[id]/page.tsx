import { notFound } from "next/navigation";
import { Folder, Calendar } from "lucide-react";
import { getProjectById } from "@/app/actions/projects";
import { getTasks } from "@/app/actions/tasks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { TaskList } from "@/components/tasks/task-list";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  // If project not found or doesn't belong to user (RLS), show 404
  if (!project) {
    notFound();
  }

  // Fetch tasks for this project
  const tasks = await getTasks(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(project.created_at)}</span>
                </div>
              </div>
            </div>
            {/* New Task Button */}
            <NewTaskDialog projectId={id} />
          </div>
        </div>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Tasks</h2>
          </CardHeader>
          <CardContent>
            <TaskList projectId={id} initialTasks={tasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
