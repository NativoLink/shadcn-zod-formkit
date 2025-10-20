'use client'
import { JSX } from "react";
import { BaseInput } from "../base/base-input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Textarea } from "../../../../../components/ui"


export class TextAreaInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return (
      <FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FormItem className="shadow-lg">
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormControl>
              <Textarea className="min-w-[260px] bg-white" placeholder={input.placeHolder} {...field} disabled={input.disabled}/>
            </FormControl>
            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
}


