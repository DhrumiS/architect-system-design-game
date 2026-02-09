'use client';

import { Warning } from '@/models';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WarningBadgeProps {
  warning: Warning;
  onDismiss?: (id: string) => void;
  onClick?: (warning: Warning) => void;
}

export function WarningBadge({ warning, onDismiss, onClick }: WarningBadgeProps) {
  const getIcon = () => {
    switch (warning.type) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
    }
  };

  const getVariant = () => {
    switch (warning.type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'secondary';
    }
  };

  const getColorClass = () => {
    switch (warning.type) {
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 p-3 rounded-lg border-2 ${getColorClass()} cursor-pointer hover:scale-[1.02] transition-transform`}
      onClick={() => onClick?.(warning)}
    >
      <div className="mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium mb-1">
          {warning.type.charAt(0).toUpperCase() + warning.type.slice(1)}
        </div>
        <div className="text-xs text-muted-foreground">
          {warning.message}
        </div>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(warning.id);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </motion.div>
  );
}
