'use client'

import { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { InputTypes } from 'shadcn-zod-formkit';
import { Card } from '@/components/ui/card';

// Hoist static data outside component
const INPUT_TYPES = [
  { type: InputTypes.TEXT_GROUP, icon: '📝', label: 'Text', color: 'bg-blue-50' },
  { type: InputTypes.NUMBER, icon: '🔢', label: 'Number', color: 'bg-green-50' },
  { type: InputTypes.PHONE, icon: '📱', label: 'Phone', color: 'bg-purple-50' },
  { type: InputTypes.URL, icon: '🔗', label: 'URL', color: 'bg-cyan-50' },
  { type: InputTypes.PASSWORD, icon: '🔒', label: 'Password', color: 'bg-red-50' },
  { type: InputTypes.RATING, icon: '⭐', label: 'Rating', color: 'bg-yellow-50' },
  { type: InputTypes.COLOR, icon: '🎨', label: 'Color', color: 'bg-pink-50' },
  { type: InputTypes.DATE, icon: '📅', label: 'Date', color: 'bg-indigo-50' },
  { type: InputTypes.TIME, icon: '⏰', label: 'Time', color: 'bg-orange-50' },
  { type: InputTypes.SELECT, icon: '📋', label: 'Select', color: 'bg-teal-50' },
  { type: InputTypes.CHECKBOX, icon: '☑️', label: 'Checkbox', color: 'bg-lime-50' },
  { type: InputTypes.SWITCH, icon: '🔄', label: 'Switch', color: 'bg-emerald-50' },
  { type: InputTypes.SLIDER, icon: '🎯', label: 'Slider', color: 'bg-violet-50' },
  { type: InputTypes.TEXTAREA, icon: '📄', label: 'Textarea', color: 'bg-amber-50' },
] as const;

// Hoist static JSX outside component
const TipCard = () => (
  <Card className="mt-4 p-3 bg-blue-50 border-blue-200">
    <p className="text-xs text-blue-800">
      💡 <strong>Tip:</strong> Drag any component to the canvas to start building your form!
    </p>
  </Card>
);

interface DraggableInputProps {
  type: InputTypes;
  icon: string;
  label: string;
  color: string;
}

function DraggableInput({ type, icon, label, color }: DraggableInputProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
  });

  // Memoize class names
  const containerClasses = useMemo(() => {
    const base = 'p-3 rounded-lg border-2 border-dashed cursor-move transition-all hover:shadow-md hover:scale-105';
    const draggingState = isDragging ? 'opacity-50 scale-95' : 'opacity-100';
    return `${base} ${color} ${draggingState}`;
  }, [color, isDragging]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={containerClasses}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

export function ComponentPalette() {
  return (
    <div className="w-64 border-r bg-gray-50 p-4 overflow-auto">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">📦 Components</h3>
        <p className="text-xs text-gray-500">Drag to canvas</p>
      </div>

      <div className="space-y-2">
        {INPUT_TYPES.map((input) => (
          <DraggableInput key={input.type} {...input} />
        ))}
      </div>

      <TipCard />
    </div>
  );
}
