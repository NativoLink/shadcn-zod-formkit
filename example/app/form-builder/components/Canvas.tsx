'use client'

import { useMemo, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FieldProps } from 'shadcn-zod-formkit';
import { DraggableField } from './DraggableField';

interface CanvasProps {
  fields: FieldProps<any>[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (field: FieldProps<any>) => void;
}

// Hoist static JSX outside component
const EmptyCanvasState = () => (
  <div className="text-center text-gray-400">
    <div className="text-6xl mb-4">📋</div>
    <p className="text-lg font-medium">Drop components here</p>
    <p className="text-sm">Start building your form by dragging inputs</p>
  </div>
);

export function Canvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onDuplicateField,
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-dropzone',
  });

  // Memoize derived values
  const fieldsCount = useMemo(() => fields.length, [fields.length]);
  const isEmpty = fieldsCount === 0;

  // Memoize class names
  const containerClasses = useMemo(() => {
    const base = 'min-h-[500px] border-2 border-dashed rounded-lg p-4 transition-colors';
    const hoverState = isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300';
    const emptyState = isEmpty ? 'flex items-center justify-center' : '';
    return `${base} ${hoverState} ${emptyState}`;
  }, [isOver, isEmpty]);

  // Stable callbacks
  const handleSelectField = useCallback((name: string) => {
    onSelectField(name);
  }, [onSelectField]);

  const handleDeleteField = useCallback((name: string) => {
    onDeleteField(name);
  }, [onDeleteField]);

  const handleDuplicateField = useCallback((field: FieldProps<any>) => {
    onDuplicateField(field);
  }, [onDuplicateField]);

  return (
    <div className="flex-1 p-8 overflow-auto bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Form Canvas</h2>
          <p className="text-sm text-gray-500">
            {isEmpty
              ? 'Drag components from the left panel to start building'
              : `${fieldsCount} field${fieldsCount !== 1 ? 's' : ''} added`}
          </p>
        </div>

        <div ref={setNodeRef} className={containerClasses}>
          {isEmpty ? (
            <EmptyCanvasState />
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <DraggableField
                  key={field.name as string}
                  field={field}
                  isSelected={selectedFieldId === field.name}
                  onSelect={() => handleSelectField(field.name as string)}
                  onDelete={() => handleDeleteField(field.name as string)}
                  onDuplicate={() => handleDuplicateField(field)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
