import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Folder } from "lucide-react";
import { getTaskById } from "@/app/actions/tasks";
import { getProjectById } from "@/app/actions/projects";
import { getComments, getCommentCount } from "@/app/actions/comments";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditableStatusBadge } from "@/components/tasks/editable-status-badge";
import { EditablePriorityBadge } from "@/components/tasks/editable-priority-badge";
import { CommentComposer } from "@/components/tasks/comment-composer";
import { CommentList } from "@/components/tasks/comment-list";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  // If task not found or doesn't belong to user (RLS), show 404
  if (!task) {
    notFound();
  }

  // Fetch related data
  const project = await getProjectById(task.project_id);
  const comments = await getComments(id);
  const commentCount = await getCommentCount(id);

  // Get user email for comment display
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Navigation */}
        <Link
          href={`/app/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {project.name}
        </Link>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {task.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                {task.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {task.description}
                    </p>
                  </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Status
                    </label>
                    <EditableStatusBadge
                      taskId={task.id}
                      currentStatus={task.status}
                      projectId={task.project_id}
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Priority
                    </label>
                    <EditablePriorityBadge
                      taskId={task.id}
                      currentPriority={task.priority}
                      projectId={task.project_id}
                    />
                  </div>

                  {/* Due Date */}
                  {task.due_date && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Due Date
                      </label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Project
                    </label>
                    <Link
                      href={`/app/projects/${project.id}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Folder className="w-4 h-4" />
                      <span>{project.name}</span>
                    </Link>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
                  <p>Created {formatDateTime(task.created_at)}</p>
                  {task.updated_at !== task.created_at && (
                    <p>Last updated {formatDateTime(task.updated_at)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Comments & Attachments */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="comments" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                    <TabsTrigger value="comments" className="rounded-none">
                      Comments ({commentCount})
                    </TabsTrigger>
                    <TabsTrigger value="attachments" className="rounded-none">
                      Attachments (0)
                    </TabsTrigger>
                  </TabsList>

                  {/* Comments Tab Content */}
                  <TabsContent value="comments" className="p-6 space-y-6">
                    {/* Comment Composer */}
                    <CommentComposer taskId={id} />

                    {/* Comments List */}
                    <CommentList
                      comments={comments}
                      userEmail={user?.email}
                    />
                  </TabsContent>

                  {/* Attachments Tab Content */}
                  <TabsContent value="attachments" className="p-6">
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">
                        Attachments coming in Milestone 5
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
