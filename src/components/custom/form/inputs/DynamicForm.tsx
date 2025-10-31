'use client';

import { useEffect, useMemo, useTransition } from "react";
import { useForm, UseFormReturn, DefaultValues, Resolver } from "react-hook-form";

import { FieldProps } from "./base";
import { getDefaultValues, getDynamicSchema } from "./input-factory";
import { FormErrorsAlert } from "./base/form-errors";
import { Button, Card, CardContent, CardDescription, CardTitle, Form } from '@/src/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Save } from "lucide-react";
import { ZodObject, z } from "zod";
import { FormFieldsGrid } from "./FormFieldsGrid";

type alertPositionType = 'up' | 'down';

export interface FormResp<T> {
  form?: UseFormReturn<any>;
  data: T;
}

interface Props<T extends Record<string, any>> {
  formTitle: string;
  formSubTitle?: string;
  readOnly?: boolean;
  fields: Array<FieldProps<T> | FieldProps<T>[]>;
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
  readOnly = false,
  record = {},
  onSubmit,
  extraValidations,
  withErrorsAlert = true,
  errorAlertPosition = 'up',
  withCard = false,
  submitBtnClass = '',
  submitBtnLabel = 'Guardar',
}: Props<T>) => {

  const [isPending, startTransition] = useTransition();

  // schema dinámico (genérico)
  const schema = useMemo(() => getDynamicSchema<T>(fields, extraValidations), [fields, extraValidations]);
  type FormData = z.infer<typeof schema>;

  // resolver casteado para evitar incompatibilidades de tipos entre zodResolver y useForm genérico
  const resolver = zodResolver(schema) as unknown as Resolver<FormData>;

  // valores iniciales: aceptamos Partial<T> desde record
  const initialValues = useMemo(() => getDefaultValues<T>(record), [record]);

  // Aquí está el fix: casteamos a DefaultValues<FormData>
  const form = useForm<FormData>({
    resolver,
    defaultValues: initialValues as unknown as DefaultValues<FormData>,
  });

  useEffect(() => {
    form.reset(initialValues as unknown as DefaultValues<FormData>);
  }, [initialValues, form]);

  const handleSubmit = (data: FormData) => {
    if (readOnly) return;

    try {
      startTransition(async () => {
        const resp: FormResp<T> = { data: data as unknown as T, form };
        onSubmit?.(resp);
      });
    } catch (error) {
      console.error("Ocurrió un error al enviar el formulario.", error);
    }
  };

  const formContent = (
    <div>
      <CardTitle className="flex items-center gap-2 p-2 border-b">
        <Pencil className="h-5 w-5" />
        <div className="flex flex-col">
          <p>{formTitle}</p>
          {formSubTitle && <CardDescription>{formSubTitle}</CardDescription>}
        </div>
      </CardTitle>

      {withErrorsAlert && errorAlertPosition === 'up' && (
        <FormErrorsAlert formState={form.formState} fields={fields} />
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`flex flex-col gap-2 ${readOnly ? 'opacity-70 pointer-events-none select-none' : ''}`}
        >
          <div className="w-full grid grid-cols-1">
            <FormFieldsGrid fields={fields} form={form} readOnly={readOnly} />
          </div>

          {!readOnly && (
            <div className="flex flex-row gap-2 justify-end items-end">
              <Button type="submit" size="lg" className={submitBtnClass} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {submitBtnLabel}
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* {withErrorsAlert && errorAlertPosition === 'down' && (
        <FormErrorsAlert formState={form.formState} fields={fields} />
      )} */}
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
