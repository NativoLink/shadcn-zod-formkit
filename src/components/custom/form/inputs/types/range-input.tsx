"use client"

import { JSX, useState } from "react";
import { BaseInput, FieldProps, handleOnChage, isValidField } from "../base";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Slider } from "@/src/components/ui/slider";
import { InputGroup, InputGroupText } from "@/src/components/ui/input-group";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";

interface RangeValue {
  min: number;
  max: number;
}

export class RangeInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldRange input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export const FieldRange = ({ input, form, isSubmitting }: Props) => {
  const [isValid, setIsValid] = useState<boolean>(isValidField(input, form));
  const groupConfig = input.inputGroupConfig;
  const autoValidate = groupConfig?.autoValidIcons ?? input.zodType ? true : false;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  const iconsRight = groupConfig?.iconsRight ?? [];
  const textRight = groupConfig?.textRight;

  // Valores por defecto
  const minValue = input.min ?? 0;
  const maxValue = input.max ?? 100;
  const step = input.step ?? 1;

  // Valor inicial del range
  const initialValue = form.getValues(input.name) ?? input.value ?? [minValue, maxValue];
  const [value, setValue] = useState<number[]>(Array.isArray(initialValue) ? initialValue : [minValue, maxValue]);

  const handleChange = (val: number[]) => {
    setValue(val);
    const rangeValue: RangeValue = { min: val[0], max: val[1] };
    // handleOnChage(rangeValue, input, { onChange: (v) => form.setValue(input.name, v) });
  };

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field, fieldState }) => {
        setIsValid(isValidField(input, form));

        return (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>

            <FormControl>
              <div className="space-y-4">
                <Slider
                  value={value}
                  onValueChange={handleChange}
                  max={maxValue}
                  min={minValue}
                  step={step}
                  className="w-full"
                />

                <InputGroup className="flex flex-row gap-1 justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Min:</span>
                    <InputGroupText className="min-w-[60px] text-center">
                      {value[0]}
                    </InputGroupText>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Max:</span>
                    <InputGroupText className="min-w-[60px] text-center">
                      {value[1]}
                    </InputGroupText>
                  </div>

                  {(iconsRight.length > 0 || textRight || autoValidate) && (
                    <>
                      {textRight && <InputGroupText>{textRight}</InputGroupText>}
                      {iconsRight.map((IconComponent, index) => (
                        <IconComponent key={index} size={24} className="w-6! h-6!" />
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
                    </>
                  )}
                </InputGroup>
              </div>
            </FormControl>

            <FormDescription>{input.description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};