'use client'

import { useMemo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldProps } from 'shadcn-zod-formkit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2, Copy, Settings } from 'lucide-react';

interface DraggableFieldProps {
  field: FieldProps<any>;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

// Hoist static icon mapping outside component
const INPUT_ICONS: Record<string, string> = {
  text_group: '📝',
  number: '🔢',
  phone: '📱',
  url: '🔗',
  password: '🔒',
  rating: '⭐',
  color: '🎨',
  date: '📅',
  time: '⏰',
  select: '📋',
  checkbox: '☑️',
  switch: '🔄',
  slider: '🎯',
  textarea: '📄',
};

const getInputIcon = (inputType: string) => INPUT_ICONS[inputType] || '📝';

export function DraggableField({
  field,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.name as string });

  // Memoize style object
  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  // Memoize class names
  const cardClasses = useMemo(() => {
    const base = 'p-4 cursor-pointer transition-all';
    const selectedState = isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md';
    const draggingState = isDragging ? 'opacity-50' : 'opacity-100';
    return `${base} ${selectedState} ${draggingState}`;
  }, [isSelected, isDragging]);

  // Memoize icon
  const icon = useMemo(() => getInputIcon(field.inputType as string), [field.inputType]);

  // Stable callbacks
  const handleDuplicateClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate();
  }, [onDuplicate]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={cardClasses} onClick={onSelect}>
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Icon */}
          <div className="text-2xl">{icon}</div>

          {/* Field Info */}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{field.label}</div>
            <div className="text-xs text-gray-500 truncate">
              {field.name as string} • {field.inputType}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isSelected && (
              <div className="flex items-center gap-1 mr-2">
                <Settings className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-blue-500 font-medium">Selected</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDuplicateClick}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview */}
        {field.description && (
          <div className="mt-2 text-xs text-gray-500 ml-11">
            {field.description}
          </div>
        )}
      </Card>
    </div>
  );
}
