'use client'
import { BaseInput, FieldProps, InputTypes } from "../base"
import { JSX } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui"
import { UseFormReturn } from "react-hook-form";
import { FieldTextGroup } from "./text-input-group";

export class NumberInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (<FieldNumber  form={form} input={input} isSubmitting={isSubmitting}/>)
    // <FormField
    //   key={input.name}
    //   control={form.control}
    //   name={input.name}
    //   render={({ field }) => (
    //     <FormItem >
    //       <FormLabel><b>{input.label}</b></FormLabel>
    //       <FormControl>
    //         <Input className="min-w-[180px] bg-white" placeholder={input.placeHolder} {...field} type="number"  disabled={input.disabled}/>
    //       </FormControl>
    //       <FormDescription>{input.description}</FormDescription>
    //       <FormMessage />
    //     </FormItem>
    //   )}
    // />
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean; // estado submit externo opcional
}

const FieldNumber = ({form, input, isSubmitting}:Props) => {
  const fielInput: FieldProps = { ...input, inputType: InputTypes.NUMBER }
  return (<FieldTextGroup input={fielInput} form={form}  isSubmitting={isSubmitting}/>)
}

