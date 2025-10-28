'use client'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui"
import { BaseInput, FieldProps } from "../base";
import { JSX } from "react";
import { UseFormReturn } from "react-hook-form";



export class OTPInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;    
    return (
      <FieldOTP form={form} input={input} isSubmitting={isSubmitting} />
    )

  }
}

interface Props {
  form: UseFormReturn
  input: FieldProps,
  isSubmitting?: boolean;
}

const FieldOTP = ({ form, input, isSubmitting }: Props ): JSX.Element => {

  const totalPositions = Array.from({ length: input.min ?? 6 }, (_, i) => i);
  
  return <FormField
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
                <InputOTPSlot key={position} index={position} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
        <FormDescription>{input.description}</FormDescription>
        <FormMessage />
      </FormItem>
    )} />;
}

