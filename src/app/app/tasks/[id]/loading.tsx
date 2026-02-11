import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Navigation Skeleton */}
        <div className="h-5 w-48 bg-gray-200 rounded mb-6 animate-pulse" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                {/* Title Skeleton */}
                <div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Metadata Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="border-b p-1">
                  <div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
