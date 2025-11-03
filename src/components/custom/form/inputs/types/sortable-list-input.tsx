'use client'

import { JSX, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps, InputOption } from "../base";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/src/lib/utils";

/**
 * Clase que extiende BaseInput (mantiene tu patrón)
 */
export class SortableListInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldSortableList form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldSortableList = ({ form, input, isSubmitting }: Props): JSX.Element => {
  const [items, setItems] = useState<InputOption[]>((input.listConfig?.list ?? []).filter((item): item is InputOption => 'name' in item));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newList = arrayMove(items, oldIndex, newIndex);

    setItems(newList);
    form.setValue(input.name, newList);

    if (input.listConfig?.onOptionChange) {
      input.listConfig.onOptionChange(newList);
    }
  };

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={() => (
        <FormItem className={cn("space-y-2", input.className)}>
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl>
            <div className="border rounded-md p-3 bg-white">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      disabled={isSubmitting}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </FormControl>
          {input.description && (
            <FormDescription>{input.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


export function SortableItem({
  id,
  name,
  disabled,
}: {
  id: string | number;
  name: string;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center justify-between p-2 border rounded-md mb-1 bg-muted/30 cursor-grab select-none",
        isDragging && "opacity-60 bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 opacity-70" />
        <span>{name}</span>
      </div>
    </div>
  );
}