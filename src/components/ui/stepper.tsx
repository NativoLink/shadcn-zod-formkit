"use client"

import { cn } from "@/src/lib/utils"
import { Check } from "lucide-react"

interface Step {
  title?: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  clickable?: boolean
  onStepClick?: (step: number) => void
}

export function Stepper({ steps, currentStep, clickable = false, onStepClick }: StepperProps) {
  const handleStepClick = (stepNumber: number) => {
    if (clickable && onStepClick) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-row gap-4 items-center justify-around">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                {/* Circle indicator */}
                <div
                  onClick={() => handleStepClick(stepNumber)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary shadow-lg scale-110",
                    isUpcoming && "border-muted-foreground/30 bg-background text-muted-foreground",
                    clickable && "cursor-pointer hover:scale-125 hover:shadow-xl",
                    !clickable && "cursor-default",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>

                {/* Step info */}
                {step.title && (
                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        (isCompleted || isCurrent) && "text-foreground",
                        isUpcoming && "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-muted-foreground max-w-[120px]">{step.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="mx-2 flex-1 mb-8">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-all duration-300",
                      stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/30",
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
