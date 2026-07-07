import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { kitchenStatus, processingTimeData } from '@/data/mock-data';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-2.5 shadow-lg">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{payload[0]?.value}건 ({payload[0]?.payload?.percentage}%)</p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 3}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ outline: 'none', cursor: 'pointer' }}
    />
  );
};

const renderNormalShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ outline: 'none' }}
    />
  );
};

export function KitchenStatus() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = kitchenStatus.reduce((sum, item) => sum + item.count, 0);
  const completedItem = kitchenStatus[0]; // 완료
  const activeItem = activeIndex !== null ? kitchenStatus[activeIndex] : null;

  return (
    <Card className="p-5 bg-card border-border/50 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-semibold">업무 현황</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          전체 {total}건 · 완료율 {((completedItem.count / total) * 100).toFixed(1)}%
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* 도넛 차트 */}
        <div className="flex flex-col items-center">
          <div className="h-[140px] w-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={kitchenStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="count"
                  strokeWidth={0}
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  shape={renderNormalShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={(_, index) => setActiveIndex(activeIndex === index ? null : index)}
                  style={{ outline: 'none', cursor: 'pointer' }}
                >
                  {kitchenStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* 중앙 텍스트 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              {activeItem ? (
                <>
                  <span className="text-xl font-bold leading-none">{activeItem.count}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {((activeItem.count / total) * 100).toFixed(1)}%
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: activeItem.color }}
                    />
                    <span className="text-[10px] text-muted-foreground">{activeItem.status}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xl font-bold">{completedItem.count}</span>
                  <span className="text-[10px] text-muted-foreground">완료</span>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: completedItem.color }} />
                    <span className="text-[10px] text-muted-foreground">
                      {((completedItem.count / total) * 100).toFixed(0)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 범례 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
            {kitchenStatus.map((item, index) => (
              <button
                key={item.status}
                className="flex items-center gap-1.5 focus:outline-none"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-150"
                  style={{
                    backgroundColor: item.color,
                    transform: activeIndex === index ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                <span
                  className="text-[11px] transition-colors duration-150"
                  style={{ color: activeIndex === index ? item.color : undefined }}
                >
                  {item.status}
                </span>
                <span className="text-[11px] font-semibold">{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 처리 시간 분포 */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">처리 시간 분포</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processingTimeData} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="range"
                  tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={false} />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(217, 91%, 60%)"
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
