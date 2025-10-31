import { FieldValues, FormState } from 'react-hook-form'
import { CustomAlert } from '@/src/components/custom/custom-alert'
import { FieldProps } from './definitions'

interface Props<T extends FieldValues = Record<string, any>> {
  formState: FormState<any> // 👈 aquí cambiamos
  fields: Array<FieldProps<T> | FieldProps<T>[]>
}

export const FormErrorsAlert = <T extends FieldValues = Record<string, any>>({
  formState,
  fields
}: Props<T>) => {

  const flatFields: FieldProps<T>[] = fields.flatMap(f => Array.isArray(f) ? f : [f]);

  return (
    <div style={{ marginTop: 4 }}>
      {Object.entries(formState.errors).length > 0 && (
        <CustomAlert
          title="Revisar los siguientes criterios"
          description={
            <ul>
              {Object.entries(formState.errors).map(([key, value]) => (
                <li key={key}>
                  <strong>{getFieldLabel<T>(key, flatFields)}:</strong>{" "}
                  {value?.message?.toString() ?? ''}
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
