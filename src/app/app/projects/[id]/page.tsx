import { notFound } from "next/navigation";
import { Folder, Calendar } from "lucide-react";
import { getProjectById } from "@/app/actions/projects";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
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
        </div>

        {/* Placeholder Content */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Tasks</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tasks coming in Milestone 3
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This is a placeholder page. Task creation, listing, and management
                will be implemented in the next milestone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
