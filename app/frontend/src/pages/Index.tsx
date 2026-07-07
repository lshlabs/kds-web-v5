import { KpiCards } from '@/components/dashboard/KpiCards';
import { OrderFlowChart } from '@/components/dashboard/OrderFlowChart';
import { KitchenStatus } from '@/components/dashboard/KitchenStatus';
import { MenuPerformance } from '@/components/dashboard/MenuPerformance';
import { OperationInsights } from '@/components/dashboard/OperationInsights';
import { PlatformStats } from '@/components/dashboard/PlatformStats';
import { CalendarDays, Store } from 'lucide-react';

export default function Index() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[today.getDay()];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">매장 통계</h1>
              <p className="text-xs text-muted-foreground">오늘의 운영 현황을 한눈에</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{dateStr} ({dayStr})</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* KPI 카드 */}
        <section>
          <KpiCards />
        </section>

        {/* 차트 영역 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <OrderFlowChart />
          </div>
          <div>
            <KitchenStatus />
          </div>
        </section>

        {/* 배달 플랫폼별 통계 */}
        <section>
          <PlatformStats />
        </section>

        {/* 하단 영역 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MenuPerformance />
          <OperationInsights />
        </section>
      </main>
    </div>
  );
}