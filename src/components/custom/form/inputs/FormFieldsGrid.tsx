'use client'

import { JSX } from "react";
import { UseFormReturn } from "react-hook-form";
import { FieldProps } from "./base";
import { InputFactory } from "./input-factory";

interface Props {
  fields: Array<FieldProps | FieldProps[]>;
  form: UseFormReturn;
  readOnly?: boolean;
  isPending?: boolean;
  className?: string;
  gap?: string; // opcional, para espacio entre columnas
}

export const FormFieldsGrid = ({ fields, form, isPending, readOnly, className = "", gap = "gap-2" }: Props): JSX.Element => {
  return (
    <>
      {fields.map((input, idx) =>
        Array.isArray(input)
          ? 
          <span key={`field-group-${idx}`} className="w-full  flex flex-row justify-between py-3">
            {
              input.map((field, subIdx) => { 
                if (readOnly) field.disabled = readOnly
                return( 
                  <div key={subIdx} className="w-full px-2">
                    {InputFactory.create(field, form, isPending) }
                  </div>
                )
              })
            }
          </span>
          :
          (<span key={`field-group-${idx}`} className="flex flex-col justify-between py-3 w-full px-2"> 
            {InputFactory.create(input, form, isPending)}
          </span>)
      )}
    </>
  );
};
