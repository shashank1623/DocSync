// SkeletonLoader.tsx

export const SkeltonLoader = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>
  );
};