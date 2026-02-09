'use client';

import { Warning } from '@/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WarningBadge } from './WarningBadge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface WarningListProps {
  warnings: Warning[];
  onWarningClick?: (componentId?: string) => void;
}

export function WarningList({ warnings, onWarningClick }: WarningListProps) {
  const errorCount = warnings.filter(w => w.type === 'error').length;
  const warningCount = warnings.filter(w => w.type === 'warning').length;
  const infoCount = warnings.filter(w => w.type === 'info').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Warnings & Suggestions
          </CardTitle>
          {warnings.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {errorCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 font-medium">
                  {errorCount} Error{errorCount !== 1 ? 's' : ''}
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-medium">
                  {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                </span>
              )}
              {infoCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 font-medium">
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
            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            <p className="text-sm font-medium text-foreground">
              No issues detected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your architecture looks good!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {warnings.map((warning) => (
                <WarningBadge
                  key={warning.id}
                  warning={warning}
                  onClick={onWarningClick}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
