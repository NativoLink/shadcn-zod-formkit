'use client'
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldConfig, FieldProps, InputTypes } from "./base";
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
  CurrencyInput,
  KeyValueListInput,
  RepeaterInput,
  MultiSelectInput,
  ComboboxInput,
  SortableListInput,
  RepeaterTabsInput,
  StringValueListInput,
  // ✨ New input types (v1.35.0)
  RatingInput,
  PhoneInput,
  UrlInput,
  PasswordInput,
  AutocompleteInput,
  // ✨ New input types (v1.36.0)
  EmailInput,
  LocationPickerInput,
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
  [InputTypes.CURRENCY]: CurrencyInput,
  [InputTypes.KEY_VALUE]: KeyValueListInput,
  [InputTypes.REPEATER]: RepeaterInput,
  [InputTypes.MULTI_SELECT]: MultiSelectInput,
  [InputTypes.COMBOBOX]: ComboboxInput,
  [InputTypes.SORTABLE_LIST]: SortableListInput,
  [InputTypes.REPEATER_TABS]: RepeaterTabsInput,
  [InputTypes.STRING_LIST]: StringValueListInput,
  
  // ✨ New input types (v1.35.0)
  [InputTypes.RATING]: RatingInput,
  [InputTypes.PHONE]: PhoneInput,
  [InputTypes.URL]: UrlInput,
  [InputTypes.PASSWORD]: PasswordInput,
  [InputTypes.AUTOCOMPLETE]: AutocompleteInput,
  
  // ✨ New input types (v1.36.0)
  [InputTypes.EMAIL]: EmailInput,
  [InputTypes.SEARCH]: TextInput, // TODO: Implement SearchInput
  [InputTypes.LOCATION_PICKER]: LocationPickerInput,
  
  //ToDos: ============================================================
  [InputTypes.SLIDER]: SliderInput, //ToDo: // PENDIENTE ... VISUALMENTE NO SE VE BIEN.!!!
  [InputTypes.FORM]: TextInput,
  [InputTypes.HIDDEN]: TextInput,
  [InputTypes.CHECK_LIST]: TextInput,
  // [InputTypes.SWITCH_LIST]: SwitchListInput,

  // [InputTypes.RANGE]: TextInput,
  // [InputTypes.MULTISELECT]: TextInput,
  
  // [InputTypes.IMAGE_UPLOAD]: TextInput,
  // [InputTypes.AUDIO_UPLOAD]: TextInput,
  // [InputTypes.VIDEO_UPLOAD]: TextInput,
  
  // [InputTypes.CREDIT_CARD]: TextInput,

};

export class InputFactory {
  static create<T extends Record<string, any> = Record<string, any>>(
    input: FieldProps<T>,
    form: UseFormReturn<T>,
    isSubmitting: boolean = false
  ): JSX.Element {
    input.form  = form
    const inputType = (input.inputType as InputTypes) ?? InputTypes.TEXT;

    const InputClass = (inputMap[inputType] ??
      TextInput) as new (
      input: FieldProps<T>,
      form: UseFormReturn<T>,
      isSubmitting: boolean
    ) => { render: () => JSX.Element };

    const instance = new InputClass(input, form, isSubmitting);

    if (!input.wrapInCard) return instance.render();

    return (
      <Card className="p-4 space-y-3">
        {instance.render()}
      </Card>
    );
  }
}

export function getDefaultValues<T extends Record<string, any>>(
  entity?: Partial<T>,
  fields?: FieldConfig<T>[]
): Record<string, any> {
  const defaults: Record<string, any> = {};

  if (entity) {
    Object.entries(entity).forEach(([key, value]) => {
      defaults[key] = value ?? "";
    });
  }

  if (fields) {
    const flatFields = flattenFields(fields); // ✅ aplanado recursivo completo
    for (const field of flatFields) {
      const key = field.name as string;
      if (defaults[key] === undefined) {
        defaults[key] = field.value ?? field.defaultValue ?? "";
      }
    }
  }

  return defaults;
}



const flattenFields = <T extends Record<string, any>>(fields: FieldConfig<T>[]): FieldProps<T>[] => {
  const result: FieldProps<T>[] = [];

  for (const field of fields) {
    if (Array.isArray(field)) {
      result.push(...flattenFields(field));
    } else if ((field as any).fields) {
      result.push(...flattenFields((field as any).fields));
    } else {
      result.push(field);
    }
  }

  return result;
};

export const getDynamicSchema = <T extends Record<string, any>>(
  fields: FieldConfig<T>[],
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[]
): ZodObject<Record<keyof T, ZodTypeAny>> => {

  // 🔁 aplanamos el árbol completo de campos
  const flatFields = flattenFields(fields);

  // // 🔥 Filtrar solo los visibles
  // const visibleFields = flatFields.filter(f =>
  //   !f.showWhen || f.showWhen(values)
  // );


  // 🎯 construimos el shape del schema
  const shape = flatFields.reduce((acc, f) => {
    acc[f.name as keyof T] = f.zodType ?? z.any();
    return acc;
  }, {} as Record<keyof T, ZodTypeAny>);

  let schema: ZodObject<Record<keyof T, ZodTypeAny>> = z.object(shape);

  // ⚙️ Aplicar validaciones adicionales si las hay
  if (extraValidations?.length) {
    for (const fn of extraValidations) {
      schema = fn(schema);
    }
  }

  return schema;
};