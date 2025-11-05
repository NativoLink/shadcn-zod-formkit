// 'use client';

// import { JSX, ReactNode } from "react";
// import { UseFormReturn } from "react-hook-form";
// import { FieldProps } from "./base";
// import { InputFactory } from "./input-factory";

// interface Props<T extends Record<string, any> = Record<string, any>> {
//   fields: Array<FieldProps<T> | FieldProps<T>[]>;
//   form: UseFormReturn<any>;
//   readOnly?: boolean;
//   isPending?: boolean;
//   className?: string;
//   gap?: string; // opcional, para espacio entre columnas
// }

// const isRenderableChild = (c?: ReactNode | ((item: any, index: number) => ReactNode)) =>
//   c !== undefined && c !== null && typeof c !== "function";

// /**
//  * 📋 FormFieldsGrid
//  * Componente reutilizable para renderizar campos en una cuadrícula flexible.
//  * - Si un elemento del arreglo es un solo FieldProps → muestra en una línea.
//  * - Si es un arreglo de FieldProps → los muestra en una misma fila.
//  */
// export const FormFieldsGrid = <T extends Record<string, any> = Record<string, any>>({
//   fields,
//   form,
//   isPending,
//   readOnly,
//   className = "",
//   gap = "gap-2",
// }: Props<T>): JSX.Element => {
//   return (
//     <div className={`w-full grid grid-cols-1 ${gap} ${className}`}>
//       {fields.map((inputOrGroup, idx) =>
//         Array.isArray(inputOrGroup) ? (
//           <div
//             key={`field-group-${idx}`}
//             className="w-full flex flex-row items-start gap-4 py-3"
//           >
//             {inputOrGroup.map((field, subIdx) => {
//               // NO mutamos field: creamos una copia (inmutable)
//               const fieldCopy = {
//                 ...field,
//                 disabled: readOnly ? true : field.disabled,
//               };

//               const renderInlineChild =
//                 fieldCopy.childrenPosition !== "down" && isRenderableChild(fieldCopy.children);

//               const renderInlineChildDown =
//                 fieldCopy.childrenPosition === "down" && isRenderableChild(fieldCopy.children);

//               return (
//                 <div key={`field-${idx}-${subIdx}`} className="w-full px-2">
//                   {renderInlineChild && <>{fieldCopy.children}</>}
//                   {/*
//                     Pasamos children a InputFactory.create para que el componente concreto
//                     (p. ej. SortableListInput) lo use si es función render-prop.
//                     InputFactory.create signature se adapta abajo si es necesario.
//                   */}
//                   {InputFactory.create(fieldCopy, form, isPending)}
//                   {renderInlineChildDown && <>{fieldCopy.children}</>}
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div
//             key={`field-single-${idx}`}
//             className="flex flex-col justify-between py-3 w-full px-2"
//           >
//             {(() => {
//               const fieldCopy = {
//                 ...inputOrGroup,
//                 disabled: readOnly ? true : inputOrGroup.disabled,
//               };

//               const renderUp = fieldCopy.childrenPosition !== "down" && isRenderableChild(fieldCopy.children);
//               const renderDown = fieldCopy.childrenPosition === "down" && isRenderableChild(fieldCopy.children);

//               return (
//                 <>
//                   {renderUp && <>{fieldCopy.children}</>}
//                   {InputFactory.create(fieldCopy, form, isPending)}
//                   {renderDown && <>{fieldCopy.children}</>}
//                 </>
//               );
//             })()}
//           </div>
//         )
//       )}
//     </div>
//   );
// };