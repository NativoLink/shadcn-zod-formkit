"use client";

import { startTransition, useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";


import { FieldProps } from "./base";
import { getDefaultValues, getDynamicSchema, InputFactory } from "./input-factory";
import { FormErrorsAlert } from "./base/form-errors";
import { Button, Card, CardContent, Form } from "@/src/components/ui";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from "lucide-react";

type alertPositionType = 'up' | 'down'
interface Props {
  fields: Array<FieldProps|FieldProps[]>;
  record?: Record<string, any>;
  onSubmit?: (data: any) => void;

  withErrorsAlert?: boolean
  errorAlertPosition?: alertPositionType
  withCard?: boolean

  submitBtnLabel?: string
  submitBtnClass?: string
}

export const DynamicForm = ({ 
  fields,
  record = {},
  onSubmit,
  withCard = false,
  withErrorsAlert = true,
  errorAlertPosition = 'up',
  submitBtnClass = '',
  submitBtnLabel = 'Submit',
}: Props) => {
  
  const [isPending, startTransition] = useTransition()

  // ✅ Genera el schema usando la función dinámica
  const schema = useMemo(() => getDynamicSchema(fields), [fields]);

  // ✅ Obtiene los valores por defecto según la entidad
  const defaultValues = useMemo(() => getDefaultValues(record), [record]);

  // ✅ Configura el formulario con schema y defaultValues
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 🔁 Redibuja cuando cambian los fields o los valores por defecto
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, fields]);


  const handleSubmit = (data: any) => {
    try{
      startTransition(async () => {
        await new Promise((resolve) => setTimeout(resolve, 13000));
        onSubmit?.(data);
      })
    } catch (error) {
      console.error("Ocurrió un error al enviar el formulario.")
    }
  };

  const formContent = (
    <>
      { (withErrorsAlert && errorAlertPosition == 'up') && (<FormErrorsAlert formState={form.formState} fields={fields}/>)}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
          <div className="w-full grid grid-cols-1">
            {fields.map((input, idx) =>
              Array.isArray(input)
                ? 
                <span key={`field-group-${idx}`} className="w-full  flex flex-row justify-between py-3">
                  {
                    input.map((field, subIdx) => ( 
                      <div key={subIdx} className="w-full px-2">
                        {InputFactory.create(field, form, isPending) }
                      </div>
                    ))
                  }
                </span>
                :
                (<span key={`field-group-${idx}`} className="flex flex-col justify-between py-3 w-full px-2"> 
                  {InputFactory.create(input, form, isPending)}
                </span>)
                
                    
            )}
          </div>
          <div className="flex flex-row gap-2 justify-end items-end justify-items-end">
            <Button type="submit" size={'lg'} className={submitBtnClass} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {submitBtnLabel ?? "Guardando..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {submitBtnLabel ?? "Guardar"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      { (withErrorsAlert && errorAlertPosition == 'down') && (
        <FormErrorsAlert formState={form.formState} fields={fields}/>
      )}
    </>
  ) 

  if (!withCard) return formContent

  return (
    <Card>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
};
