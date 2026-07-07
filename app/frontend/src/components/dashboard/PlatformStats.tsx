import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { platformData } from '@/data/mock-data';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-2.5 shadow-lg">
        <p className="text-xs font-medium text-foreground">{data.name}</p>
        <p className="text-xs text-muted-foreground">{data.orders}건 · ₩{data.revenue.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function PlatformStats() {
  const totalOrders = platformData.reduce((sum, p) => sum + p.orders, 0);
  const totalRevenue = platformData.reduce((sum, p) => sum + p.revenue, 0);
  const topPlatform = [...platformData].sort((a, b) => b.orders - a.orders)[0];

  return (
    <Card className="p-5 bg-card border-border/50">
      {/* 헤더 */}
      <div className="mb-5">
        <h3 className="text-base font-semibold">배달 플랫폼별 통계</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          총 {totalOrders}건 · ₩{totalRevenue.toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* 좌: 도넛 차트 */}
        <div className="flex flex-col items-center justify-center md:w-56 flex-shrink-0">
          <div className="relative h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="orders"
                  strokeWidth={0}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{totalOrders}</span>
              <span className="text-[11px] text-muted-foreground">전체 주문</span>
              <div className="mt-1 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: topPlatform.color }} />
                <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{topPlatform.name} 1위</span>
              </div>
            </div>
          </div>

          {/* 색상 범례 - 도넛 차트 아래 compact하게 */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            {platformData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우: 플랫폼별 바 목록 */}
        <div className="flex-1 space-y-3">
          {platformData
            .slice()
            .sort((a, b) => b.orders - a.orders)
            .map((platform) => {
              const pct = (platform.orders / totalOrders) * 100;
              return (
                <div key={platform.name} className="group">
                  {/* 플랫폼명 + 수치 헤더 */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        ₩{platform.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold tabular-nums">{platform.orders}건</span>
                      <div
                        className={`flex items-center gap-0.5 text-[11px] font-medium w-12 justify-end ${
                          platform.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {platform.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="h-3 w-3 flex-shrink-0" />
                        )}
                        {Math.abs(platform.change)}%
                      </div>
                    </div>
                  </div>

                  {/* 프로그레스 바 */}
                  <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: platform.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 text-right">
                    {pct.toFixed(1)}%
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
}
