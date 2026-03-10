import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </header>

      {/* KPI Section Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-3 w-24 bg-gray-100 rounded"></div>
              <div className="w-8 h-8 bg-gray-50 rounded-lg"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
            <div className="h-3 w-28 bg-gray-50 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Section Skeleton */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
             <div className="h-6 w-56 bg-gray-200 rounded-lg"></div>
          </div>
          
          <div className="space-y-8 pt-4">
            {[1, 2].map((row) => (
              <div key={row} className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-100 rounded"></div>
                <div className="flex-1 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex gap-2 p-2">
                   <div className="w-12 h-full bg-gray-200 rounded-lg ml-20"></div>
                   <div className="w-16 h-full bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full mt-4"></div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Next Match Card Skeleton */}
          <div className="bg-gray-100 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
            <div className="flex justify-between">
               <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
               <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-7 w-full bg-gray-200 rounded-lg"></div>
              <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="pt-4 flex justify-between items-end">
               <div className="space-y-2">
                 <div className="h-3 w-16 bg-gray-200 rounded"></div>
                 <div className="h-6 w-20 bg-gray-200 rounded"></div>
               </div>
               <div className="h-12 w-24 bg-gray-200 rounded-xl"></div>
            </div>
          </div>

          {/* Ranking Skeleton */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
             <div className="h-5 w-48 bg-gray-100 rounded-lg mb-6"></div>
             {[1, 2, 3].map((item) => (
               <div key={item} className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl"></div>
                 <div className="flex-1 space-y-2">
                   <div className="h-3 w-full bg-gray-100 rounded"></div>
                   <div className="h-2 w-2/3 bg-gray-50 rounded"></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}