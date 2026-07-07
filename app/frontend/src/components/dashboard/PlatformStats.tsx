import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Truck } from 'lucide-react';
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

  return (
    <Card className="p-5 bg-card border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-4 w-4 text-primary" />
        <div>
          <h3 className="text-base font-semibold">배달 플랫폼별 통계</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            총 {totalOrders}건 · ₩{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 주문 비중 도넛 차트 */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-muted-foreground mb-2 font-medium self-start">주문 비중</p>
          <div className="h-[150px] w-[150px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold">{totalOrders}</span>
              <span className="text-[10px] text-muted-foreground">전체</span>
            </div>
          </div>
          {/* 범례 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full">
            {platformData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-muted-foreground truncate">{item.name}</span>
                <span className="text-[11px] font-semibold ml-auto">
                  {((item.orders / totalOrders) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 플랫폼별 상세 리스트 */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">플랫폼별 실적</p>
          <div className="space-y-2">
            {platformData.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: platform.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{platform.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 h-4 ml-2 ${
                        platform.change >= 0
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {platform.change >= 0 ? (
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {Math.abs(platform.change)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">{platform.orders}건</span>
                    <span className="text-xs text-muted-foreground">₩{platform.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}