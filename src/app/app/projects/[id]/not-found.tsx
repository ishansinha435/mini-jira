import Link from "next/link";
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FolderX className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Project not found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          This project doesn't exist or you don't have permission to access it.
        </p>
        <Link href="/app">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
