'use client'
import { JSX } from 'react';
import { BaseInput } from '../base'
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from '@/src/components/ui';



// interface Props {
//   title?: string,
//   input: FieldProps,
//   onCheckedChange: (value : InputOption) => void
// }

export class CheckListInput extends BaseInput {
  render(): JSX.Element {
    const { input, isSubmitting } = this;
    const listConfig = input?.listConfig
  // export const InputCheckList = ({input, onCheckedChange, title}:Props) => {
    let lista = listConfig?.list ?? []
    if (lista == undefined) lista = []
    const title = 'title' //listConfig?.title

    const value: string[] = input.value
    const label = (listConfig?.optionLabel ?? "name") as string;
    const optionValue = (listConfig?.optionValue ?? "id") as string;
    const description = (listConfig?.optionDescription ?? "description") as string;
    return (
      <Card key={title}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title ?? input.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
        {lista.map((item) => ( 
          <div key={item[optionValue as keyof typeof item] as React.Key} className="flex items-center space-x-2">
            <Checkbox
              disabled={input.disabled || isSubmitting}
              id={String(item[optionValue as keyof typeof item])}
              checked={value.includes(item[optionValue as keyof typeof item] as string)}
              onCheckedChange={() => {/* onCheckedChange(item[optionValue as keyof typeof item]) */}}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={String(item[optionValue as keyof typeof item])}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item[label as keyof typeof item]}
              </Label>
              <p className="text-xs text-muted-foreground">{item[description as keyof typeof item]}</p>
            </div>
          </div>
          )
        )}
        </CardContent>
      </Card>
    )
  }
}
