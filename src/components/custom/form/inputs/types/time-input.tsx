'use client'

import { JSX, useState, useEffect } from "react";
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
import { CircleCheck, CircleX, Loader2 } from "lucide-react";

export class TimeInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldTimeInput input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export const FieldTimeInput = ({ form, input, isSubmitting }: Props) => {
  const groupConfig = input.inputGroupConfig;
  const autoValidate = groupConfig?.autoValidIcons;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  const iconsRight = groupConfig?.iconsRight ?? [];
  const iconsLeft = groupConfig?.iconsLeft ?? [];
  const textLeft = groupConfig?.textLeft;
  const textRight = groupConfig?.textRight;

  // Estado local para manejar validez
  const [isValid, setIsValid] = useState<boolean>(() => {
    const value = form.getValues(input.name);
    const fieldState = form.getFieldState(input.name);
    return !fieldState.error && value !== undefined && value !== "";
  });

  // Estado local para la hora
  const [time, setTime] = useState<string>(() => form.getValues(input.name) ?? "");

  useEffect(() => {
    const fieldValue = form.getValues(input.name) ?? "";
    if (fieldValue !== time) setTime(fieldValue);
  }, [form.getValues(input.name)]);

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field, fieldState }) => {
        const validNow = !fieldState.error && field.value !== undefined && field.value !== "";
        if (validNow !== isValid) setIsValid(validNow);

        const handleChange = (val: string) => {
          setTime(val);
          field.onChange(val);
        };

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

                {/* Input de tipo time */}
                <InputGroupInput
                  type="time"
                  value={time}
                  disabled={input.disabled || isSubmitting}
                  onChange={(e) => handleChange(e.target.value)}
                />

                {/* Iconos derecha */}
                {(iconsRight.length > 0 || textRight || autoValidate) && (
                  <InputGroupAddon align="inline-end">
                    {textRight && <InputGroupText>{textRight}</InputGroupText>}
                    {iconsRight.map((IconComponent, index) => (
                      <IconComponent key={index} size={20} />
                    ))}

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

            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
