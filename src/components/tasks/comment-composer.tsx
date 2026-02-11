"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/app/actions/comments";

interface CommentComposerProps {
  taskId: string;
}

export function CommentComposer({ taskId }: CommentComposerProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment(taskId, body);

      if (result.error) {
        toast.error("Failed to add comment", {
          description: result.error,
        });
        return;
      }

      toast.success("Comment added");
      setBody("");
      router.refresh();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = body.length;
  const maxChars = 5000;
  const isOverLimit = charCount > maxChars;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs ${
              isOverLimit ? "text-red-600 font-medium" : "text-gray-500"
            }`}
          >
            {charCount} / {maxChars} characters
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !body.trim() || isOverLimit}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding comment...
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Comment
          </>
        )}
      </Button>
    </form>
  );
}
