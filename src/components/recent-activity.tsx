import Link from "next/link";
import { CheckCircle2, MessageSquare, Upload, FolderPlus, Activity as ActivityIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentActivity } from "@/app/actions/activity";
import type { ActivityType } from "@/types/database";

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "task_completed":
      return (
        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        </div>
      );
    case "comment_added":
      return (
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
      );
    case "attachment_uploaded":
      return (
        <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
          <Upload className="w-4 h-4 text-purple-600" />
        </div>
      );
    case "project_created":
      return (
        <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
          <FolderPlus className="w-4 h-4 text-indigo-600" />
        </div>
      );
    case "task_created":
      return (
        <div className="w-8 h-8 bg-sky-50 rounded-full flex items-center justify-center flex-shrink-0">
          <ActivityIcon className="w-4 h-4 text-sky-600" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
          <ActivityIcon className="w-4 h-4 text-gray-600" />
        </div>
      );
  }
}

function getActivityMessage(activity: any) {
  const taskTitle = activity.metadata?.task_title;
  const projectName = activity.metadata?.project_name;
  const filename = activity.metadata?.filename;

  switch (activity.type) {
    case "task_created":
      return (
        <>
          You created <span className="font-semibold">{taskTitle}</span>
        </>
      );
    case "task_completed":
      return (
        <>
          You completed <span className="font-semibold">{taskTitle}</span>
        </>
      );
    case "comment_added":
      return (
        <>
          You commented on <span className="font-semibold">{taskTitle}</span>
        </>
      );
    case "attachment_uploaded":
      return (
        <>
          You uploaded <span className="font-semibold">{filename}</span> to {taskTitle}
        </>
      );
    case "project_created":
      return (
        <>
          You created project <span className="font-semibold">{projectName}</span>
        </>
      );
    default:
      return "Activity recorded";
  }
}

export async function RecentActivity() {
  const activities = await getRecentActivity(10);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Activity</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-700">Your activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity: any) => {
              const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
                addSuffix: true,
              });

              const projectName = activity.project?.name;
              const taskId = activity.task_id;

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {getActivityMessage(activity)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      {projectName && <span>{projectName}</span>}
                      {projectName && <span>·</span>}
                      <span>{timeAgo}</span>
                      {taskId && (
                        <>
                          <span>·</span>
                          <Link
                            href={`/app/tasks/${taskId}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View task
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-8">
              No recent activity. Start by creating a project or task!
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
