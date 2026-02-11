"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/auth";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const result = await logout();
      
      if (result.error) {
        toast.error("Failed to log out", {
          description: result.error,
        });
      } else if (result.success) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out", {
        description: "Please try again",
      });
      // Fallback redirect
      router.push("/login");
    }
  }

  return (
    <DropdownMenuItem 
      className="text-red-600 cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign out
    </DropdownMenuItem>
  );
}
