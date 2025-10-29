'use client'
import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps, InputTypes } from "../base";


export class TextInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldText form={form} input={input} isSubmitting={isSubmitting} />
    )

  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean; // estado submit externo opcional
}

const FieldText = ({input, form, isSubmitting }: Props ): JSX.Element => {
  const hidden = input.hidden ?? input.inputType === InputTypes.HIDDEN;
  const type = hidden ? "hidden" : input.keyboardType || "text";
  return <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field }) => (
      <FormItem className={input.className}>
        { !hidden && (<FormLabel><b>{input.label}</b></FormLabel>)}
        <FormControl className="shadow-lg">
          <Input className="min-w-[180px]" placeholder={input.placeHolder} {...field} type={type}
            disabled={input.disabled || isSubmitting} />
        </FormControl>
        {input.description && <FormDescription> {input.description} </FormDescription>}
        <FormMessage />
        {/* <pre> {JSON.stringify(field, null, 2)}</pre> */}
      </FormItem>
    )} />;
}

