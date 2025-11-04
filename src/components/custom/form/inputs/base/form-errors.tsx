import { FieldValues, FormState } from "react-hook-form";
import { CustomAlert } from "@/src/components/custom/custom-alert";
import { FieldConfig, FieldProps } from "./definitions";

// ✅ mismo tipo recursivo que usamos antes


interface Props<T extends FieldValues = Record<string, any>> {
  formState: FormState<any>;
  fields: FieldConfig<T>[]; // 👈 ahora soporta anidación
}

/**
 * 🔁 Función recursiva para aplanar la estructura de campos
 */
const flattenFields = <T extends FieldValues>(
  fields: FieldConfig<T>[]
): FieldProps<T>[] => {
  const result: FieldProps<T>[] = [];

  for (const field of fields) {
    if (Array.isArray(field)) {
      result.push(...flattenFields(field));
    } else if ((field as any).fields) {
      // 👇 si el campo tiene subcampos, también los aplanamos
      result.push(...flattenFields((field as any).fields));
    } else {
      result.push(field);
    }
  }

  return result;
};

export const FormErrorsAlert = <T extends FieldValues = Record<string, any>>({
  formState,
  fields,
}: Props<T>) => {
  const flatFields = flattenFields(fields); // ✅ recursivo

  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <div style={{ marginTop: 4 }}>
      {hasErrors && (
        <CustomAlert
          title="Revisar los siguientes criterios"
          description={
            <ul>
              {Object.entries(formState.errors).map(([key, value]) => (
                <li key={key}>
                  <strong>{getFieldLabel<T>(key, flatFields)}:</strong>{" "}
                  {value?.message?.toString() ?? ""}
                </li>
              ))}
            </ul>
          }
          className="mb-4"
          variant="error"
        />
      )}
    </div>
  );
};

export const getFieldLabel = <T extends FieldValues>(
  fieldErrorKey: string,
  fields: ReadonlyArray<FieldProps<T>>
): string => {
  const foundField = fields.find((field) => field.name === fieldErrorKey);
  return foundField?.label ?? fieldErrorKey;
};
