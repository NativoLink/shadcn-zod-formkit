'use client'

import { JSX } from "react";
import { BaseInput, FieldProps, InputOption } from "../base";
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
    return <FieldButtonGroup input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  input: FieldProps;
  form: UseFormReturn;
  isSubmitting?: boolean;
}

export const FieldButtonGroup = ({ input, form, isSubmitting }: Props) => {
  const options: InputOption[] = (input.listConfig?.list ?? []).filter((option): option is InputOption => 'name' in option);

  const handleSelect = (value: any) => {
    form.setValue(input.name, value, { shouldValidate: true });
  };

  const selectedValue = form.watch(input.name);

  return (
    // <div className="flex flex-col gap-1 w-full">
    //   <label className="font-semibold">{input.label}</label>
    //   <div className="flex flex-wrap gap-2">
        <ButtonGroup>
        {options.map((option) => (
          <Button
            type="button"
            key={option.value}
            variant={selectedValue === option.value ? "default" : "outline"}
            onClick={() => handleSelect(option.value)}
            disabled={isSubmitting}
          >
            {option.label ?? option.name }
          </Button>
        ))}
        </ButtonGroup>
    //   </div>
    //   {input.description && <p className="text-sm text-muted-foreground">{input.description}</p>}
    // </div>
  );
};
