"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form"
import { BaseInput, FieldProps } from "../base"
import { JSX } from "react"
import { ColorCnInput } from "../../../../../components/ui/color-input"
import { UseFormReturn } from "react-hook-form"


export class ColorInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return (
      <FieldColor input={input} form={form} />
    )
  }
}
interface Props {
  form: UseFormReturn
  input: FieldProps
}

const  FieldColor = ({ form, input }: Props) => {
  return (
    <FormField
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem >
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl>
            <ColorCnInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={input.disabled}
              placeholder={input.placeHolder}
            />
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}


