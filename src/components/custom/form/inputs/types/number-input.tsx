'use client'
import { BaseInput } from "../base"
import { JSX } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from "../../../../../components/ui"

export class NumberInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem >
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl>
            <Input className="min-w-[180px] bg-white" placeholder={input.placeHolder} {...field} type="number"  disabled={input.disabled}/>
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
}

