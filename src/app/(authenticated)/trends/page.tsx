'use client';

import { useState, useEffect, useCallback } from 'react';
import { m } from 'motion/react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Mock data for 12 weeks of declining scores ---
// TODO: Replace with data from /api/trends when wired to real DB

interface ScorePoint {
  week: string;
  totalTons: number;
  food: number;
  transit: number;
  home: number;
  shopping: number;
  services: number;
}

function generateMockData(): ScorePoint[] {
  // TODO: Wire to real API data from /api/trends
  const weeks: ScorePoint[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 12 * 7);

  let total = 12.4;
  let food = 3.2;
  let transit = 3.5;
  let home = 2.8;
  let shopping = 1.9;
  let services = 1.0;

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7);

    // Simulate gradual improvement with some variance
    const variance = (Math.random() - 0.5) * 0.15;
    const decay = 0.97 + variance * 0.02;

    food = Math.max(1.5, food * (decay - 0.005));
    transit = Math.max(1.0, transit * (decay - 0.008));
    home = Math.max(1.5, home * (decay + 0.002));
    shopping = Math.max(0.8, shopping * (decay - 0.003));
    services = Math.max(0.5, services * decay);
    total = food + transit + home + shopping + services;

    weeks.push({
      week: `W${i + 1}`,
      totalTons: parseFloat(total.toFixed(2)),
      food: parseFloat(food.toFixed(2)),
      transit: parseFloat(transit.toFixed(2)),
      home: parseFloat(home.toFixed(2)),
      shopping: parseFloat(shopping.toFixed(2)),
      services: parseFloat(services.toFixed(2)),
    });
  }

  return weeks;
}

// TODO: Replace with real streak data from /api/trends
function generateMockStreak(): boolean[] {
  // 12 weeks, most recent weeks checked in
  return [
    true, false, true, true, true, true, true, true, true, true, true, true,
  ];
}

// Category color tokens
const CATEGORY_COLORS = {
  food: '#22C55E',
  transit: '#3B82F6',
  home: '#F59E0B',
  shopping: '#A855F7',
  services: '#6366F1',
};

export default function TrendsPage() {
  const [mockData, setMockData] = useState<ScorePoint[]>([]);
  const [streak, setStreak] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with real API call to /api/trends
  const [apiData, setApiData] = useState<{
    scores: ScorePoint[];
    streak: number;
    totalSaved: number;
    weeklyAverage: number;
  } | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      const res = await fetch('/api/trends');
      if (res.ok) {
        const data = await res.json();
        setApiData(data);
      }
    } catch {
      // Fall back to mock data silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Generate mock data on mount
    setMockData(generateMockData());
    setStreak(generateMockStreak());
    fetchTrends();
  }, [fetchTrends]);

  // TODO: Prefer apiData when available, fall back to mock
  const chartData = mockData;
  const totalSaved = apiData?.totalSaved ?? (chartData.length > 0
    ? parseFloat((chartData[0].totalTons - chartData[chartData.length - 1].totalTons).toFixed(2))
    : 0);
  const currentWeekly = apiData?.weeklyAverage ?? (chartData.length > 0
    ? parseFloat((chartData[chartData.length - 1].totalTons / 52).toFixed(3))
    : 0);
  const initialWeekly = chartData.length > 0
    ? parseFloat((chartData[0].totalTons / 52).toFixed(3))
    : 0;
  const streakCount = apiData?.streak ?? streak.filter(Boolean).length;

  // Determine best category improvement
  const bestCategory = chartData.length >= 2
    ? (() => {
        const first = chartData[0];
        const last = chartData[chartData.length - 1];
        const improvements = [
          { name: 'Food', diff: first.food - last.food },
          { name: 'Transit', diff: first.transit - last.transit },
          { name: 'Home', diff: first.home - last.home },
          { name: 'Shopping', diff: first.shopping - last.shopping },
          { name: 'Services', diff: first.services - last.services },
        ];
        improvements.sort((a, b) => b.diff - a.diff);
        return improvements[0];
      })()
    : { name: 'N/A', diff: 0 };

  if (loading && chartData.length === 0) {
    return (
      <div>
        <Skeleton variant="text" className="mb-2 h-8 w-32" />
        <Skeleton variant="text" className="mb-6 h-4 w-48" />
        <div className="space-y-4">
          <Skeleton variant="card" className="h-64" />
          <Skeleton variant="card" className="h-64" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
          Trends
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Track your footprint over time and see your progress.
        </p>
      </m.div>

      {/* Impact summary cards */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="mt-6 grid grid-cols-2 gap-3"
      >
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Total CO&#x2082; Saved
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-accent)]">
            {totalSaved.toFixed(1)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">tons since joining</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Weekly Average
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-primary)]">
            {currentWeekly.toFixed(3)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            tons/wk (was {initialWeekly.toFixed(3)})
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Best Improvement
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-[var(--color-primary)]">
            {bestCategory.name}
          </p>
          <p className="text-xs text-[var(--color-accent)]">
            -{bestCategory.diff.toFixed(1)} tons
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Check-In Streak
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-celebrate)]">
            {streakCount}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">weeks in a row</p>
        </Card>
      </m.div>

      {/* Score over time line chart */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="mt-6"
      >
        <Card className="p-4">
          <h2 className="mb-4 font-display text-base font-semibold text-[var(--color-primary)]">
            Score Over Time
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tickFormatter={(v: number) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value ?? 0} tons`, 'CO\u2082/year']}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="totalTons"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--color-accent)', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: 'var(--color-accent)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </m.div>

      {/* Category breakdown stacked area chart */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="mt-4"
      >
        <Card className="p-4">
          <h2 className="mb-4 font-display text-base font-semibold text-[var(--color-primary)]">
            Category Breakdown Over Time
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [`${value ?? 0} tons`, name]}
                />
                <Area
                  type="monotone"
                  dataKey="food"
                  stackId="1"
                  fill={CATEGORY_COLORS.food}
                  fillOpacity={0.7}
                  stroke={CATEGORY_COLORS.food}
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="transit"
                  stackId="1"
                  fill={CATEGORY_COLORS.transit}
                  fillOpacity={0.7}
                  stroke={CATEGORY_COLORS.transit}
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="home"
                  stackId="1"
                  fill={CATEGORY_COLORS.home}
                  fillOpacity={0.7}
                  stroke={CATEGORY_COLORS.home}
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="shopping"
                  stackId="1"
                  fill={CATEGORY_COLORS.shopping}
                  fillOpacity={0.7}
                  stroke={CATEGORY_COLORS.shopping}
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="services"
                  stackId="1"
                  fill={CATEGORY_COLORS.services}
                  fillOpacity={0.7}
                  stroke={CATEGORY_COLORS.services}
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3">
            {Object.entries(CATEGORY_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs capitalize text-[var(--color-text-muted)]">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </m.div>

      {/* Check-in streak tracker */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="mt-4"
      >
        <Card className="p-4">
          <h2 className="mb-3 font-display text-base font-semibold text-[var(--color-primary)]">
            Check-In Streak
          </h2>
          <div className="flex flex-wrap gap-2">
            {streak.map((checked, i) => (
              <m.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.5 + i * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium ${
                  checked
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                }`}
                title={`Week ${i + 1}: ${checked ? 'Checked in' : 'Missed'}`}
              >
                {checked ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>W{i + 1}</span>
                )}
              </m.div>
            ))}
          </div>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            {streakCount} week{streakCount !== 1 ? 's' : ''} in a row! Keep going!
          </p>
        </Card>
      </m.div>
    </div>
  );
}
