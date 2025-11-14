'use client';

import { JSX, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { FieldConfig } from "./base";
import { InputFactory } from "./input-factory";

interface Props<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig<T>[];
  form: UseFormReturn<any>;
  readOnly?: boolean;
  isPending?: boolean;
  className?: string;
  gap?: string;
}

const isRenderableChild = (c?: ReactNode | ((item: any, index: number) => ReactNode)) =>
  c !== undefined && c !== null && typeof c !== "function";

const shouldShowField = (field: any, values: any): boolean => {
  if (typeof field.showWhen === "function") {
    try {
      return !!field.showWhen(values);
    } catch {
      return true; // fallback behavior
    }
  }
  return true;
};

export const FormFieldsGrid = <T extends Record<string, any> = Record<string, any>>({
  fields,
  form,
  isPending,
  readOnly,
  className = "",
  gap = "gap-2",
}: Props<T>): JSX.Element => {
  const values = form.watch(); // 🚀 valores actuales
  

  return (
    <div className={`w-full grid grid-cols-1 ${gap} ${className}`}>
      {fields.map((inputOrGroup, idx) => {
        
        // =============================================
        // 🔥 GRUPO DE CAMPOS [ field1, field2 ]
        // =============================================
        if (Array.isArray(inputOrGroup)) {
          const visibleFields = inputOrGroup.filter((f) =>
            shouldShowField(f, values)
          );

          if (visibleFields.length === 0) return null; // Oculta el grupo entero

          return (
            <div
              key={`field-group-${idx}`}
              className="w-full flex flex-row items-start gap-4 py-3"
            >
              {visibleFields.map((field, subIdx) => {
                const fieldCopy = {
                  ...(field as any),
                  disabled: readOnly ? true : (field as any).disabled,
                };

                const renderUp =
                  fieldCopy.childrenPosition !== "down" &&
                  isRenderableChild(fieldCopy.children);

                const renderDown =
                  fieldCopy.childrenPosition === "down" &&
                  isRenderableChild(fieldCopy.children);

                return (
                  <div key={`field-${idx}-${subIdx}`} className="w-full px-2">
                    {renderUp && <>{fieldCopy.children}</>}

                    {InputFactory.create(fieldCopy, form, isPending)}

                    {renderDown && <>{fieldCopy.children}</>}
                  </div>
                );
              })}
            </div>
          );
        }

        // =============================================
        // 🔥 CAMPO ÚNICO
        // =============================================
        if (!shouldShowField(inputOrGroup, values)) return null;

        const fieldCopy = {
          ...(inputOrGroup as any),
          disabled: readOnly ? true : (inputOrGroup as any).disabled,
        };

        const renderUp =
          fieldCopy.childrenPosition !== "down" &&
          isRenderableChild(fieldCopy.children);

        const renderDown =
          fieldCopy.childrenPosition === "down" &&
          isRenderableChild(fieldCopy.children);

        return (
          <div
            key={`field-single-${idx}`}
            className="flex flex-col justify-between py-3 w-full px-2"
          >
            {renderUp && <>{fieldCopy.children}</>}

            {InputFactory.create(fieldCopy, form, isPending)}

            {renderDown && <>{fieldCopy.children}</>}
          </div>
        );
      })}
    </div>
  );
};
