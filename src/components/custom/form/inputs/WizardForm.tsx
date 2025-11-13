
import { useState } from "react"
import { DynamicForm, FormResp } from "./DynamicForm";
import { FieldConfig, FieldProps } from "./base/definitions";
import { Stepper } from "@/src/components/ui/stepper";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(1)

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
  const stepFields = allFields.filter((f) => (f.step ?? 1) === currentStep)


  return (
    <Card className="flex flex-col gap-4 px-4">
      <Card>
      <div className="flex justify-between mb-4 gap-2 px-4">
        <Stepper steps={Array(totalSteps).fill({})} 
          currentStep={currentStep} 
          clickable={true} 
          onStepClick={setCurrentStep}
          />
        <div className="flex justify-center space-x-4 gap-2">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
          >
            <ChevronLeftIcon /> 
          </Button>
          <Button
            variant="outline"
            className="w-32"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep > totalSteps}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      </Card>
        
      {/* <pre className="text-xs font-bold mt-2 bg-black/5 p-2 rounded-lg">
            <code>{JSON.stringify(stepFields, null, 2)}</code>
          </pre> */}
      {/* 🔧 Aquí renderizas tu DynamicForm con los campos del paso actual */}
      {/* <DynamicForm<T> fields={[]} onSubmit={onSubmit} formTitle={`PASO ${step}`} /> */}
      <DynamicForm<T>
      record={record}
        formSubTitle="This is a subtitle"
        formTitle="Wizard Form Example"
        withCard={false}

        errorAlertPosition='down'
        fields={stepFields}

        onSubmit={onSubmit}
      /> 
    
  </Card>
  )
}
