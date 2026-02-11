import { ProjectsSection } from "@/components/projects-section";
import { RecentActivity } from "@/components/recent-activity";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Alex
          </h1>
          <p className="text-gray-600">
            Here is an overview of your projects and recent activity.
          </p>
        </div>

        {/* Projects Section */}
        <ProjectsSection />

        {/* Recent Activity Section */}
        <div className="mt-12">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
