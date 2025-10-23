"use client"

import { JSX, useState } from "react"
import { Switch, Label, Card } from "@/src/components/ui"
import { BaseInput } from "../base"
import { FieldProps, InputOption } from "../base/definitions";
import { cn } from "@/src/lib/utils";


// interface Props {
//   options: InputOption[]
//   onChange?: (optionsUpdated: InputOption[]) => void
// }

// export const GroupedSwitches = ({ options, onChange, }: Props) => {
export class GroupedSwitchInput extends BaseInput {
  render(): JSX.Element {
    const { input } = this;
    return (
      <GroupedSwitches options={[]} input={input}/>
    )
  }
}

interface Props {
  input: FieldProps,
  options?: InputOption[]
  onChange?: (optionsUpdated: InputOption[]) => void
}

export const GroupedSwitches = ({ options, onChange, input}: Props) => {

  const mockInputOptions:InputOption[] = [
    { id: 1, name: 'MOCK OPTION - CREATE', checked: false },
    { id: 2, name: 'MOCK OPTION - READ', checked: true },
    { id: 3, name: 'MOCK OPTION - UPDATE', checked: false },
    { id: 4, name: 'MOCK OPTION - DELETE ', checked: false },
  ]
  
  const initialSwitches: InputOption[] = options ? (options.length > 0 ? options : ((input.listConfig?.list as InputOption[]) ?? []) ) : mockInputOptions 
  const [switches, setSwitches] = useState<InputOption[]>(initialSwitches)
  const [allChecked, setAllChecked] = useState<boolean>(initialSwitches.every((opt) => opt.checked))
  
  const [bgColor, setBgColor] = useState<string>('bg-green-500/5 border-green-400/10')

  const handleMainToggle = (checked: boolean) => {
    const updated = switches.map((opt) => ({ ...opt, checked }));
    setSwitches(updated);
    setAllChecked(checked);
    onChange?.(updated.filter((opt) => opt.checked));
  }

  const handleChildToggle = (option: InputOption, checked: boolean) => {
    const updated = switches.map((opt) =>
      opt.id === option.id ? { ...opt, checked } : opt
    );
    setSwitches(updated);
    setAllChecked(updated.every((opt) => opt.checked));
    onChange?.(updated.filter((opt) => opt.checked));
  }

  return (
    <Card >
      <div className={cn(`w-full h-full space-y-4 p-4  border-2 rounded-xl bg-green-500 ${allChecked ? 'bg-green-500/5 border-green-400/10' : 'bg-black/5'}`)}>
        {/* Switch principal */}
        <div className="flex items-center justify-between border-b p-2">
          <div>{input.name}</div>
          <div className="flex flex-row gap-2">
            <Label htmlFor="main">Seleccionar todo</Label>
            <Switch id="main" checked={allChecked} onCheckedChange={handleMainToggle} />
          </div>
        </div>

        {/* Switches hijos */}
        {switches.map((opt, index) => (
          <div key={opt.id} className={`p-2 rounded-lg flex flex-row w-full items-center justify-between ${!(index % 2 )? 'bg-black/5' : 'bg-white/5'}`}>
            <Label htmlFor={String(opt.id)}>{opt.label || opt.name}</Label>
            <Switch
              id={String(opt.id)}
              checked={opt?.checked || false}
              onCheckedChange={checked => handleChildToggle(opt, checked)}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

