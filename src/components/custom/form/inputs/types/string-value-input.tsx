'use client';

import { JSX, useEffect } from "react";
import { BaseInput } from "../base/base-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FieldProps } from "../base/definitions";
import { Plus, Trash2 } from "lucide-react";

export class StringValueListInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldStringValueList
        input={input}
        form={form}
        isSubmitting={isSubmitting}
      />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

/**
 * 🧠 Lista editable de strings
 */
export const FieldStringValueList = ({ form, input, isSubmitting }: Props) => {
  const fieldName = input.name;

  // Inicializamos como array vacío si no existe
  useEffect(() => {
    const current = form.getValues(fieldName);
    if (!Array.isArray(current)) {
      form.setValue(fieldName, []);
    }
  }, [form, fieldName]);

  const handleAddItem = () => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...current, ""]);
  };

  const handleRemoveItem = (index: number) => {
    const current = form.getValues(fieldName) || [];
    const updated = current.filter((_: string, i: number) => i !== index);
    form.setValue(fieldName, updated);
  };

  const handleChange = (index: number, newValue: string) => {
    const current = form.getValues(fieldName) || [];
    const updated = current.map((item: string, i: number) =>
      i === index ? newValue : item
    );
    form.setValue(fieldName, updated);
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => {
        const items = form.watch(fieldName) || [];

        return (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormMessage />
            <FormControl>
              <div className="flex flex-col gap-3  rounded-xl ">
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No items have been added yet.
                  </p>
                )}

                {items.map((value: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-2"
                  >
                    <Input
                      placeholder={`Item ${index + 1}`}
                      value={value}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    {input.isRemovebleOption && (<Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 size={18} />
                    </Button>)}
                  </div>
                ))}

                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    disabled={isSubmitting}
                  >
                    <Plus size={18} className="mr-1" />
                  </Button>
                </div>
              </div>
            </FormControl>

            {input.description && (
              <FormDescription>{input.description}</FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
};
