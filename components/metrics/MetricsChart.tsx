'use client';

import { Metrics } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface MetricsChartProps {
  metrics: Metrics | null;
}

export function MetricsChart({ metrics }: MetricsChartProps) {
  if (!metrics) {
    return null;
  }

  // Convert metrics to 0-100 scale for visualization
  const latencyScore = Math.max(0, 100 - metrics.latency / 5);
  const costScore = 100 - metrics.cost;

  const data = [
    {
      metric: 'Latency',
      value: latencyScore,
      fullMark: 100,
    },
    {
      metric: 'Cost',
      value: costScore,
      fullMark: 100,
    },
    {
      metric: 'Scalability',
      value: metrics.scalability,
      fullMark: 100,
    },
    {
      metric: 'Reliability',
      value: metrics.reliability,
      fullMark: 100,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Metrics Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Radar
              name="Metrics"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
