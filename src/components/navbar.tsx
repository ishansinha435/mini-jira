import Link from "next/link";
import { LayoutDashboard, ChevronDown, User, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";
import { getProjects } from "@/app/actions/projects";

function getInitials(email: string): string {
  // Get traditional initials from email (first letter of each part, capitalized)
  const username = email.split("@")[0];
  const parts = username.split(/[._-]/);
  
  if (parts.length >= 2) {
    // Multiple parts: first letter of first part + first letter of second part
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  } else {
    // Single part: first 2 characters
    return username.slice(0, 2).toUpperCase();
  }
}

function getDisplayName(email: string): string {
  // Convert email to display name, preserving original casing
  const username = email.split("@")[0];
  const parts = username.split(/[._-]/);
  return parts.join(" ");
}

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const projects = await getProjects();

  const userEmail = user?.email || "";
  const displayName = userEmail ? getDisplayName(userEmail) : "User";
  const initials = userEmail ? getInitials(userEmail) : "U";

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        {/* Left: Logo and Brand */}
        <Link href="/app" className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Mini JIRA</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-6 flex-1">
          <Link
            href="/app"
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Projects Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 px-2">
                Projects
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <DropdownMenuItem key={project.id} asChild>
                    <Link href={`/app/projects/${project.id}`} className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-gray-500" />
                      <span>{project.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  <span className="text-gray-500 text-sm">No projects yet</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app" className="text-blue-600">
                  View all projects
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{displayName}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled className="text-xs text-gray-500">
              {userEmail}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
