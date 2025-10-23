'use client'
import { BaseInput } from "../base";
import { Card, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Switch } from "@/src/components/ui";
import { JSX } from "react";




export class SwitchInput extends BaseInput {
  render(): JSX.Element {
  const { input, form } = this;
  const className = input.className
    return (
      <FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <Card className={`${ className ? className : 'p-3 shadow-lg bg-blue-100/20'}`}>

            <FormItem className="flex flex-row items-center justify-between rounded-lg">
              <div className="space-y-0.5">
                <FormLabel><b>{input.label}</b></FormLabel>
                <FormDescription>{input.placeHolder ?? input.description}</FormDescription>
                <FormMessage />
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} aria-disabled  disabled={input.disabled}/>
            </FormControl>
          </FormItem>
          </Card>
        )}
      />
    )
  }
}

