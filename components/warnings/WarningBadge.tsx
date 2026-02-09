'use client';

import { Warning } from '@/models';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WarningBadgeProps {
  warning: Warning;
  onDismiss?: (id: string) => void;
  onClick?: (componentId?: string) => void;
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

  const getBorderColor = () => {
    switch (warning.type) {
      case 'error':
        return 'border-red-500/50';
      case 'warning':
        return 'border-yellow-500/50';
      case 'info':
        return 'border-blue-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2 p-3 rounded-lg border-2 ${getBorderColor()} bg-card hover:bg-accent transition-colors ${
        warning.componentId ? 'cursor-pointer' : ''
      }`}
      onClick={() => onClick?.(warning.componentId)}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium mb-1">
          <Badge variant={getVariant()} className="mr-2">
            {warning.type.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-foreground">{warning.message}</p>
        {warning.componentId && (
          <p className="text-xs text-muted-foreground mt-1">
            Click to highlight component
          </p>
        )}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
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
