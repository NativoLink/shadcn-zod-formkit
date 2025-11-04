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

    // Layout responsive: columna por defecto, fila en sm+ si direction es row
    const dirClass =
      fieldCopy.direction === "row"
        ? "flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full flex-wrap"
        : "flex flex-col gap-2 w-full";

    return (
      <div className={dirClass}>
        {renderUp && <>{fieldCopy.children}</>}
        {InputFactory.create(fieldCopy, form, isPending)}
        {renderDown && <>{fieldCopy.children}</>}
      </div>
    );
  };

  const renderColumn = (col: FieldConfig<T>[]) => {
    if (col.length === 0) return null;

    const colDirection = isFieldProps(col[0]) && col[0].direction === 'row'
      ? "flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full flex-wrap"
      : "flex flex-col gap-2 w-full";

    return (
      <div className={colDirection}>
        {col.map((item, idx) => {
          if (isFieldProps(item)) return renderField(item);
          if (Array.isArray(item)) return renderColumn(item);
          return null;
        })}
      </div>
    );
  };

  const renderRow = (row: FieldConfig<T>[]) => {
    if (row.length === 0) return null;

    return (
      <div className="w-full flex flex-col sm:flex-row sm:gap-4 py-2 flex-wrap">
        {row.map((col, idx) => {
          if (isFieldProps(col)) return renderColumn([col]);
          if (Array.isArray(col)) return renderColumn(col);
          return null;
        })}
      </div>
    );
  };

  return (
    <div className={`w-full flex flex-col ${gap} ${className}`}>
      {fields.map((f, idx) => {
        if (isFieldProps(f)) return <div key={idx}>{renderField(f)}</div>;
        if (Array.isArray(f)) return <div key={idx}>{renderRow(f)}</div>;
        return null;
      })}
    </div>
  );
};
