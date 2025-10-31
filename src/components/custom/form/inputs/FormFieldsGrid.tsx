'use client';

import { JSX } from "react";
import { UseFormReturn } from "react-hook-form";
import { FieldProps } from "./base";
import { InputFactory } from "./input-factory";

interface Props<T extends Record<string, any> = Record<string, any>> {
  fields: Array<FieldProps<T> | FieldProps<T>[]>;
  form: UseFormReturn<any>;
  readOnly?: boolean;
  isPending?: boolean;
  className?: string;
  gap?: string; // opcional, para espacio entre columnas
}

/**
 * 📋 FormFieldsGrid
 * Componente reutilizable para renderizar campos en una cuadrícula flexible.
 * - Si un elemento del arreglo es un solo FieldProps → muestra en una línea.
 * - Si es un arreglo de FieldProps → los muestra en una misma fila.
 */
export const FormFieldsGrid = <T extends Record<string, any> = Record<string, any>>({
  fields,
  form,
  isPending,
  readOnly,
  className = "",
  gap = "gap-2",
}: Props<T>): JSX.Element => {
  return (
    <div className={`w-full grid grid-cols-1 ${gap} ${className}`}>
      {fields.map((input, idx) =>
        Array.isArray(input) ? (
          <span
            key={`field-group-${idx}`}
            className="w-full flex flex-row justify-between py-3"
          >
            {input.map((field, subIdx) => {
              if (readOnly) field.disabled = true;
              return (
                <div key={subIdx} className="w-full px-2">
                  {InputFactory.create(field, form, isPending)}
                </div>
              );
            })}
          </span>
        ) : (
          <span
            key={`field-group-${idx}`}
            className="flex flex-col justify-between py-3 w-full px-2"
          >
            {InputFactory.create(input, form, isPending)}
          </span>
        )
      )}
    </div>
  );
};
