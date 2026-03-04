'use client'

import { useState, useCallback, useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { FieldProps, InputTypes } from 'shadcn-zod-formkit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';
import { ComponentPalette } from './components/ComponentPalette';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { PreviewPanel } from './components/PreviewPanel';

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FieldProps<any>[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Memoize field names for SortableContext
  const fieldNames = useMemo(
    () => fields.map(f => f.name as string),
    [fields]
  );

  // Memoize selected field
  const selectedField = useMemo(
    () => fields.find(f => f.name === selectedFieldId),
    [fields, selectedFieldId]
  );

  // Memoize fields count
  const fieldsCount = useMemo(() => fields.length, [fields.length]);

  // Stable callback for creating new field
  const createNewField = useCallback((inputType: InputTypes): FieldProps<any> => {
    const id = `field_${Date.now()}`;
    const baseField: FieldProps<any> = {
      name: id,
      label: `New ${inputType}`,
      inputType: inputType,
      placeHolder: 'Enter value...',
      zodType: z.string().optional(),
    };

    switch (inputType) {
      case InputTypes.RATING:
        return { ...baseField, max: 5, showValue: true, zodType: z.number().optional() };
      case InputTypes.PHONE:
        return { ...baseField, defaultCountryCode: '+1' };
      case InputTypes.PASSWORD:
        return { ...baseField, showStrength: true, showRequirements: true };
      case InputTypes.NUMBER:
        return { ...baseField, zodType: z.number().optional() };
      default:
        return baseField;
    }
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    // Could track active drag if needed
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // New field from palette
    if (active.id.toString().startsWith('palette-')) {
      const inputType = active.id.toString().replace('palette-', '') as InputTypes;
      const newField = createNewField(inputType);
      setFields(prev => [...prev, newField]);
      setSelectedFieldId(newField.name as string);
      return;
    }

    // Reorder existing fields
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id);
        const newIndex = items.findIndex((item) => item.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [createNewField]);

  const handleUpdateField = useCallback((updatedField: FieldProps<any>) => {
    setFields(prev => prev.map(f => f.name === updatedField.name ? updatedField : f));
  }, []);

  const handleDeleteField = useCallback((fieldName: string) => {
    setFields(prev => prev.filter(f => f.name !== fieldName));
    setSelectedFieldId(prev => prev === fieldName ? null : prev);
  }, []);

  const handleDuplicateField = useCallback((field: FieldProps<any>) => {
    const newField = {
      ...field,
      name: `${String(field.name)}_copy_${Date.now()}`,
      label: `${field.label} (Copy)`,
    };
    setFields(prev => [...prev, newField]);
  }, []);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(fields, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [fields]);

  const handleImport = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json);
      setFields(imported);
      setSelectedFieldId(null);
    } catch (error) {
      alert('Invalid JSON format');
    }
  }, []);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear all fields?')) {
      setFields([]);
      setSelectedFieldId(null);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        onExport={handleExport}
        onImport={handleImport}
        onClear={handleClear}
        fieldsCount={fieldsCount}
      />

      <Tabs defaultValue="builder" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-1 bg-white">
          <TabsList>
            <TabsTrigger value="builder">🎨 Builder</TabsTrigger>
            <TabsTrigger value="preview">👁️ Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="builder" className="flex-1 m-0 overflow-hidden">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="h-full flex overflow-hidden">
              <ComponentPalette />

              <SortableContext
                items={fieldNames}
                strategy={verticalListSortingStrategy}
              >
                <Canvas
                  fields={fields}
                  selectedFieldId={selectedFieldId}
                  onSelectField={setSelectedFieldId}
                  onDeleteField={handleDeleteField}
                  onDuplicateField={handleDuplicateField}
                />
              </SortableContext>

              <PropertiesPanel
                field={selectedField}
                allFields={fields}
                onUpdate={handleUpdateField}
              />
            </div>
          </DndContext>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <PreviewPanel fields={fields} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
