'use client'
import { JSX, ChangeEvent } from "react";
import { BaseInput, handleOnChage } from "../base/base-input"
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
      <FormItem className={`shadow-lg ${input.withLateralLabel ? 'flex items-center gap-2' : ''} ${input.className}`}>
        <FormLabel className={`${input.withLateralLabel ? 'w-32 text-right' : ''}`}><b>{input.label}</b></FormLabel>
        <FormControl>
          <Textarea className="min-w-[260px]" 
          placeholder={input.placeHolder} 
          {...field} 
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            handleOnChage(event, input, field)
          }}
          disabled={input.disabled || isSubmitting} />
        </FormControl>
        {input.description && <FormDescription>{input.description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )} />;
}

