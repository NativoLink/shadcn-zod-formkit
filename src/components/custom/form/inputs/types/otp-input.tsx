'use client'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../../../../../components/ui"
import { BaseInput } from "../base";
import { JSX } from "react";



export class OTPInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;

    const totalPositions = Array.from({ length: input.min ?? 6 }, (_, i) => i);
    
    return (
      <FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormControl>
              <InputOTP maxLength={totalPositions.length} {...field}>
              <InputOTPGroup>
                {totalPositions.map((position) => (
                  <InputOTPSlot index={position} />
                ))}
                </InputOTPGroup>
                {/* <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup> */}
              </InputOTP>
            </FormControl>
            <FormDescription>{input.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
}

