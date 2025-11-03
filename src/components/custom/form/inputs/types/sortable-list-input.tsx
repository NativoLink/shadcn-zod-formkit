'use client'

import { JSX, ReactNode, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"
import { cn } from "@/src/lib/utils"
import { BaseInput, FieldProps } from "../base"

// ============================================================================
// 🔹 Clase principal que extiende de BaseInput
// ============================================================================

export class SortableListInput<T> extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this
    const children = input.listConfig?.children ?? undefined
    return (
      <FieldSortableList<T>
        form={form}
        input={input}
        isSubmitting={isSubmitting}
        children={children as (item: T, index: number) => ReactNode}
      />
    )
  }
}

// ============================================================================
// 🔹 Campo principal con lógica de drag & drop
// ============================================================================

interface Props<T> {
  form: UseFormReturn
  input: FieldProps
  isSubmitting?: boolean
  children?: (item: T, index: number) => ReactNode
}

function FieldSortableList<T>({
  form,
  input,
  isSubmitting,
  children,
}: Props<T>): JSX.Element {
  const [items, setItems] = useState<any[]>(() => input.listConfig?.list ?? [])
  const sortableEnabled = input.listConfig?.sortable ?? true;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: any) => {
    if (!sortableEnabled) return; 
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i: any) => i.id === active.id)
    const newIndex = items.findIndex((i: any) => i.id === over.id)
    const newList = arrayMove(items, oldIndex, newIndex)

    setItems(newList)
    form.setValue(input.name, newList)
    input.listConfig?.onOptionChange?.(newList)
  }

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={() => (
        <FormItem className={cn("space-y-2", input.className)}>
          {input.label && <FormLabel><b>{input.label}</b></FormLabel>}
          <FormControl>
            {sortableEnabled ? (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {items.map((item, index) => (
                      <SortableWrapper key={item.id} id={item.id}>
                        {typeof children === "function"
                          ? children(item, index)
                          : <div className="p-3 border rounded-md bg-white">{item.name}</div>}
                      </SortableWrapper>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((item, index) =>
                  typeof children === "function"
                    ? children(item, index)
                    : <div key={item.id} className="p-3 border rounded-md bg-gray-50">{item.name}</div>
                )}
              </div>
            )}
          </FormControl>
          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ============================================================================
// 🔹 SortableWrapper: item individual draggable
// ============================================================================

function SortableWrapper({
  id,
  children,
  disabled,
}: {
  id: string | number
  children: React.ReactNode
  disabled?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 p-2 border rounded-md mb-1 bg-muted/30 cursor-grab select-none transition-all",
        isDragging && "opacity-60 bg-muted/50 scale-[0.98]"
      )}
    >
      <GripVertical className="w-4 h-4 opacity-70" />
      <div className="flex-1">{children}</div>
    </div>
  )
}
