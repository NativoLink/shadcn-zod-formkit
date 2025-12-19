import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { DynamicForm, FormResp } from "./DynamicForm";
import { FieldConfig, FieldProps } from "./base/definitions";
import { Stepper } from "@/src/components/ui/stepper";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface WizardRenderProps<T> {
  stepFields: FieldProps<T>[]
  currentStep: number
  totalSteps: number,
  setCurrentStep: Dispatch<SetStateAction<number>>
}

interface Props<T> {
  onSubmit?: (resp: FormResp<T>) => void;
  fields: FieldConfig<T>[];
  record: any,
  children?: (props: WizardRenderProps<T>) => ReactNode,
  isWrapInWizard?: boolean,
  skipSteps?:boolean,
}

export const WizardForm = <T extends Record<string, any>>({
  fields,
  record,
  onSubmit,
  children,
  isWrapInWizard = true,
  skipSteps = false,
  
}: Props<T>) => {

  const [currentStep, setCurrentStep] = useState(1)

  const flattenFields = (list: FieldConfig<T>[]): FieldProps<T>[] =>
    list.flatMap((f) => (Array.isArray(f) ? flattenFields(f) : f))

  const allFields = flattenFields(fields)

  const totalSteps = allFields.reduce(
    (max, f) => Math.max(max, f.step ?? 1),
    1
  )

  const stepFields = allFields.filter((f) => (f.step ?? 1) === currentStep)

  return (
    <Card className="flex flex-col gap-4 px-4">

      {/* Header con Stepper */}
      <Card>
        <div className="flex justify-between mb-4 gap-2 px-4">
          <Stepper
            steps={Array(totalSteps).fill({})}
            currentStep={currentStep}
            clickable={skipSteps}
            onStepClick={setCurrentStep}
          />
          {/* <div className="flex justify-center space-x-4 gap-2">
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
              disabled={currentStep >= totalSteps}
            >
              <ChevronRightIcon />
            </Button>
          </div> */}
        </div>
      </Card>

      {/* 👇 Aquí va el truco: usar children o fallback a DynamicForm */}
      {children ? (
        children({
          stepFields,
          currentStep,
          totalSteps,
          setCurrentStep
        })
      ) : (
        <DynamicForm<T>
          record={record}
          formSubTitle="This is a subtitle"
          formTitle="Wizard Form Example"
          withCard={false}
          errorAlertPosition="down"
          fields={stepFields}
          onSubmit={onSubmit}
          isWrapInWizard={true}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}
    </Card>
  )
}
