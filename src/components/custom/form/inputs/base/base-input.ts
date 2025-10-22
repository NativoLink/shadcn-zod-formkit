import { JSX } from "react";

import { UseFormReturn } from "react-hook-form";
import { FieldProps, GroupedOption, InputOption } from "./definitions";
// import { FieldProps } from "./field-props";


export abstract class BaseInput {
  constructor(
    protected readonly input: FieldProps,
    protected readonly form: UseFormReturn
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
})


export const entitiesToGroupedOption = (data:any[], optionValue:string = 'name' ): GroupedOption[] => {
  const entities: GroupedOption[] = [];
  for (const key of data) {
    const entidad = entityToGroupedOption(key, optionValue);
    if(entidad) entities.push(entidad);
  }
  return entities;
}