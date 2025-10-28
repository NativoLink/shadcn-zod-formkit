"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";


import { FieldProps } from "./base";
import { getDefaultValues, getDynamicSchema, InputFactory } from "./input-factory";
import { FormErrorsAlert } from "./base/form-errors";
import { Button, Card, CardContent, CardHeader, CardTitle, Form } from "@/src/components/ui";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Settings } from "lucide-react";
import { ZodObject } from "zod";


type alertPositionType = 'up' | 'down'



interface formResp  {
  form?: UseFormReturn;
  data: any
}
interface Props {
  formTitle: string;
  formSubTitle?: string;

  fields: Array<FieldProps|FieldProps[]>;
  record?: Record<string, any>;
  onSubmit?: (formResp: formResp) => void;
  extraValidations?: ((schema: ZodObject<any>) => ZodObject<any>)[];

  withErrorsAlert?: boolean
  errorAlertPosition?: alertPositionType
  withCard?: boolean

  submitBtnLabel?: string
  submitBtnClass?: string
}

export const DynamicForm = ({ 
  formTitle,
  formSubTitle,
  fields,
  record = {},
  onSubmit,
  extraValidations,
  withCard = false,
  withErrorsAlert = true,
  errorAlertPosition = 'up',
  submitBtnClass = '',
  submitBtnLabel = 'Submit',
}: Props) => {
  
  const [isPending, startTransition] = useTransition()

  // ✅ Genera el schema usando la función dinámica
  const schema = useMemo(() => getDynamicSchema(fields, extraValidations), [fields, extraValidations]);

  // ✅ Obtiene los valores por defecto según la entidad
  const defaultValues = useMemo(() => getDefaultValues(record), [record]);

  // ✅ Configura el formulario con schema y defaultValues
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 🔁 Redibuja cuando cambian los fields o los valores por defecto
  useEffect(() => {
    console.log('🔁 Redibuja cuando cambian los fields o los valores por defecto')
    form.reset(defaultValues);
  }, []);


  const handleSubmit = (data: any) => {
    try{
      startTransition(async () => {
        const resp: formResp =  {  data, form }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        onSubmit?.(resp);
      })
    } catch (error) {
      console.error("Ocurrió un error al enviar el formulario.")
    }
  };

  const formContent = (
    <div>
      
      <CardTitle className="flex  items-center gap-2 p-2 border-b">
        <Settings className="h-5 w-5" />
        {formTitle}
      </CardTitle>
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
      { (withErrorsAlert && errorAlertPosition == 'down') && (
        <FormErrorsAlert formState={form.formState} fields={fields}/>
      )}
    </div>
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
