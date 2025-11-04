'use client';

import { JSX, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { FieldConfig, FieldProps } from "./base";
import { InputFactory } from "./input-factory";

interface Props<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig<T>[]; // ✅ tipo recursivo correcto
  form: UseFormReturn<any>;
  readOnly?: boolean;
  isPending?: boolean;
  className?: string;
  gap?: string;
}

const isRenderableChild = (
  c?: ReactNode | ((item: any, index: number) => ReactNode)
) => c !== undefined && c !== null && typeof c !== "function";

// ✅ Type guard para saber si es FieldProps o un array
const isFieldProps = <T extends Record<string, any>>(f: FieldConfig<T>): f is FieldProps<T> => {
  return !Array.isArray(f);
};

export const FormFieldsGrid = <
  T extends Record<string, any> = Record<string, any>
>({
  fields,
  form,
  isPending,
  readOnly,
  className = "",
  gap = "gap-2",
}: Props<T>): JSX.Element => {

  // 🔹 Render de un campo individual
  const renderField = (field: FieldProps<T>) => {
    const fieldCopy: FieldProps<T> = {
      ...field,
      disabled: readOnly ? true : field.disabled,
    };

    const renderUp =
      fieldCopy.childrenPosition !== "down" &&
      isRenderableChild(fieldCopy.children);
    const renderDown =
      fieldCopy.childrenPosition === "down" &&
      isRenderableChild(fieldCopy.children);

    const dirClass =
      fieldCopy.direction === "row"
        ? "flex flex-row items-center gap-4 w-full px-2"
        : "flex flex-col gap-2 w-full px-2";

    return (
      <div className={dirClass}>
        {renderUp && <>{fieldCopy.children}</>}
        {InputFactory.create(fieldCopy, form, isPending)}
        {renderDown && <>{fieldCopy.children}</>}
      </div>
    );
  };

  // 🔹 Render de un grupo de campos
  const renderGroup = (
    group: FieldConfig<T>[],
    groupDirection: "row" | "col" = "row"
  ) => {
    const dirClass =
      groupDirection === "row"
        ? "flex flex-row items-start gap-4 py-3 w-full"
        : "flex flex-col gap-4 py-3 w-full";

    return (
      <div className={dirClass}>
        {group.map((f, idx) =>
          isFieldProps(f)
            ? renderField(f)
            : Array.isArray(f)
            ? // ⚠ Solo soportamos [[FieldProps]] como subgrupo
              <div key={idx} className="w-full flex flex-row items-start gap-4">
                {f.map(subField =>
                  isFieldProps(subField) ? renderField(subField) : null
                )}
              </div>
            : null
        )}
      </div>
    );
  };

  return (
    <div className={`w-full grid grid-cols-1 ${gap} ${className}`}>
      {fields.map((f, idx) => {
        if (isFieldProps(f)) {
          return renderField(f);
        } else if (Array.isArray(f)) {
          // Si es [[FieldProps]] → grupo anidado
          if (f.length > 0 && Array.isArray(f[0])) {
            return (
              <div key={idx} className="flex flex-col gap-4 py-3">
                {f.map((subGroup, subIdx) => (
                  <div
                    key={subIdx}
                    className="w-full flex flex-row items-start gap-4"
                  >
                    {Array.isArray(subGroup) &&
                      subGroup.map((subField: FieldConfig<T>) =>
                        isFieldProps(subField) ? renderField(subField) : null
                      )}
                  </div>
                ))}
              </div>
            );
          } else {
            // fila simple, usamos direction del primer campo como referencia
            const firstField = f[0] as FieldProps<T>;
            const direction = firstField?.direction ?? "row";
            return <div key={idx}>{renderGroup(f, direction)}</div>;
          }
        }
        return null;
      })}
    </div>
  );
};
