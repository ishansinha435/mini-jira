"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Image, File, Download, Trash2, Loader2, Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteAttachment,
  getAttachmentUrl,
} from "@/app/actions/attachments";
import { formatFileSize } from "@/lib/format-utils";
import type { Attachment } from "@/types/database";

interface AttachmentListProps {
  attachments: Attachment[];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return <Image className="w-5 h-5 text-blue-500" />;
  } else if (mimeType === "application/pdf") {
    return <FileText className="w-5 h-5 text-red-500" />;
  } else {
    return <File className="w-5 h-5 text-gray-500" />;
  }
}

function AttachmentItem({ attachment }: { attachment: Attachment }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(attachment.created_at), {
    addSuffix: true,
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const url = await getAttachmentUrl(attachment.path);
      if (!url) {
        toast.error("Failed to generate download link");
        return;
      }

      // Open in new tab or trigger download
      window.open(url, "_blank");
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${attachment.filename}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAttachment(attachment.id);

      if (result.error) {
        toast.error("Delete failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(attachment.mime_type)}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {attachment.filename}
            </p>
            <p className="text-sm text-gray-500">
              {formatFileSize(attachment.file_size)} • {timeAgo}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || isDeleting}
              variant="outline"
              size="sm"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDownloading || isDeleting}
              variant="outline"
              size="sm"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Paperclip className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No attachments yet</p>
        <p className="text-gray-400 text-xs mt-1">
          Upload files using the button above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <AttachmentItem key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
}
