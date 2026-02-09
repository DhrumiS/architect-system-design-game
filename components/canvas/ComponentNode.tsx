'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ComponentType } from '@/models';
import { COMPONENT_DEFINITIONS } from '@/constants';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Server, 
  Database, 
  Zap, 
  MessageSquare, 
  Shield 
} from 'lucide-react';

const COMPONENT_ICONS: Record<ComponentType, React.ReactNode> = {
  frontend: <Globe className="w-5 h-5" />,
  backend: <Server className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  cache: <Zap className="w-5 h-5" />,
  queue: <MessageSquare className="w-5 h-5" />,
  auth: <Shield className="w-5 h-5" />
};

interface ComponentNodeData {
  type: ComponentType;
  config: string;
  label?: string;
}

function ComponentNodeComponent({ data, selected }: NodeProps<ComponentNodeData>) {
  const definition = COMPONENT_DEFINITIONS[data.type];
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`px-4 py-3 rounded-lg border-2 bg-card shadow-lg transition-all duration-200 min-w-[140px] ${
        selected 
          ? 'border-primary shadow-primary/50' 
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      
      <div className="flex items-center gap-2">
        <div className={`${selected ? 'text-primary' : 'text-muted-foreground'}`}>
          {COMPONENT_ICONS[data.type]}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{definition.name}</div>
          <div className="text-xs text-muted-foreground uppercase">
            {data.config}
          </div>
        </div>
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
    </motion.div>
  );
}

export const ComponentNode = memo(ComponentNodeComponent);
