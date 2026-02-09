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

  const metricItems = [
    {
      label: 'Latency',
      value: `${metrics.latency}ms`,
      icon: Clock,
      color: 'text-blue-500',
      weight: scenario.weights.latency,
    },
    {
      label: 'Cost',
      value: metrics.cost.toFixed(0),
      icon: DollarSign,
      color: 'text-green-500',
      weight: scenario.weights.cost,
    },
    {
      label: 'Scalability',
      value: `${metrics.scalability}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      weight: scenario.weights.scalability,
    },
    {
      label: 'Reliability',
      value: `${metrics.reliability}%`,
      icon: Shield,
      color: 'text-orange-500',
      weight: scenario.weights.reliability,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Real-Time Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {metricItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <motion.div
                key={item.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold"
              >
                {item.value}
              </motion.div>
              <div className="text-xs text-muted-foreground">
                Weight: {(item.weight * 100).toFixed(0)}%
              </div>
            </motion.div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Metric Breakdown
          </div>
          {metricItems.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{item.label}</span>
                <span className="font-medium">{(item.weight * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.weight * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full ${item.color.replace('text-', 'bg-')}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
