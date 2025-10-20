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
  // SwitchListInput, // ES LO MISMO QUE => GroupedSwitchInput
  // CheckListInput,
} from "./types";
import { JSX } from "react";
import z, { ZodObject, ZodTypeAny } from "zod";


type InputClassConstructor = new (
  input: FieldProps,
  form: UseFormReturn
) => BaseInput;


const inputMap: Record<InputTypes, InputClassConstructor> = {
  [InputTypes.TEXT]: TextInput,
  [InputTypes.SWITCH]: SwitchInput,
  [InputTypes.COLOR]: ColorInput,
  [InputTypes.DATE]: DateInput,
  [InputTypes.NUMBER]: NumberInput,
  [InputTypes.SELECT]: SelectInput,
  [InputTypes.GROUPED_SWITCH_LIST]: GroupedSwitchInput,
  [InputTypes.OTP]: OTPInput,
  [InputTypes.FILE]: FileInput,
  [InputTypes.HIDDEN]: TextInput, //ToDo: // puedes asignar algo genérico
  [InputTypes.CHECK_LIST]: TextInput, //ToDo:
  // [InputTypes.SWITCH_LIST]: SwitchListInput, //ToDo:
  [InputTypes.TEXTAREA]: TextAreaInput,
  [InputTypes.FORM]: TextInput, //ToDo:
};

export class InputFactory {
  static create(input: FieldProps, form: UseFormReturn): JSX.Element {
    const inputType = (input.inputType as InputTypes) ?? InputTypes.TEXT;

    const InputClass = inputMap[inputType] ?? TextInput;
    const instance = new InputClass(input, form);
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

  const mapType = (f: FieldProps): ZodTypeAny => {
    let zf: z.ZodType<any>;

    if (f.ZodTypeAny) return f.ZodTypeAny;

    switch (f.inputType) {
      case "date":
        zf = z.coerce.date();
        break;

      case "otp":
        zf = z.string().min(4, "OTP mínimo 4 caracteres").max(10, "OTP máximo 10 caracteres");
        break;

      case "select":
        zf = z.string().min(1, "Selecciona un valor");
        break;

      case "number":
        zf = z.number();
        if (f.min !== undefined) zf = (zf as z.ZodNumber).min(f.min, `Mínimo ${f.min}`);
        if (f.max !== undefined) zf = (zf as z.ZodNumber).max(f.max, `Máximo ${f.max}`);
        break;

      // case "email":
      //   zf = z.string().email("Email inválido");
      //   break;

      // case "url":
      //   zf = z.string().url("URL inválida");
      //   break;
      
        case "file":
        zf = z.any().refine(
          (file) => {
            if (!file) return true; // ✅ si no hay archivo, pasa
            return (
              file.size <= 25 * 1024 * 1024 &&
              ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
            );
          },
          { message: "El archivo no puede ser mayor de 25MB y solo JPG/PNG/GIF son permitidos" }
        );
        break;

      case "text":
      default:
        zf = z.string();
        const zff = (zf as z.ZodString)
        if (f.required) zf = zff.min(1, "Campo obligatorio");
        if (f.min !== undefined) zf = zff.min(f.min, `Mínimo ${f.min} caracteres`);
        if (f.max !== undefined) zf = zff.max(f.max, `Máximo ${f.max} caracteres`);
        // if (f.pattern) zf = zff.regex(f.pattern, "Formato inválido");
        // if (f.email) zf = zff.email("Email inválido");
        // if (f.url) zf = zff.url("URL inválida");
        break;
    }

    return f.required ? zf : zf.optional();
  };

  const flatFields: FieldProps[] = fields.flatMap(f => Array.isArray(f) ? f : [f]);
  const shape: Record<string, ZodTypeAny> = {};

  flatFields.forEach(f => {
    shape[f.name] = mapType(f);
  });

  return z.object(shape);
};