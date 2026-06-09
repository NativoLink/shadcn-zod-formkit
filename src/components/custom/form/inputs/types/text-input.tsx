'use client'
import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps, handleOnChage, InputTypes } from "../base";


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

  const applyMask = (value: string, mask?: string | RegExp) => {  
    if (!mask) return value;  
      
    if (typeof mask === 'string') {  
      // Para máscaras de string como "###-###"  
      let result = '';  
      let valueIndex = 0;  
        
      for (let i = 0; i < mask.length && valueIndex < value.length; i++) {  
        if (mask[i] === '#') {  
          result += value[valueIndex++];  
        } else {  
          result += mask[i];  
        }  
      }  
      return result;  
    } else if (mask instanceof RegExp) {  
      // Para máscaras RegExp, filtrar caracteres  
      const matches = value.match(mask);  
      return matches ? matches.join('') : value;  
    }  
      
    return value;  
  }; 

  const applyTransform = (value: string) => {  
    const transform = input.inputGroupConfig?.transform || input.transform;
    if (!input.inputGroupConfig?.transform) return value;  
      
    if (typeof input.transform === 'function') {  
      return input.transform(value);  
    }  
      
    switch (transform) {  
      case 'uppercase':  
        return value.toUpperCase();  
      case 'lowercase':  
        return value.toLowerCase();  
      case 'capitalize':  
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();  
      case 'trim':  
        return value.trim();  
      default:  
        return value;  
    }  
  };  
  
  return <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field }) => (
      <FormItem className={input.className}>
        { !hidden && (<FormLabel><b>{input.label}</b></FormLabel>)}
        <FormControl className="shadow-lg">
          <Input className="min-w-[180px]" 
            autoCapitalize={input.autoCapitalize} 
            placeholder={input.placeHolder} {...field} type={type}
            onChange={(e) => {  
              let processedValue = e.target.value;  
              processedValue = applyMask(processedValue, input.mask);  
              const transformedValue = applyTransform(processedValue);  
              field.onChange(transformedValue);  
              handleOnChage(e, input, field);  
            }} 
            disabled={input.disabled || isSubmitting} />
        </FormControl>
        {input.description && <FormDescription> {input.description} </FormDescription>}
        <FormMessage />
        {/* <pre> {JSON.stringify(field, null, 2)}</pre> */}
      </FormItem>
    )} />;
}

