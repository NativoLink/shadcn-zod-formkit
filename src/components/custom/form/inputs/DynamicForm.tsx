'use client'

import { useEffect, useMemo, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import { FieldProps } from "./base";
import { getDefaultValues, getDynamicSchema } from "./input-factory";
import { FormErrorsAlert } from "./base/form-errors";
import { Button, Card, CardContent, CardTitle, Form } from "@/src/components/ui";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Settings } from "lucide-react";
import { ZodObject, z } from "zod";
import { FormFieldsGrid } from "./FormFieldsGrid";

type alertPositionType = 'up' | 'down'

export interface FormResp<T> {
  form?: UseFormReturn;
  data: T;
}

interface Props<T extends Record<string, any>> {
  formTitle: string;
  formSubTitle?: string;
  fields: Array<FieldProps | FieldProps[]>;
  record?: Partial<T>;
  onSubmit?: (resp: FormResp<T>) => void;
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[];
  withErrorsAlert?: boolean;
  errorAlertPosition?: alertPositionType;
  withCard?: boolean;
  submitBtnLabel?: string;
  submitBtnClass?: string;
}

export const DynamicForm = <T extends Record<string, any>>({
  formTitle,
  formSubTitle,
  fields,
  record = {},
  onSubmit,
  extraValidations,
  withErrorsAlert = true,
  errorAlertPosition = 'up',
  withCard = false,
  submitBtnClass = '',
  submitBtnLabel = 'Submit',
}: Props<T>) => {

  const [isPending, startTransition] = useTransition();

  // 🔹 Genera el schema dinámico
  const schema = useMemo(() => getDynamicSchema(fields, extraValidations), [fields, extraValidations]);

  type FormData = z.infer<typeof schema>; // tipo seguro inferido desde Zod

  // 🔹 Valores por defecto
  const defaultValues = useMemo(() => getDefaultValues(record), [record]);

  // 🔹 Configura el formulario
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 🔁 Reset cuando cambian fields o defaultValues
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = (data: FormData) => {
    try {
      startTransition(async () => {
        const resp: FormResp<T> = { data: data as T, form };
        onSubmit?.(resp);
      });
    } catch (error) {
      console.error("Ocurrió un error al enviar el formulario.");
    }
  };

  const formContent = (
    <div>
      <CardTitle className="flex items-center gap-2 p-2 border-b">
        <Settings className="h-5 w-5" />
        {formTitle}
      </CardTitle>

      {withErrorsAlert && errorAlertPosition === 'up' && (
        <FormErrorsAlert formState={form.formState} fields={fields} />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
          <div className="w-full grid grid-cols-1">
            <FormFieldsGrid fields={fields} form={form} />
          </div>

          <div className="flex flex-row gap-2 justify-end items-end">
            <Button type="submit" size="lg" className={submitBtnClass} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {submitBtnLabel ?? "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {submitBtnLabel ?? "Save"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {withErrorsAlert && errorAlertPosition === 'down' && (
        <FormErrorsAlert formState={form.formState} fields={fields} />
      )}
    </div>
  );

  if (!withCard) return formContent;

  return (
    <Card>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
};
