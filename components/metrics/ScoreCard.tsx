'use client';

import { Metrics } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreCardProps {
  metrics: Metrics | null;
  previousScore?: number;
}

export function ScoreCard({ metrics, previousScore }: ScoreCardProps) {
  if (!metrics) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-muted-foreground" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-muted-foreground">--</div>
          <p className="text-sm text-muted-foreground mt-2">
            Build your architecture to see score
          </p>
        </CardContent>
      </Card>
    );
  }

  const score = metrics.overallScore;
  const scoreDiff = previousScore !== undefined ? score - previousScore : 0;

  // Determine score color and grade
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const scoreColor = getScoreColor(score);
  const grade = getScoreGrade(score);
  const label = getScoreLabel(score);

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Overall Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <motion.div
            key={score}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className={`text-6xl font-bold ${scoreColor}`}
          >
            {score}
          </motion.div>
          <div className="pb-2 space-y-1">
            <div className={`text-2xl font-bold ${scoreColor}`}>
              {grade}
            </div>
            <div className="text-sm text-muted-foreground">
              / 100
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{label}</div>
          {scoreDiff !== 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1 text-sm font-medium ${
                scoreDiff > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {scoreDiff > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : scoreDiff < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              {Math.abs(scoreDiff)}
            </motion.div>
          )}
        </div>

        {/* Score bar */}
        <div className="space-y-2">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full ${scoreColor.replace('text-', 'bg-')}`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Metric contributions */}
        <div className="pt-2 border-t space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Score Breakdown
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latency:</span>
              <span className="font-medium">{Math.round(Math.max(0, 100 - metrics.latency / 5))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost:</span>
              <span className="font-medium">{Math.round(100 - metrics.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scalability:</span>
              <span className="font-medium">{metrics.scalability}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reliability:</span>
              <span className="font-medium">{metrics.reliability}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
