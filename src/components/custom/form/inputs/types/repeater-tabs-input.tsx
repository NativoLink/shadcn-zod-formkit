'use client'

import { JSX, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { BaseInput } from "../base/base-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { FieldProps } from "../base/definitions";
import { TabsContent, Tabs, TabsTrigger, TabsList } from '@/src/components/ui/tabs';

/**
 * 🧱 Clase que extiende BaseInput
 * Se usa igual que tus otros inputs (TextInput, SelectInput, etc.)
 */
export class RepeaterTabsInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldRepeaterTabs form={form} input={input} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

/**
 * 📋 FieldRepeaterTabs
 * - Cada ítem del FieldArray se representa como un tab.
 * - Permite agregar/eliminar tabs.
 * - Mantiene sincronía con React Hook Form.
 */
const FieldRepeaterTabs = ({ form, input, isSubmitting }: Props): JSX.Element => {
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: input.name,
  });

  const [activeTab, setActiveTab] = useState<string>(fields[0]?.id ?? "");

  const canAdd = !input.maxItems || fields.length < input.maxItems;
  const canRemove = fields.length > (input.minItems ?? 0);

  const handleAdd = () => {
    const newItem = { id: `tab-${Date.now()}` };
    append(newItem);
    setActiveTab(newItem.id);
  };

  const handleRemove = (index: number) => {
    const removedId = fields[index].id;
    remove(index);
    if (activeTab === removedId && fields.length > 1) {
      const nextTab = fields[index - 1] ?? fields[0];
      if (nextTab) setActiveTab(nextTab.id);
    }
  };

  return (
    <FormField
      control={control}
      name={input.name}
      render={() => (
        <FormItem className={input.className}>
          {input.label && <FormLabel><b>{input.label}</b></FormLabel>}
          <FormControl>
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* 🔹 Lista de Tabs */}
                <TabsList className="flex w-full justify-start overflow-x-auto">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center">
                      <TabsTrigger value={item.id} className="flex items-center gap-1">
                        {input.tabLabelField
                          ? form.watch(`${input.name}.${index}.${input.tabLabelField}`) ||
                            `Item ${index + 1}`
                          : `Item ${index + 1}`}
                      </TabsTrigger>
                      {canRemove && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemove(index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                  {canAdd && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAdd}
                      disabled={isSubmitting}
                      className="ml-2"
                    >
                      <Plus size={14} className="mr-1" /> Agregar
                    </Button>
                  )}
                </TabsList>

                {/* 🔹 Contenido de cada Tab */}
                {fields.map((item, index) => (
                  <TabsContent key={item.id} value={item.id} className="mt-4">
                    {input.repeaterFields?.map((fieldGroup, groupIndex) => {
                      const group = Array.isArray(fieldGroup)
                        ? fieldGroup
                        : [fieldGroup];
                      const cols = group.length;

                      return (
                        <div key={groupIndex} className={`grid gap-3 grid-cols-${cols}`}>
                          {group.map((subField) => (
                            <FormField
                              key={`${input.name}.${index}.${subField.name}`}
                              control={control}
                              name={`${input.name}.${index}.${subField.name}`}
                              render={({ field, fieldState }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>{subField.label}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={subField.placeHolder}
                                      disabled={subField.disabled || isSubmitting}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </FormControl>

          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
