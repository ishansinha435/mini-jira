import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";

// Mock project data
const projects = [
  {
    id: "1",
    name: "Personal",
    description: "Personal tasks and errands to keep life organized.",
    taskCount: 5,
    lastActivity: "Dec 1",
    color: "blue" as const,
  },
  {
    id: "2",
    name: "Interview Prep",
    description: "Coding challenges, system design practice, and behavioral prep.",
    taskCount: 4,
    lastActivity: "Jan 10",
    color: "blue" as const,
  },
  {
    id: "3",
    name: "Columbia Research",
    description: "Graduate research project on distributed systems performance.",
    taskCount: 3,
    lastActivity: "Jan 15",
    color: "blue" as const,
  },
  {
    id: "4",
    name: "Side Project",
    description: "Building a recipe sharing app with AI-powered recommendations.",
    taskCount: 6,
    lastActivity: "Jan 20",
    color: "red" as const,
  },
  {
    id: "5",
    name: "Freelance Work",
    description: "Client website redesign and e-commerce integration project.",
    taskCount: 2,
    lastActivity: "Feb 1",
    color: "blue" as const,
  },
];

export function ProjectsSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}
