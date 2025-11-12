
import { useState } from "react"
import { DynamicForm, FormResp } from "./DynamicForm";
import { FieldConfig, FieldProps } from "./base/definitions";

interface Props<T> {
  onSubmit?: (resp: FormResp<T>) => void;
  fields: FieldConfig<T>[];
  record: any
}

export const WizardForm = <T extends Record<string, any>>({
  fields,
  record,
  onSubmit,
}: Props<T>) => {
  const [step, setStep] = useState(1)

  // 🧩 Aplanar campos (porque FieldConfig puede ser anidado)
  const flattenFields = (list: FieldConfig<T>[]): FieldProps<T>[] =>
    list.flatMap((f) => (Array.isArray(f) ? flattenFields(f) : f))

  const allFields = flattenFields(fields)

  // ✅ Calcular totalSteps sin errores
  const totalSteps = allFields.reduce(
    (max, f) => Math.max(max, f.step ?? 1),
    1
  )

  // 🔍 Filtrar los campos del paso actual
  const stepFields = allFields.filter((f) => (f.step ?? 1) === step)

  // const form = useForm({
  //   resolver: zodResolver(zodSchema),
  //   mode: "onChange",
  // })

  // const filteredFields = fields.filter(f => (f.step || 1) === step)

  // const handleNext = async () => {
  //   const valid = await form.trigger(filteredFields.map(f => f.name))
  //   if (valid && step < totalSteps) setStep(s => s + 1)
  // }

  // const handlePrev = () => {
  //   if (step > 1) setStep(s => s - 1)
  // }

  // const handleFinalSubmit = form.handleSubmit(onSubmit)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between mb-4">
        <span>Paso {step} de {totalSteps}</span>
        <div className="flex gap-2">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)}>
              Anterior
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" onClick={() => setStep(step + 1)}>
              Siguiente
            </button>
          ) : (
            <button type="submit" onClick={() => onSubmit?.({} as any)}>
              Finalizar
            </button>
          )}
        </div>
      </div>
      {/* <pre className="text-xs font-bold mt-2 bg-black/5 p-2 rounded-lg">
            <code>{JSON.stringify(stepFields, null, 2)}</code>
          </pre> */}
      {/* 🔧 Aquí renderizas tu DynamicForm con los campos del paso actual */}
      {/* <DynamicForm<T> fields={[]} onSubmit={onSubmit} formTitle={`PASO ${step}`} /> */}
      <DynamicForm<T>
      record={record}
        formSubTitle="This is a subtitle"
        formTitle="Basic Form Example"
        withCard

        errorAlertPosition='down'
        fields={stepFields}

        onSubmit={async (resp: FormResp<T>) => {
          // setDataToSend(resp.data)
        }}
      /> 
    </div>
  )
}
