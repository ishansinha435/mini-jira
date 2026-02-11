import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Comment } from "@/types/database";

interface CommentCardProps {
  comment: Comment;
  userEmail?: string;
}

export function CommentCard({ comment, userEmail }: CommentCardProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Author and Time */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="font-medium">
                {userEmail || "User"}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{timeAgo}</span>
          </div>

          {/* Comment Body */}
          <p className="text-gray-900 whitespace-pre-wrap break-words">
            {comment.body}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
