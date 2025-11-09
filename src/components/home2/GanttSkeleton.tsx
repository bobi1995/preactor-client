import React from "react";

interface GanttSkeletonProps {
  rowCount?: number;
}

const GanttSkeleton: React.FC<GanttSkeletonProps> = ({ rowCount = 5 }) => {
  return (
    <div className="flex h-full">
      {/* Left Panel Skeleton */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="h-16 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-4">
          <div className="h-6 w-24 bg-white/30 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rowCount }).map((_, idx) => (
            <div key={idx} className="h-16 px-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-300 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel Skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="h-16 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600" />
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rowCount }).map((_, idx) => (
            <div key={idx} className="h-16 px-4 flex items-center gap-2">
              <div className="h-8 w-1/4 bg-indigo-200 rounded animate-pulse" />
              <div className="h-8 w-1/3 bg-purple-200 rounded animate-pulse" />
              <div className="h-8 w-1/5 bg-indigo-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttSkeleton;
