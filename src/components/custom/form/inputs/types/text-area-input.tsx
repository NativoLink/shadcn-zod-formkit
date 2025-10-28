'use client'
import { JSX } from "react";
import { BaseInput } from "../base/base-input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Textarea } from "@/src/components/ui"
import { UseFormReturn } from "react-hook-form";
import { FieldProps } from "../base";


export class TextAreaInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldTextArea form={form} input={input} isSubmitting={isSubmitting} />
    )

  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

function FieldTextArea({ form, input, isSubmitting }: Props): JSX.Element {
  return <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field }) => (
      <FormItem className="shadow-lg">
        <FormLabel><b>{input.label}</b></FormLabel>
        <FormControl>
          <Textarea className="min-w-[260px] bg-white" placeholder={input.placeHolder} {...field} disabled={input.disabled || isSubmitting} />
        </FormControl>
        {input.description && <FormDescription>{input.description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )} />;
}

