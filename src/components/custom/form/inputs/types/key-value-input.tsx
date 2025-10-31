'use client'

import { JSX } from "react";
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
import { useEffect } from "react";

export class KeyValueListInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldKeyValueList
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
 * 🧠 Lista editable de pares clave-valor
 */
export const FieldKeyValueList = ({ form, input, isSubmitting }: Props) => {
  const fieldName = input.name;

  // Inicializamos el valor como array vacío si no existe
  useEffect(() => {
    const current = form.getValues(fieldName);
    if (!Array.isArray(current)) {
      form.setValue(fieldName, []);
    }
  }, [form, fieldName]);

  const handleAddPair = () => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...current, { key: "", value: "" }]);
  };

  const handleRemovePair = (index: number) => {
    const current = form.getValues(fieldName) || [];
    const updated = current.filter((_: any, i: number) => i !== index);
    form.setValue(fieldName, updated);
  };

  const handleChange = (index: number, fieldType: "key" | "value", newValue: string) => {
    const current = form.getValues(fieldName) || [];
    const updated = current.map((item: any, i: number) =>
      i === index ? { ...item, [fieldType]: newValue } : item
    );
    form.setValue(fieldName, updated);
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => {
        const pairs = form.watch(fieldName) || [];

        return (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormMessage />
            <FormControl>
              <div className="flex flex-col gap-3 shadow-lg rounded-xl p-3 bg-white">
                {pairs.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No pairs have been added yet.
                  </p>
                )}

                {pairs.map((pair: { key: string; value: string }, index: number) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={pair.key}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(index, "key", e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="Value"
                      value={pair.value}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(index, "value", e.target.value)}
                      className="w-1/2"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemovePair(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPair}
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
