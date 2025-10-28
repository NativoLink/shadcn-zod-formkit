'use client'

import { JSX, useState } from "react";
import { BaseInput } from "../base/base-input";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/src/components/ui/form";
import { FieldProps } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";
import { Slider } from "@/src/components/ui/slider";
import { Card } from "@/src/components/ui";

export class SliderInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldSlider input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export const FieldSlider = ({ input, form, isSubmitting }: Props) => {
  // Valor inicial del slider
  const initialValue = form.getValues(input.name) ?? input.value ?? 0;
  const [value, setValue] = useState<number>(initialValue);

  const handleChange = (val: number) => {
    setValue(val);
    form.setValue(input.name, val);
  };

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field, fieldState }) => (
        <FormItem className={input.className}>
          <FormLabel><b>{input.label}</b></FormLabel>

          <FormControl>
            <Slider
              defaultValue={[initialValue]}
              value={[value]}
              max={input.max ?? 100}
              min={input.min ?? 0}
              step={1}
              className="w-[60%]"
              disabled={input.disabled || isSubmitting}
              onValueChange={(val) => handleChange(val[0])}
            />
          </FormControl>

          <div className="mt-2 text-sm text-gray-700">
            Valor actual: {value}
          </div>

          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
