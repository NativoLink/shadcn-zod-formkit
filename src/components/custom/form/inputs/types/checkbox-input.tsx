'use client'

import { BaseInput, FieldProps } from "../base";
import { JSX } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";

export class CheckboxInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;

    return (
      <FieldCheckbox form={form} input={input} />
    );
  }
}


interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean; // estado submit externo opcional
}

const FieldCheckbox = ({ input, form }: Props) => {
  const className = input.className;
  return (
    <FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FormItem
            className={`hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 transition 
              has-[[aria-checked=true]]:border-blue-600 
              has-[[aria-checked=true]]:bg-blue-50 
              dark:has-[[aria-checked=true]]:border-blue-900 
              dark:has-[[aria-checked=true]]:bg-blue-950
              ${className ?? ""}`}
          >
            <FormControl>
              <Checkbox
                id={input.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={input.disabled}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white 
                  dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
            </FormControl>

            <div className="grid gap-1.5 font-normal">
              <FormLabel htmlFor={input.name} className="text-sm leading-none font-medium">
                {input.label ?? "Enable notifications"}
              </FormLabel>
              {(input.description || input.placeHolder) && (
                <FormDescription className="text-muted-foreground text-sm">
                  {input.description ?? input.placeHolder}
                </FormDescription>
              )}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
  )
}