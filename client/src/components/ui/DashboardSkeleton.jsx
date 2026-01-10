import { Skeleton } from "./skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="bg-page-gradient min-h-full">
      <div className="w-full px-3 py-6 space-y-6">
        {/* Balance and Expenses Cards Skeleton - Exact match */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Balance Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-primary opacity-100"></div>
            <div className="relative p-6 flex flex-col h-full min-h-[140px]">
              <Skeleton className="h-[14px] w-28 bg-white/40 mb-1" />
              <Skeleton className="h-[30px] w-32 bg-white/50 mb-2" />
              <Skeleton className="h-[12px] w-24 bg-white/35 mt-auto" />
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-danger opacity-100"></div>
            <div className="relative p-6 flex flex-col h-full min-h-[140px]">
              <Skeleton className="h-[14px] w-28 bg-white/40 mb-1" />
              <Skeleton className="h-[30px] w-32 bg-white/50 mb-2" />
              <Skeleton className="h-[12px] w-20 bg-white/35 mt-auto" />
            </div>
          </div>
        </div>

        {/* Monthly Budget Skeleton - Exact match */}
        <div className="card-elevated rounded-2xl overflow-hidden bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <Skeleton className="h-[18px] w-36 mb-1" />
                <Skeleton className="h-[14px] w-44" />
              </div>
              <Skeleton className="h-[36px] w-[60px] rounded-lg" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </div>

        {/* 7-Day Spending Chart Skeleton - Exact match */}
        <div className="card-elevated rounded-2xl overflow-hidden bg-card">
          <div className="p-6 pb-2">
            <Skeleton className="h-[18px] w-36 mb-1" />
            <Skeleton className="h-[14px] w-52" />
          </div>
          <div className="px-2 pb-6">
            {/* Chart area with exact height */}
            <div className="h-[260px] flex items-end justify-between gap-1 px-4 pt-8 pb-2">
              {[40, 15, 25, 80, 35, 60, 45].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3"
                >
                  <Skeleton
                    className="w-full rounded-t-xl min-w-[30px]"
                    style={{ height: `${height}%` }}
                  />
                  <Skeleton className="h-[11px] w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown Skeleton - Exact match */}
        <div className="card-elevated rounded-2xl overflow-hidden bg-card">
          <div className="p-6 pb-2">
            <Skeleton className="h-[18px] w-44 mb-1" />
            <Skeleton className="h-[14px] w-40" />
          </div>
          <div className="px-2 pb-6">
            {/* Chart area with exact height */}
            <div className="h-[320px] flex flex-col items-center justify-center">
              {/* Donut Chart */}
              <div className="relative mb-4">
                <Skeleton className="w-[160px] h-[160px] rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[120px] h-[120px] rounded-full bg-card" />
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-[14px] w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories Skeleton - Exact match */}
        <div className="card-elevated rounded-2xl overflow-hidden bg-card">
          <div className="p-6 pb-4">
            <Skeleton className="h-[18px] w-32 mb-1" />
            <Skeleton className="h-[14px] w-48 mb-6" />
            <div className="space-y-5">
              {[
                { width: "100%" },
                { width: "45%" },
                { width: "30%" },
                { width: "20%" },
                { width: "15%" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Icon box - p-2.5 = 10px padding, icon size 20px = total ~45px */}
                      <Skeleton className="w-[45px] h-[45px] rounded-xl" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  {/* Progress bar - h-2.5 = 10px */}
                  <Skeleton
                    className="h-2.5 rounded-full"
                    style={{ width: item.width }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton - Exact match */}
        <div className="flex items-stretch gap-4">
          {/* py-4 px-6 = 16px top/bottom, 24px left/right */}
          <Skeleton className="flex-1 h-[56px] rounded-2xl" />
          <Skeleton className="flex-1 h-[56px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
