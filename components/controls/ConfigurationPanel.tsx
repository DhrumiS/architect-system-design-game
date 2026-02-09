'use client';

import { ArchitectureComponent, ComponentConfig } from '@/models';
import { COMPONENT_DEFINITIONS } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { X, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfigurationPanelProps {
  component: ArchitectureComponent | null;
  onConfigUpdate: (config: ComponentConfig[keyof ComponentConfig]) => void;
  onClose?: () => void;
}

export function ConfigurationPanel({ component, onConfigUpdate, onClose }: ConfigurationPanelProps) {
  if (!component) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg">Configuration</CardTitle>
          <CardDescription>Select a component to configure</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const definition = COMPONENT_DEFINITIONS[component.type];
  const options = definition.options;

  const handleConfigChange = (value: string) => {
    onConfigUpdate(value as ComponentConfig[keyof ComponentConfig]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-80 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Configuration</CardTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription>{definition.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={component.config} onValueChange={handleConfigChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              Options
            </div>
            <TooltipProvider>
              {options.map((option) => (
                <Tooltip key={option}>
                  <TooltipTrigger asChild>
                    <div
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-help ${
                        component.config === option
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:bg-accent'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {definition.descriptions[option]}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="font-semibold mb-1">{option.toUpperCase()}</p>
                    <p className="text-xs">{definition.descriptions[option]}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">
                <span className="font-medium">Component ID:</span> {component.id.slice(0, 8)}...
              </p>
              <p>
                <span className="font-medium">Position:</span> ({Math.round(component.position.x)}, {Math.round(component.position.y)})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
