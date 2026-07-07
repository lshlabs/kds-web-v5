import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { platformData } from '@/data/mock-data';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

// 활성 세그먼트를 약간 확대해서 보여주는 커스텀 activeShape
const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill,
  } = props;
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

// 비활성 세그먼트도 outline 없애기 위한 커스텀 shape
const renderNormalShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill,
  } = props;
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

export function PlatformStats() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalOrders = platformData.reduce((sum, p) => sum + p.orders, 0);
  const totalRevenue = platformData.reduce((sum, p) => sum + p.revenue, 0);
  const topPlatform = [...platformData].sort((a, b) => b.orders - a.orders)[0];

  const activePlatform = activeIndex !== null ? platformData[activeIndex] : null;

  return (
    <Card className="p-5 bg-card border-border/50">
      {/* 헤더 */}
      <div className="mb-5">
        <h3 className="text-base font-semibold">주문 유형</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          총 {totalOrders}건 · ₩{totalRevenue.toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* 좌: 도넛 차트 */}
        <div className="flex flex-col items-center justify-center md:w-56 flex-shrink-0">
          <div className="relative h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="orders"
                  strokeWidth={0}
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  shape={renderNormalShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={(_, index) =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                  style={{ outline: 'none', cursor: 'pointer' }}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* 중앙 텍스트: 활성 플랫폼이 있으면 해당 정보, 없으면 전체 요약 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              {activePlatform ? (
                <>
                  <span className="text-2xl font-bold leading-none">{activePlatform.orders}</span>
                  <span className="text-[11px] text-muted-foreground mt-1">
                    {((activePlatform.orders / totalOrders) * 100).toFixed(1)}%
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: activePlatform.color }}
                    />
                    <span className="text-[11px] text-muted-foreground truncate max-w-[80px] text-center">
                      {activePlatform.name}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold">{totalOrders}</span>
                  <span className="text-[11px] text-muted-foreground">전체 주문</span>
                  <div className="mt-1 flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: topPlatform.color }}
                    />
                    <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                      {topPlatform.name} 1위
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 색상 범례 */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            {platformData.map((item, index) => (
              <button
                key={item.name}
                className="flex items-center gap-1 focus:outline-none"
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
                  className="text-[10px] transition-colors duration-150"
                  style={{
                    color: activeIndex === index ? item.color : undefined,
                  }}
                >
                  {item.name}
                </span>
              </button>
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
              const idx = platformData.indexOf(platform);
              const isActive = activeIndex === idx;
              return (
                <div
                  key={platform.name}
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                >
                  {/* 플랫폼명 + 수치 헤더 */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-150"
                        style={{
                          backgroundColor: platform.color,
                          transform: isActive ? 'scale(1.4)' : 'scale(1)',
                        }}
                      />
                      <span
                        className="text-sm font-medium transition-colors duration-150"
                        style={{ color: isActive ? platform.color : undefined }}
                      >
                        {platform.name}
                      </span>
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
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: platform.color,
                        opacity: isActive ? 1 : 0.75,
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
