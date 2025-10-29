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
  TagInput,
  DateTimeInput,
  TimeInput,
  FileMultiUploadInput,
  SliderInput,
  ButtonGroupInput,
  // SwitchListInput, // ES LO MISMO QUE => GroupedSwitchInput
  // CheckListInput,
} from "./types";
import { JSX } from "react";
import z, { ZodObject, ZodTypeAny } from "zod";
import { AccordionGroupedSwitchInput } from "./types/accordion-grouped-switches";
import { Card } from '@/src/components/ui/card';


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
  [InputTypes.TEXTAREA]: TextAreaInput,
  [InputTypes.RADIO_GROUP]: RadioGroupInput,
  [InputTypes.TAGS]: TagInput,
  [InputTypes.DATE_TIME]: DateTimeInput,
  [InputTypes.TIME]: TimeInput,
  [InputTypes.FILE_MULTI_UPLOAD]: FileMultiUploadInput,
  [InputTypes.BUTTON_GROUP]: ButtonGroupInput,
  
  
  //ToDos: ============================================================
  [InputTypes.SLIDER]: SliderInput, //ToDo: // PENDIENTE ... VISUALMENTE NO SE VE BIEN.!!!
  [InputTypes.FORM]: TextInput,
  [InputTypes.HIDDEN]: TextInput,
  [InputTypes.CHECK_LIST]: TextInput,
  // [InputTypes.SWITCH_LIST]: SwitchListInput,

  // [InputTypes.RANGE]: TextInput,
  // [InputTypes.MULTISELECT]: TextInput,
  // [InputTypes.CURRENCY]: TextInput,
  
  // [InputTypes.IMAGE_UPLOAD]: TextInput,
  // [InputTypes.AUDIO_UPLOAD]: TextInput,
  // [InputTypes.VIDEO_UPLOAD]: TextInput,
  
  // [InputTypes.CREDIT_CARD]: TextInput,

};

export class InputFactory {
  static create(input: FieldProps, form: UseFormReturn, isSubmitting:boolean = false): JSX.Element {
    const inputType = (input.inputType as InputTypes) ?? InputTypes.TEXT;

    const InputClass = inputMap[inputType] ?? TextInput;
    const instance = new InputClass(input, form, isSubmitting);
    if (!input.wrapInCard) return instance.render();
    return (
      <Card className="p-4 space-y-3">
        {instance.render()}
      </Card>
      )
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


export const getDynamicSchema = (
  fields: Array<FieldProps | FieldProps[]>,
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[]
): ZodObject<any> => {

  const flatFields: FieldProps[] = fields.flatMap(f => Array.isArray(f) ? f : [f]);
  const shape: Record<string, ZodTypeAny> = {};

  flatFields.forEach(f => {
    shape[f.name] = f.zodType ?? z.any();
  });

  let schema = z.object(shape);

  // Aplica validaciones extra opcionales
  if (extraValidations && extraValidations.length > 0) {
    extraValidations.forEach(fn => {
      schema = fn(schema);
    });
  }

  return schema;
};