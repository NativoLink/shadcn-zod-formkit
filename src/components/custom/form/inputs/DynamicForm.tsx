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
import { cn } from "@/src/lib/utils";

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
  onAnyFieldChange?: (data: Record<string,any>) => void;
  onSubmit?: (resp: FormResp<T>) => void;
  onClick?: (resp: FormResp<T>) => void;
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[];
  withErrorsAlert?: boolean;
  errorAlertPosition?: alertPositionType;
  withCard?: boolean;
  withFormWrapper?: boolean;
  withSubmitBtn?: boolean;
  submitBtnLabel?: string;
  submitBtnLabelSubmiting?: string;
  submitBtnClass?: string;
  btnGroupDirection?: 'flex-start' | 'flex-end' | 'flex-center';
  children?: ReactNode;
  childrenHeader?: ReactNode;
  listBtnConfig?: BtnConfig[];
  debug?:boolean
}

export const DynamicForm = <T extends Record<string, any>>({
  formTitle,
  formSubTitle,
  fields,
  readOnly = false,
  record = {},
  onAnyFieldChange,
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
  submitBtnClass="",
  listBtnConfig = [],
  submitBtnLabel = 'Guardar',
  submitBtnLabelSubmiting = 'Guardando...',
  withFormWrapper = true,
  btnGroupDirection = "flex-end",
  withSubmitBtn = true,
  debug = false
}: Props<T>) => {

  const [isPending, startTransition] = useTransition();

  /** ✅ Schema dinámico basado en los campos */
  const schema = useMemo(() => {
  const allFields = flattenFields(fields, onAnyFieldChange);
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
  // }, [initialValues, form]);
  }, []);

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

    const data = form.watch() as unknown as T;
    const resp: FormResp<T> = { data, form };
    onClick(resp);
  };

  const formBody = (
    <>
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

      <ButtonGroup className="flex flex-row w-full h-full" style={{
          justifyContent: btnGroupDirection, // Alinea horizontalmente a la derecha
          alignItems: "center",       // Centra verticalmente (opcional)
        }}>
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
        {!readOnly && withSubmitBtn &&  (
          <Button
            type={onClick ? 'button' : 'submit'}
            size="lg"
            className={cn(submitBtnClass)}
            disabled={isPending}
            onClick={onClick ? handleClick : undefined}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {submitBtnLabelSubmiting}
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {submitBtnLabel}
              </>
            )}
          </Button>
        )}
      </ButtonGroup>
    </>
  )

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

      {withFormWrapper && (<FormWrapper form={form} handleSubmit={handleSubmit}>{formBody}</FormWrapper>)}
      {!withFormWrapper && (formBody)}


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


interface FormWrapperProps {
  form:UseFormReturn<any>
  handleSubmit: (data: any) => void
  children: ReactNode;
  readOnly?: boolean
  debug?: boolean
}

const FormWrapper = ({form, handleSubmit, children, readOnly, debug}: FormWrapperProps) => {
  const allValues = form.watch();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`flex flex-col gap-2 ${readOnly ? 'opacity-70 pointer-events-none select-none' : ''}`}
      >
        {children}
        {debug && (
          <pre className="mt-4 p-3 bg-muted text-xs rounded">
            {JSON.stringify(allValues, null, 2)}
          </pre>
        )}
      </form>
    </Form>
  )
}


