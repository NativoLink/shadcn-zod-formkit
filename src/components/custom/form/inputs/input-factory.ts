'use client'
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps, InputTypes } from "./base";
import { 
  TextInput,
  SelectInput,
  ColorInput,
  DateInput,
  NumberInput,
  SwitchInput,
  GroupedSwitchInput,
  OTPInput,
  FileInput,
  TextAreaInput,
  TextInputGroup,
  CheckboxInput,
  SimpleCheckListInput,
  RadioGroupInput,
  // SwitchListInput, // ES LO MISMO QUE => GroupedSwitchInput
  // CheckListInput,
} from "./types";
import { JSX } from "react";
import z, { ZodObject, ZodTypeAny } from "zod";
import { AccordionGroupedSwitchInput } from "./types/accordion-grouped-switches";


type InputClassConstructor = new (
  input: FieldProps,
  form: UseFormReturn,
  isSubmitting?: boolean
) => BaseInput;


const inputMap: Record<InputTypes, InputClassConstructor> = {
  [InputTypes.TEXT_GROUP]: TextInputGroup,
  [InputTypes.TEXT]: TextInput,
  [InputTypes.SWITCH]: SwitchInput,
  [InputTypes.COLOR]: ColorInput,
  [InputTypes.DATE]: DateInput,
  [InputTypes.NUMBER]: NumberInput,
  [InputTypes.SELECT]: SelectInput,
  [InputTypes.GROUPED_SWITCH_LIST]: GroupedSwitchInput,
  [InputTypes.ACCORDION_GROUPED_SWITCH_LIST]: AccordionGroupedSwitchInput,
  [InputTypes.CHECKBOX]: CheckboxInput,
  [InputTypes.OTP]: OTPInput,
  [InputTypes.FILE]: FileInput,
  [InputTypes.SIMPLE_CHECK_LIST]: SimpleCheckListInput,
  [InputTypes.HIDDEN]: TextInput, //ToDo: // puedes asignar algo genérico
  [InputTypes.CHECK_LIST]: TextInput, //ToDo:
  // [InputTypes.SWITCH_LIST]: SwitchListInput, //ToDo:
  [InputTypes.TEXTAREA]: TextAreaInput,
  [InputTypes.FORM]: TextInput, //ToDo:
  [InputTypes.RADIO_GROUP]: RadioGroupInput, //ToDo:
};

export class InputFactory {
  static create(input: FieldProps, form: UseFormReturn, isSubmitting:boolean = false): JSX.Element {
    const inputType = (input.inputType as InputTypes) ?? InputTypes.TEXT;

    const InputClass = inputMap[inputType] ?? TextInput;
    const instance = new InputClass(input, form, isSubmitting);
    return instance.render()
  }
}

export function getDefaultValues<T extends Record<string, any>>(entity: T): Record<string, any> {
  const defaults: Record<string, any> = {};

  for (const key in entity) {
    const value = entity[key];

    if (value === null || value === undefined) {
      defaults[key] = ""; // Valor vacío por defecto
      continue;
    }

    switch (typeof value) {
      case "string":
        defaults[key] = value ?? "";
        break;

      case "number":
        defaults[key] = value ?? 0;
        break;

      case "boolean":
        defaults[key] = value ?? false;
        break;

      case "object":
        // Si es un array o un objeto, clonamos
        if (Array.isArray(value)) {
          defaults[key] = [...value];
        } else {
          defaults[key] = { ...value };
        }
        break;

      default:
        defaults[key] = value;
    }
  }

  return defaults;
}


export const getDynamicSchema = (fields: Array<FieldProps | FieldProps[]>): ZodObject<any> => {

  const flatFields: FieldProps[] = fields.flatMap(f => Array.isArray(f) ? f : [f]);
  const shape: Record<string, ZodTypeAny> = {};

  flatFields.forEach(f => {
    shape[f.name] = f.zodTypeAny ?? z.any();
  });

  return z.object(shape);
};