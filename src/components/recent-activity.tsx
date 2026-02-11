import { CheckCircle2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock activity data
const activities = [
  {
    id: "1",
    type: "completed",
    action: "You completed",
    target: "Design recipe card component",
    project: "Side Project",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "commented",
    action: "You commented on",
    target: "LeetCode daily challenge x30",
    project: "Interview Prep",
    time: "5 hours ago",
  },
];

export function RecentActivity() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Activity</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-700">Your activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              {activity.type === "completed" ? (
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.action}{" "}
                  <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.project} · {activity.time}
                </p>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No recent activity. Start by creating a task!
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
