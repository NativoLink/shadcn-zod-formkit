'use client';

import { ReactNode, useEffect, useMemo, useTransition } from "react";
import { useForm, UseFormReturn, DefaultValues, Resolver } from "react-hook-form";
import { BtnConfig, FieldConfig, FieldProps, flattenFields } from "./base";
import { getDefaultValues, getDynamicSchema } from "./input-factory";
import { FormErrorsAlert } from "./base/form-errors";
import { Button, Card, CardContent, CardDescription, CardTitle, Form } from '@/src/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Save } from "lucide-react";
import { ZodObject, z } from "zod";
import { FormFieldsGrid } from "./FormFieldsGrid";
import { ButtonGroup } from "@/src/components/ui/button-group";

type alertPositionType = 'up' | 'down';

export interface FormResp<T> {
  form?: UseFormReturn<any>;
  data: T;
}

interface Props<T extends Record<string, any>> {
  showIcon?: boolean;
  showFormHeader?: boolean;
  formTitle: string;
  formSubTitle?: string;
  readOnly?: boolean;
  fields: FieldConfig<T>[];
  record?: Partial<T>;
  onSubmit?: (resp: FormResp<T>) => void;
  onClick?: (resp: FormResp<T>) => void;
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[];
  withErrorsAlert?: boolean;
  errorAlertPosition?: alertPositionType;
  withCard?: boolean;
  submitBtnLabel?: string;
  submitBtnClass?: string;
  children?: ReactNode;
  childrenHeader?: ReactNode;
  listBtnConfig?: BtnConfig[];
}

export const DynamicForm = <T extends Record<string, any>>({
  formTitle,
  formSubTitle,
  fields,
  readOnly = false,
  record = {},
  onSubmit,
  onClick,
  extraValidations,
  children,
  childrenHeader,
  showIcon = false,
  showFormHeader = true,
  withErrorsAlert = true,
  errorAlertPosition = 'up',
  withCard = false,
  submitBtnClass = '',
  listBtnConfig = [],
  submitBtnLabel = 'Guardar',
}: Props<T>) => {

  const [isPending, startTransition] = useTransition();

  /** ✅ Schema dinámico basado en los campos */
  const schema = useMemo(() => {
  // const flattenFields = (items: any[]): FieldProps<T>[] => {
  //   return items.flatMap(item => 
  //     Array.isArray(item) ? flattenFields(item) : item
  //   );
  // };

  const allFields = flattenFields(fields);
  return getDynamicSchema<T>(allFields, extraValidations);
}, [fields, extraValidations]);

  type FormData = z.infer<typeof schema>;
  const resolver = zodResolver(schema) as unknown as Resolver<FormData>;

  const initialValues = useMemo(() => getDefaultValues<T>(record), [record]);

  const form = useForm<FormData>({
    resolver,
    defaultValues: initialValues as unknown as DefaultValues<FormData>,
  });

  /** 🔄 Reset cuando cambia record */
  useEffect(() => {
    form.reset(initialValues as unknown as DefaultValues<FormData>);
  }, [initialValues, form]);

  /** 💾 onSubmit */
  const handleSubmit = (data: FormData) => {
    if (readOnly) return;
    startTransition(() => {
      const resp: FormResp<T> = { data: data as unknown as T, form };
      onSubmit?.(resp);
    });
  };

  /** 🖱️ onClick con validación */
  const handleClick = async () => {
    if (!onClick) return;
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues() as unknown as T;
    const resp: FormResp<T> = { data, form };
    onClick(resp);
  };

  /** 🧩 Render del contenido principal del formulario */
  const formContent = (
    <div>
      {showFormHeader && (
        <CardTitle className="flex flex-row items-center gap-2 p-2 border-b">
          <div className="flex flex-row items-center gap-2 w-full">
            {showIcon && <Pencil className="h-5 w-5" />}
            <div className="flex flex-col">
              <div className="text-xl">{formTitle}</div>
              {formSubTitle && <CardDescription>{formSubTitle}</CardDescription>}
            </div>
          </div>
          {childrenHeader && (
            <div className="flex flex-row items-center gap-2 w-full h-full">
              {childrenHeader}
            </div>
          )}
        </CardTitle>
      )}

      {withErrorsAlert && errorAlertPosition === 'up' && (
        <FormErrorsAlert
          formState={form.formState}
          fields={fields as unknown as FieldConfig<T>[]}
        />
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`flex flex-col gap-2 ${readOnly ? 'opacity-70 pointer-events-none select-none' : ''}`}
        >
          <div className="w-full grid grid-cols-1">
            <FormFieldsGrid
              fields={fields as unknown as FieldConfig<T>[]}
              form={form}
              readOnly={readOnly}
            />
            {children && (
              <div className="flex flex-row items-center gap-2 w-full h-full">
                {children}
              </div>
            )}
          </div>

          <ButtonGroup className="flex flex-row w-full">
            {listBtnConfig.map((btn, key) => (
              <Button
                type={btn.btnType}
                key={key}
                size="lg"
                className={submitBtnClass}
                variant={btn.variant}
                onClick={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.label}
              </Button>
            ))}
            {!readOnly && (
              <Button
                type={onClick ? 'button' : 'submit'}
                size="lg"
                className={submitBtnClass}
                disabled={isPending}
                onClick={onClick ? handleClick : undefined}
              >
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
            )}
          </ButtonGroup>
        </form>
      </Form>

      {withErrorsAlert && errorAlertPosition === 'down' && (
        <FormErrorsAlert
          formState={form.formState}
          fields={fields.flatMap(f => Array.isArray(f) ? f : [f])}
        />
      )}
    </div>
  );

  if (!withCard) return formContent;

  return (
    <Card>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
};
