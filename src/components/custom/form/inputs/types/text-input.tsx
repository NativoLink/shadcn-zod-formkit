'use client'
import { JSX } from "react";
import { BaseInput } from "../base/base-input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";


export class TextInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return (
      <FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormControl className="shadow-lg">
              <Input className="min-w-[180px]" placeholder={input.placeHolder} {...field} type={input.keyboardType}
              disabled={input.disabled}/>
            </FormControl>
              {input.description && <FormDescription> {input.description} </FormDescription>}
            <FormMessage />
            {/* <pre> {JSON.stringify(field, null, 2)}</pre> */}
          </FormItem>
        )}
      />
    )
  }
}


