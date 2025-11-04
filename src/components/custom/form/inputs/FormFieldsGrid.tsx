'use client';

import { JSX, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { FieldConfig, FieldProps } from "./base";
import { InputFactory } from "./input-factory";
import { z } from "zod";
import { User, Mail } from "lucide-react";

interface Props<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig<T>[];
  form: UseFormReturn<any>;
  readOnly?: boolean;
  isPending?: boolean;
  className?: string;
  gap?: string; // gap vertical entre filas
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
        ? "flex flex-col sm:flex-row sm:items-center sm:gap-x-4 gap-y-2 flex-wrap"
        : "flex flex-col gap-2";

    return (
      <div className={dirClass}>
        {renderUp && <>{fieldCopy.children}</>}
        {InputFactory.create(fieldCopy, form, isPending)}
        {renderDown && <>{fieldCopy.children}</>}
      </div>
    );
  };

  const renderColumn = (col: FieldConfig<T>[], parentKey = '') => {
  if (col.length === 0) return null;

  const colDirection = isFieldProps(col[0]) && col[0].direction === 'row'
    ? "flex flex-col sm:flex-row sm:items-center sm:gap-x-4 gap-y-2 flex-wrap"
    : "flex flex-col w-full";

  return (
    <div className={colDirection}>
      {col.map((item, idx) => {
        if (isFieldProps(item))
          return <div key={`${parentKey}${item.name.toString()}-${idx}`} className="flex-1 min-w-[200px]">{renderField(item)}</div>;
        if (Array.isArray(item)) return renderColumn(item, `${parentKey}col${idx}-`);
        return null;
      })}
    </div>
  );
};

  const renderRow = (row: FieldConfig<T>[], parentKey = '') => {
  if (row.length === 0) return null;

  return (
    <div className="w-full flex flex-col sm:flex-row sm:gap-x-4 gap-y-2 py-2 flex-wrap gap-4">
      {row.map((col, idx) => {
        if (isFieldProps(col)) return renderColumn([col], `${parentKey}row${idx}-`);
        if (Array.isArray(col)) return renderColumn(col, `${parentKey}row${idx}-`);
        return null;
      })}
    </div>
  );
};

  return (
  <div className={`w-full flex flex-col ${gap} ${className}`}>
    {fields.map((f, idx) => {
      if (isFieldProps(f)) return <div key={`field-${f.name.toString()}-${idx}`}>{renderField(f)}</div>;
      if (Array.isArray(f)) return <div key={`row-${idx}`}>{renderRow(f, `row-${idx}-`)}</div>;
      return null;
    })}
  </div>
);
};
