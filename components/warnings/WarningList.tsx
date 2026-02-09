'use client';

import { Warning } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WarningBadge } from './WarningBadge';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface WarningListProps {
  warnings: Warning[];
  onWarningClick?: (warning: Warning) => void;
  onWarningDismiss?: (id: string) => void;
}

export function WarningList({ warnings, onWarningClick, onWarningDismiss }: WarningListProps) {
  const errorCount = warnings.filter(w => w.type === 'error').length;
  const warningCount = warnings.filter(w => w.type === 'warning').length;
  const infoCount = warnings.filter(w => w.type === 'info').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Warnings & Suggestions</CardTitle>
          {warnings.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {errorCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-500 font-medium">
                  {errorCount} Error{errorCount !== 1 ? 's' : ''}
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-medium">
                  {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                </span>
              )}
              {infoCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 font-medium">
                  {infoCount} Info
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {warnings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <div className="text-sm font-medium mb-1">No Issues Detected</div>
            <div className="text-xs text-muted-foreground">
              Your architecture looks good!
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {warnings.map((warning) => (
                <WarningBadge
                  key={warning.id}
                  warning={warning}
                  onClick={onWarningClick}
                  onDismiss={onWarningDismiss}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
