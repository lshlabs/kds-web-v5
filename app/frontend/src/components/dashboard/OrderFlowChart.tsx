import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { hourlyOrders } from '@/data/mock-data';
import { SlidersHorizontal, Check, X } from 'lucide-react';
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

type CompareMode = 'yesterday' | 'avg3day' | 'avg7day';

type TimeRange = 'all' | 'lunch' | 'dinner' | 'night';

const compareModes: { key: CompareMode; label: string }[] = [
  { key: 'yesterday', label: '어제' },
  { key: 'avg3day',   label: '3일 평균' },
  { key: 'avg7day',   label: '7일 평균' },
];

const timeRanges: { key: TimeRange; label: string; hours: string[] }[] = [
  { key: 'all',    label: '전체',   hours: [] },
  { key: 'lunch',  label: '점심',   hours: ['10시','11시','12시','13시','14시'] },
  { key: 'dinner', label: '저녁',   hours: ['17시','18시','19시','20시','21시'] },
  { key: 'night',  label: '야간',   hours: ['20시','21시'] },
];

const CustomTooltip = ({ active, payload, label, compareLabel }: any) => {
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
            <span className="text-xs text-muted-foreground">{compareLabel}:</span>
            <span className="text-xs font-semibold text-foreground">{payload[1]?.value}건</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function OrderFlowChart() {
  const [compareMode, setCompareMode] = useState<CompareMode>('avg7day');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modalOpen]);

  const currentLabel = compareModes.find((m) => m.key === compareMode)!.label;
  const currentRange = timeRanges.find((r) => r.key === timeRange)!;

  const filteredData =
    timeRange === 'all'
      ? hourlyOrders
      : hourlyOrders.filter((d) => currentRange.hours.includes(d.hour));

  const peakHour = hourlyOrders.reduce((max, item) =>
    item.today > max.today ? item : max
  );

  return (
    <Card className="p-5 bg-card border-border/50 h-full flex flex-col relative">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">시간대별 주문 흐름</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            오늘 vs {currentLabel}
            {timeRange !== 'all' && ` · ${currentRange.label} 시간대`}
            {' '}· 피크: {peakHour.hour} ({peakHour.today}건)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 범례 */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded-full bg-[hsl(217,91%,60%)]" />
              <span className="text-xs text-muted-foreground">오늘</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded-full bg-muted-foreground/40" />
              <span className="text-xs text-muted-foreground">{currentLabel}</span>
            </div>
          </div>

          {/* 설정 아이콘 버튼 */}
          <div className="relative">
            <button
              ref={btnRef}
              type="button"
              onClick={() => setModalOpen((v) => !v)}
              className={[
                'flex items-center justify-center w-8 h-8 rounded-lg border transition-colors',
                modalOpen
                  ? 'bg-foreground/10 border-border text-foreground'
                  : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50',
              ].join(' ')}
              aria-label="차트 설정"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* 설정 모달 드롭다운 */}
            {modalOpen && (
              <div
                ref={modalRef}
                className="absolute right-0 top-10 z-50 w-56 bg-card border border-border rounded-xl shadow-xl p-4 space-y-4"
              >
                {/* 닫기 버튼 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">차트 설정</span>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="닫기"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 비교 데이터 선택 */}
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-muted-foreground">비교 데이터</p>
                  <div className="space-y-1">
                    {compareModes.map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setCompareMode(mode.key)}
                        className={[
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                          compareMode === mode.key
                            ? 'bg-foreground/8 text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                        ].join(' ')}
                      >
                        <span>{mode.label}</span>
                        {compareMode === mode.key && (
                          <Check className="w-3.5 h-3.5 text-[hsl(217,91%,60%)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-border/50" />

                {/* X축 시간대 선택 */}
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-muted-foreground">시간대</p>
                  <div className="space-y-1">
                    {timeRanges.map((range) => (
                      <button
                        key={range.key}
                        type="button"
                        onClick={() => setTimeRange(range.key)}
                        className={[
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                          timeRange === range.key
                            ? 'bg-foreground/8 text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                        ].join(' ')}
                      >
                        <span>{range.label}</span>
                        {timeRange === range.key && (
                          <Check className="w-3.5 h-3.5 text-[hsl(217,91%,60%)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일용 범례 */}
      <div className="flex sm:hidden items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full bg-[hsl(217,91%,60%)]" />
          <span className="text-xs text-muted-foreground">오늘</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">{currentLabel}</span>
        </div>
      </div>

      {/* 차트 */}
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
            <Tooltip content={<CustomTooltip compareLabel={currentLabel} />} />
            {filteredData.some((d) => d.hour === peakHour.hour) && (
              <ReferenceLine
                x={peakHour.hour}
                stroke="hsl(25, 95%, 53%)"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
            )}
            <Area
              type="monotone"
              dataKey={compareMode}
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
