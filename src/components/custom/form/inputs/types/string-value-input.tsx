'use client';

import { JSX, useCallback, useEffect, useState } from "react";
import { BaseInput, isValidField } from "../base/base-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FieldProps } from "../base/definitions";
import { Plus, Trash2 } from "lucide-react";
import { CustomInputGroup } from "./text-input-group";

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
  const withAddBtn = input.withAddBtn ?? false;
  const [isValid, setIsValid] = useState<boolean>(isValidField(input, form));

  useEffect(() => {
    setIsValid(isValidField(input, form));
  }, [form.formState]);

  useEffect(() => {
    const current = form.getValues(fieldName);
    if (!Array.isArray(current)) {
      form.setValue(fieldName, []);
    }
  }, [form, fieldName]);

  const handleAddItem = useCallback(() => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...current, ""], { shouldDirty: true });
  }, [form, fieldName]);

  const handleRemoveItem = useCallback((index: number) => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, current.filter((_: string, i: number) => i !== index), { shouldDirty: true });
  }, [form, fieldName]);

  const handleChange = useCallback((index: number, newValue: string) => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, current.map((item: string, i: number) => i === index ? newValue : item), { shouldDirty: true });
  }, [form, fieldName]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={(field) => {
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
                    key={`${fieldName}_${index}`}
                    className="flex items-center gap-4 py-2"
                  >
                    <CustomInputGroup
                      value={value}
                      input={input}
                      isValid={isValid}
                      onChange={(e) => handleChange(index, e.target.value)}
                      form={form}
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
                { withAddBtn && (<Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    disabled={isSubmitting}
                  >
                    <Plus size={18} className="mr-1" />
                  </Button>)}
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
