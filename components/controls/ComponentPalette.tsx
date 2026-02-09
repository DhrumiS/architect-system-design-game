'use client';

import { ComponentType } from '@/models';
import { COMPONENT_DEFINITIONS } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Globe, 
  Server, 
  Database, 
  Zap, 
  MessageSquare, 
  Shield 
} from 'lucide-react';
import { motion } from 'framer-motion';

const COMPONENT_ICONS: Record<ComponentType, React.ReactNode> = {
  frontend: <Globe className="w-6 h-6" />,
  backend: <Server className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  cache: <Zap className="w-6 h-6" />,
  queue: <MessageSquare className="w-6 h-6" />,
  auth: <Shield className="w-6 h-6" />
};

interface ComponentPaletteProps {
  onDragStart?: (componentType: ComponentType) => void;
}

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const componentTypes = Object.keys(COMPONENT_DEFINITIONS) as ComponentType[];

  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(type);
  };

  return (
    <Card className="w-64 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <TooltipProvider>
          {componentTypes.map((type, index) => {
            const definition = COMPONENT_DEFINITIONS[type];
            
            return (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, type)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary cursor-grab active:cursor-grabbing transition-all duration-200"
                  >
                    <div className="text-primary">
                      {COMPONENT_ICONS[type]}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{definition.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {definition.options.length} options
                      </div>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="font-semibold mb-1">{definition.name}</p>
                  <p className="text-xs">
                    Drag to canvas to add. Options: {definition.options.join(', ')}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
