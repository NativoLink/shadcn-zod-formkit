'use client';

import { JSX, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { FieldConfig, FieldProps } from "./base";
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

const isFieldProps = <T extends Record<string, any>>(f: FieldConfig<T>): f is FieldProps<T> => !Array.isArray(f);

export const FormFieldsGrid = <T extends Record<string, any> = Record<string, any>>({
  fields,
  form,
  isPending,
  readOnly,
  className = "",
  gap = "gap-4",
}: Props<T>): JSX.Element => {

  const renderField = (field: FieldProps<T>) => {
    const fieldCopy: FieldProps<T> = { ...field, disabled: readOnly ? true : field.disabled };
    const renderUp = fieldCopy.childrenPosition !== "down" && isRenderableChild(fieldCopy.children);
    const renderDown = fieldCopy.childrenPosition === "down" && isRenderableChild(fieldCopy.children);

    const dirClass = fieldCopy.direction === 'row' ? 'flex flex-row items-center gap-4' : 'flex flex-col gap-2';

    return (
      <div className={`${dirClass} w-full`}>
        {renderUp && <>{fieldCopy.children}</>}
        {InputFactory.create(fieldCopy, form, isPending)}
        {renderDown && <>{fieldCopy.children}</>}
      </div>
    );
  };

  // Renderiza una columna
  const renderColumn = (col: FieldConfig<T>[]) => {
    if (col.length === 0) return null;

    const colDirection = isFieldProps(col[0]) && col[0].direction === 'row' ? 'flex flex-row gap-4' : 'flex flex-col gap-2';

    return (
      <div className={`${colDirection} flex-1`}>
        {col.map((item, idx) => {
          if (isFieldProps(item)) return renderField(item);
          if (Array.isArray(item)) return renderColumn(item); // sub-array → columna
          return null;
        })}
      </div>
    );
  };

  // Renderiza una fila (array de columnas)
  const renderRow = (row: FieldConfig<T>[]) => {
    if (row.length === 0) return null;

    return (
      <div className="w-full flex flex-row gap-4 py-2">
        {row.map((col, idx) => {
          // Normaliza: si es objeto suelto, lo metemos en array para tratarlo como columna
          if (isFieldProps(col)) return renderColumn([col]);
          if (Array.isArray(col)) return renderColumn(col);
          return null;
        })}
      </div>
    );
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {fields.map((f, idx) => {
        if (isFieldProps(f)) return <div key={idx}>{renderField(f)}</div>;
        if (Array.isArray(f)) return <div key={idx}>{renderRow(f)}</div>;
        return null;
      })}
    </div>
  );
};
