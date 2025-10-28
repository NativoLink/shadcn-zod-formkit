'use client'
import { BaseInput, FieldProps, InputOption } from "../base";
import { Card, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Label, RadioGroup, RadioGroupItem, Switch } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";
import { JSX } from "react";
import { UseFormReturn } from "react-hook-form";




export class RadioGroupInput extends BaseInput {
  render(): JSX.Element {
  const { input, form } = this;
    return (
      <FieldRadioGroup input={input} form={form}/>
    )
  }
}

interface Props {
  form: UseFormReturn
  input: FieldProps
}

const FieldRadioGroup = ({ input, form }: Props): JSX.Element => {
  const mockInputOptions: InputOption[] = [
    { id: 1, name: "A+", value: "A+"  },
    { id: 2, name: "A-", value: "A-"  },
    { id: 3, name: "B+", value: "B+"  },
    { id: 4, name: "B-", value: "B-"  },
    { id: 5, name: "O+", value: "O+"  },
    { id: 6, name: "O-", value: "O-"  },
    { id: 7, name: "AB+", value: "AB+"  },
    { id: 8, name: "AB-", value: "AB-"  },
  ]

  const options = (input.listConfig?.list as InputOption[]) ?? mockInputOptions

  const formField = <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-between p-2 border-b">
          <FormLabel className="font-semibold">
            {input.label || input.name}
          </FormLabel>
        </div>

        <FormControl>
          <RadioGroup
            {...field}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            className="space-y-2 mt-3"
          >
            {options.map((opt, index) => (
              <div
                key={opt.id}
                className={cn(
                  "p-2 rounded-lg flex items-center gap-2 cursor-pointer",
                  index % 2 ? "bg-black/5" : "bg-white/5"
                )}
              >
                <RadioGroupItem
                  value={opt.value ??  String(opt.id)}
                  id={`opt-${opt.id}`} />
                <Label htmlFor={`opt-${opt.id}`}>
                  {opt.label || opt.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormControl>

        <FormMessage />
      </FormItem>
    )} />;

  if (!input.wrapInCard) return <>{formField}</>;
  
  return (
    <Card className="p-4 space-y-3">
      {formField}
    </Card>
  )
}