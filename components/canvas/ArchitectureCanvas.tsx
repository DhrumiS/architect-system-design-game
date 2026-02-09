'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ComponentNode } from './ComponentNode';
import { ConnectionEdge } from './ConnectionEdge';
import { ArchitectureComponent, Connection as ArchConnection, ComponentType } from '@/models';

const nodeTypes = {
  component: ComponentNode,
};

const edgeTypes = {
  connection: ConnectionEdge,
};

interface ArchitectureCanvasProps {
  components: ArchitectureComponent[];
  connections: ArchConnection[];
  onComponentAdd: (component: ArchitectureComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<ArchitectureComponent>) => void;
  onComponentRemove: (id: string) => void;
  onConnectionAdd: (connection: ArchConnection) => void;
  onConnectionRemove: (id: string) => void;
  onComponentSelect: (id: string | null) => void;
}

export function ArchitectureCanvas({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentRemove,
  onConnectionAdd,
  onConnectionRemove,
  onComponentSelect,
}: ArchitectureCanvasProps) {
  // Convert architecture components to React Flow nodes
  const nodes: Node[] = useMemo(
    () =>
      components.map((comp) => ({
        id: comp.id,
        type: 'component',
        position: comp.position,
        data: {
          type: comp.type,
          config: comp.config,
        },
      })),
    [components]
  );

  // Convert architecture connections to React Flow edges
  const edges: Edge[] = useMemo(
    () =>
      connections.map((conn) => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: 'connection',
      })),
    [connections]
  );

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          onComponentUpdate(change.id, { position: change.position });
        } else if (change.type === 'remove') {
          onComponentRemove(change.id);
        } else if (change.type === 'select') {
          onComponentSelect(change.selected ? change.id : null);
        }
      });
    },
    [onComponentUpdate, onComponentRemove, onComponentSelect]
  );

  // Handle edge changes (selection, removal)
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          onConnectionRemove(change.id);
        }
      });
    },
    [onConnectionRemove]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newConnection: ArchConnection = {
          id: crypto.randomUUID(),
          source: connection.source,
          target: connection.target,
        };
        onConnectionAdd(newConnection);
      }
    },
    [onConnectionAdd]
  );

  // Handle drop from component palette
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as ComponentType;
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 80,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      // Get default config for component type
      const defaultConfigs: Record<ComponentType, string> = {
        frontend: 'spa',
        backend: 'monolith',
        database: 'sql',
        cache: 'redis',
        queue: 'kafka',
        auth: 'jwt',
      };

      const newComponent: ArchitectureComponent = {
        id: crypto.randomUUID(),
        type,
        config: defaultConfigs[type] as any,
        position,
      };

      onComponentAdd(newComponent);
    },
    [onComponentAdd]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-background"
        deleteKeyCode="Delete"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
        <Controls className="bg-card border-border" />
        <MiniMap
          className="bg-card border-border"
          nodeColor={(node) => {
            return 'hsl(var(--primary))';
          }}
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
    </div>
  );
}
