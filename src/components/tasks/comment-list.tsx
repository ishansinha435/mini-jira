import { MessageSquare } from "lucide-react";
import { CommentCard } from "./comment-card";
import type { Comment } from "@/types/database";

interface CommentListProps {
  comments: Comment[];
  userEmail?: string;
}

export function CommentList({ comments, userEmail }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">
          No comments yet. Be the first to comment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          userEmail={userEmail}
        />
      ))}
    </div>
  );
}
