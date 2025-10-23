'use client'

import { JSX } from "react";
import { BaseInput } from "../base/base-input";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/src/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/components/ui/input-group";
import { FieldProps } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";

export class TextInputGroup extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return ( <FieldTextGroup input={input} form={form} /> )
  }
}

interface Props {
  form: UseFormReturn
  input: FieldProps
}

const FieldTextGroup = ({form, input}: Props) =>{
  const groupConfig = input.inputGroupConfig
  const iconsLeft   = groupConfig?.iconsLeft ?? [];
  const iconsRight  = groupConfig?.iconsRight ?? [];
  const textLeft    = groupConfig?.textLeft;
  const textRight   = groupConfig?.textRight;

  return (<FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormControl className="shadow-lg">
              <InputGroup>
                {/* Iconos izquierda */}
                {(iconsLeft.length > 0 || textLeft) && (
                  <InputGroupAddon>
                    <InputGroupText>{textLeft}</InputGroupText>
                    {iconsLeft.map((IconComponent, index) => (
                      <IconComponent key={index} size={20} />
                    ))}
                  </InputGroupAddon>
                )}

                {/* Input principal */}
                <InputGroupInput placeholder={input.placeHolder} {...field} />

                {/* Iconos derecha */}
                {(iconsRight.length > 0 || textRight) && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{textRight}</InputGroupText>
                    {iconsRight.map((IconComponent, index) => (
                      <IconComponent key={index} size={20} />
                    ))}
                  </InputGroupAddon>
                )}
              </InputGroup>
            </FormControl>

            {/* Descripción */}
            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />)
}
