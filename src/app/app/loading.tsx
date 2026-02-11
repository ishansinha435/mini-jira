export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-9 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Projects Section Skeleton */}
        <div className="mb-12">
          <div className="h-7 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full mt-1"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
