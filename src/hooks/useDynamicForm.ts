'use client';

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { z, ZodObject } from "zod";
import { FieldConfig, flattenFields } from "@/src/components/custom/form/inputs/base";
import { getDynamicSchema, getDefaultValues } from "@/src/components/custom/form/inputs/input-factory";

interface UseDynamicFormOptions<T extends Record<string, any>> {
  fields: FieldConfig<T>[];
  record?: Partial<T>;
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[];
  onAnyFieldChange?: (data: Record<string, any>) => void;
}

interface UseDynamicFormReturn<T> {
  form: UseFormReturn<any>;
  schema: ZodObject<any>;
  handleSubmit: (onSubmit: (data: T) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  reset: (data?: Partial<T>) => void;
  watch: UseFormReturn<any>["watch"];
  setValue: UseFormReturn<any>["setValue"];
  getValues: UseFormReturn<any>["getValues"];
}

/**
 * Custom hook for managing dynamic forms
 * 
 * @example
 * ```tsx
 * const { form, handleSubmit } = useDynamicForm({
 *   fields: myFields,
 *   record: initialData,
 * });
 * 
 * const onSubmit = handleSubmit((data) => {
 *   console.log(data);
 * });
 * ```
 */
export function useDynamicForm<T extends Record<string, any>>({
  fields,
  record = {},
  extraValidations,
  onAnyFieldChange,
}: UseDynamicFormOptions<T>): UseDynamicFormReturn<T> {
  const schema = useMemo(() => {
    const allFields = flattenFields(fields, onAnyFieldChange);
    return getDynamicSchema<T>(allFields, extraValidations);
  }, [fields, extraValidations, onAnyFieldChange]);

  type FormData = z.infer<typeof schema>;

  const initialValues = useMemo(() => getDefaultValues<T>(record), [record]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialValues as any,
  });

  const handleSubmit = (onSubmit: (data: T) => void) => {
    return form.handleSubmit((data) => {
      onSubmit(data as unknown as T);
    });
  };

  const reset = (data?: Partial<T>) => {
    const resetData = data ? getDefaultValues<T>(data) : initialValues;
    form.reset(resetData as any);
  };

  return {
    form,
    schema,
    handleSubmit,
    reset,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  };
}
