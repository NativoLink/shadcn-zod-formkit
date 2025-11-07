import { JSX, ReactNode } from "react";

import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FieldProps, GroupedOption, InputOption } from "./definitions";
// import { FieldProps } from "./field-props";


export abstract class BaseInput {
  constructor(
    protected readonly input: FieldProps,
    protected readonly form: UseFormReturn,
    protected readonly isSubmitting?: boolean,
  ) {}

  abstract render(): JSX.Element;
}


export const entityToInputOption = (entitiy:any, name:string = 'name', description:string = 'description', groupedLabel?:string): InputOption => ({
  id: entitiy['id'],
  name: entitiy[name],
  description:  entitiy[description],
  groupedLabel
})

export const entitiesToInputOption = (data:any[], optionValue:string = 'name', groupedLabel?:string): InputOption[] => {
  const entities: InputOption[] = [];
  for (const key of data) {
    const entidad = entityToInputOption(key, optionValue, undefined, groupedLabel);
    if(entidad) entities.push(entidad);
  }
  return entities;
}
export const entityToGroupedOption = (entitiy:any, name:string = 'name'): GroupedOption => ({
  id: entitiy['id'],
  label: entitiy[name] || entitiy['label'],
  options: entitiy['options'] || [],
  selectedOptions: [],
})


export const entitiesToGroupedOption = (data:any[], optionValue:string = 'name' ): GroupedOption[] => {
  const entities: GroupedOption[] = [];
  for (const key of data) {
    const entidad = entityToGroupedOption(key, optionValue);
    if(entidad) entities.push(entidad);
  }
  return entities;
}

export const handleOnChage = (
  event: any[] | any,
  input: FieldProps,
  field?: ControllerRenderProps<FieldValues, string>
): void => {
  let value: any = event;

  // 🔹 Detecta si el valor viene de un input DOM normal
  if (event && typeof event === "object" && "target" in event) {
    value = (event.target as HTMLInputElement).value;
  }

  // 🔹 React Hook Form: actualiza el valor del campo
  field?.onChange(value);

  // 🔹 Obtiene los valores actuales del formulario
  const data = input.form?.getValues();

  // 🔹 Llama al callback específico del input (si existe)
  input.onChange?.(value, data);

  // 🔹 Callback global (si existe)
  input.onAnyFieldChange?.(data);
};

export const isValidField = (input: FieldProps, form: UseFormReturn, defaultValue?: any): boolean => {
    const value = defaultValue ?? form.getValues(input.name);
    const fieldState = form.getFieldState(input.name);
    
    // Si el campo tiene un esquema zod, validamos con él
    if (input.zodType) {
      const result = input.zodType.safeParse(value);
      return result.success;
    }
    // Si no tiene zodType, usamos la validación estándar de react-hook-form
    return !fieldState.error && value !== undefined && value !== "";
  }
