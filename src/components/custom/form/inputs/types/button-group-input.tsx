'use client'

import { JSX } from "react";
import { BaseInput, FieldProps, handleOnChage, InputOption } from "../base";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { ButtonGroup } from "@/src/components/ui/button-group";

interface Option {
  label: string;
  value: string | number;
}

export class ButtonGroupInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    const className = input.className
    return <FieldButtonGroup input={input} form={form} isSubmitting={isSubmitting}  className={className}/>;
  }
}

interface Props {
  input: FieldProps;
  form: UseFormReturn;
  isSubmitting?: boolean;
  className?: string;
}

export const FieldButtonGroup = ({ input, form, isSubmitting, className = "w-full flex-1" }: Props) => {
  const options: InputOption[] = (input.listConfig?.list ?? []).filter((option): option is InputOption => 'name' in option);

  const handleSelect = (value: any) => {
    form.setValue(input.name, value, { shouldValidate: true });
    if (input.listConfig?.onOptionChange)  input.listConfig.onOptionChange(value);
  };



  const selectedValue = form.watch(input.name);

  return (
        <ButtonGroup className="flex flex-row  w-full">
        {options.map((option, key) => (
          <Button
            type="button"
            className={className}
            key={`${input.name}-${key}-btn-g`}
            variant={selectedValue === option.value ? "default" : "outline"}
            onClick={() => {
              handleSelect(option.value)
              handleOnChage(option.value, input)
            }}
            disabled={isSubmitting}
          >
            {option.label ?? option.name }
          </Button>
        ))}
        </ButtonGroup>
  );
};
