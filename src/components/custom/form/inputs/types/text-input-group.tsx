'use client'

import { JSX, useState } from "react";
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
import { CircleCheck, CircleX, Info, Loader2 } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";

export class TextInputGroup extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldTextGroup input={input} form={form}  isSubmitting={isSubmitting}/>;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean; // estado submit externo opcional
}

export const FieldTextGroup = ({ form, input, isSubmitting }: Props) => {
  const groupConfig = input.inputGroupConfig;
  const infoTooltip = input?.infoTooltip;
  const autoValidate = groupConfig?.autoValidIcons;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  const iconsRight = groupConfig?.iconsRight ?? [];
  const iconsLeft = groupConfig?.iconsLeft ?? [];
  const textLeft = groupConfig?.textLeft;
  const textRight = groupConfig?.textRight;

  // Estado local para manejar validez desde el primer render
  const [isValid, setIsValid] = useState<boolean>(() => {
    const value = form.getValues(input.name);
    const fieldState = form.getFieldState(input.name);
    return !fieldState.error && value !== undefined && value !== "";
  });

  const formField = <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field, fieldState }) => {
      // Actualiza validez dinámicamente
      const validNow = !fieldState.error && field.value !== undefined && field.value !== "";
      if (validNow !== isValid) setIsValid(validNow);

      return (
        <FormItem className={input.className}>
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl className="shadow-lg">
            <InputGroup>

              {/* Iconos izquierda */}
              {(iconsLeft.length > 0 || textLeft) && (
                <InputGroupAddon>
                  {textLeft && <InputGroupText>{textLeft}</InputGroupText>}
                  {iconsLeft.map((IconComponent, index) => (
                    <IconComponent key={index} size={20} />
                  ))}
                </InputGroupAddon>
              )}

              {/* Input principal */}
              <InputGroupInput
                placeholder={input.placeHolder}
                disabled={input.disabled || isSubmitting}
                {...field}
                type={input.keyboardType} />

              {/* Iconos derecha */}
              {(iconsRight.length > 0 || textRight || autoValidate || infoTooltip) && (
                <InputGroupAddon align="inline-end">
                  {infoTooltip && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{infoTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    )
                  }
                  {textRight && <InputGroupText>{textRight}</InputGroupText>}
                  {iconsRight.map((IconComponent, index) => (
                    <IconComponent key={index} size={20} />
                  ))}

                  {/* Icono de validación / loading */}
                  {autoValidate && (
                    <div>
                      {isSubmitting
                        ? iconLoadingState
                        : isValid
                          ? iconValidState
                          : iconInvalidState}
                    </div>
                  )}
                </InputGroupAddon>
              )}

            </InputGroup>
          </FormControl>

          {/* Descripción */}
          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      );
    } } />;
    
  return <>{formField}</>;

};
