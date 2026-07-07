import { Card } from '@/components/ui/card';
import { hourlyOrders } from '@/data/mock-data';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(217,91%,60%)]" />
            <span className="text-xs text-muted-foreground">오늘:</span>
            <span className="text-xs font-semibold text-foreground">{payload[0]?.value}건</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">7일평균:</span>
            <span className="text-xs font-semibold text-foreground">{payload[1]?.value}건</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function OrderFlowChart() {
  const peakHour = hourlyOrders.reduce((max, item) =>
    item.today > max.today ? item : max
  );

  return (
    <Card className="p-5 bg-card border-border/50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">시간대별 주문 흐름</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            오늘 vs 7일평균 · 피크: {peakHour.hour} ({peakHour.today}건)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-[hsl(217,91%,60%)]" />
            <span className="text-xs text-muted-foreground">오늘</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">7일평균</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyOrders} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(220, 15%, 88%)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={peakHour.hour}
              stroke="hsl(25, 95%, 53%)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="avg7day"
              stroke="hsl(220, 10%, 70%)"
              strokeWidth={1.5}
              fill="transparent"
              strokeDasharray="4 4"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="today"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2.5}
              fill="url(#todayGradient)"
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(217, 91%, 60%)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
