'use client'

import { JSX } from "react";
import { BaseInput } from "../base/base-input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { FieldProps } from "../base/definitions";
import { Plus, Trash2 } from "lucide-react";
import { FormFieldsGrid } from "../FormFieldsGrid";

export class RepeaterInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldRepeater form={form} input={input} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps
  isSubmitting?: boolean;
}

export const FieldRepeater = ({ form, input, isSubmitting }: Props) => {
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: input.name,
  });

  const canAdd = !input.maxItems || fields.length < input.maxItems;
  const canRemove = fields.length > (input.minItems ?? 0);

  return (
    <FormField
      control={control}
      name={input.name}
      render={() => (
        <FormItem className={input.className}>
          <FormLabel><b>{input.label}</b></FormLabel>

          <FormControl>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="border p-3 rounded-md flex flex-col gap-3"
                >

                  {/* <FormFieldsGrid fields={input?.repeaterFields ?? []} form={form} /> */}
                  {input.repeaterFields?.map((fieldGroup, groupIndex) => {
                    // Si el elemento es un array → varios campos en una línea
                    const group =
                      Array.isArray(fieldGroup) ? fieldGroup : [fieldGroup];
                    const cols = group.length;

                    return (
                      <div
                        key={groupIndex}
                        className={`grid gap-3 grid-cols-${cols}`}
                      >
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

                  {/* Botón eliminar */}
                  {canRemove && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="self-end"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              ))}

              {/* Botón agregar */}
              {canAdd && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => append({})}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Agregar
                </Button>
              )}
            </div>
          </FormControl>

          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};