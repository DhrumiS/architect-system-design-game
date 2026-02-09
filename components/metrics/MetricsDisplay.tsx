'use client';

import { Metrics, Scenario } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Clock, DollarSign, TrendingUp, Shield } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: Metrics | null;
  scenario: Scenario | null;
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  weight?: number;
}

function MetricItem({ icon, label, value, unit, color, weight }: MetricItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
    >
      <div className={`${color} p-2 rounded-md`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="flex items-baseline gap-2">
          <motion.span
            key={value}
            initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
            animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {weight !== undefined && (
          <div className="text-xs text-muted-foreground mt-1">
            Weight: {(weight * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function MetricsDisplay({ metrics, scenario }: MetricsDisplayProps) {
  if (!metrics || !scenario) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add components to see metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Architecture Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricItem
            icon={<Clock className="w-4 h-4" />}
            label="Latency"
            value={metrics.latency}
            unit="ms"
            color="bg-blue-500/10 text-blue-500"
            weight={scenario.weights.latency}
          />
          <MetricItem
            icon={<DollarSign className="w-4 h-4" />}
            label="Cost"
            value={metrics.cost}
            unit="units"
            color="bg-yellow-500/10 text-yellow-500"
            weight={scenario.weights.cost}
          />
          <MetricItem
            icon={<TrendingUp className="w-4 h-4" />}
            label="Scalability"
            value={metrics.scalability}
            unit="%"
            color="bg-green-500/10 text-green-500"
            weight={scenario.weights.scalability}
          />
          <MetricItem
            icon={<Shield className="w-4 h-4" />}
            label="Reliability"
            value={metrics.reliability}
            unit="%"
            color="bg-purple-500/10 text-purple-500"
            weight={scenario.weights.reliability}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Metric Breakdown
          </div>
          <div className="space-y-2">
            {[
              { label: 'Latency', weight: scenario.weights.latency, color: 'bg-blue-500' },
              { label: 'Cost', weight: scenario.weights.cost, color: 'bg-yellow-500' },
              { label: 'Scalability', weight: scenario.weights.scalability, color: 'bg-green-500' },
              { label: 'Reliability', weight: scenario.weights.reliability, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{(item.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.weight * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
