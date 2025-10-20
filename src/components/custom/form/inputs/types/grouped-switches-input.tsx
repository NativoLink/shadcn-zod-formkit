"use client"

import { JSX, useState } from "react"
import { Switch, Label } from "../../../../../components/ui"
import { BaseInput } from "../base"
import { FieldProps, InputOption } from "../base/definitions";


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
  options: InputOption[]
  onChange?: (optionsUpdated: InputOption[]) => void
}

const GroupedSwitches = ({ options, onChange, input}: Props) => {

  const mockInputOptions:InputOption[] = [
    { id: 1, name: 'MOCK OPTION - PERMISO 1', checked: false },
    { id: 2, name: 'MOCK OPTION - PERMISO 2', checked: true },
    { id: 3, name: 'MOCK OPTION - PERMISO 3', checked: false },
    { id: 4, name: 'MOCK OPTION - PERMISO 4', checked: false },
  ]

  const [switches, setSwitches] = useState<InputOption[]>( options.length == 0 ? mockInputOptions : options )
  const [allChecked, setAllChecked] = useState(false)
  

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
    <div  className={`space-y-4 p-4  border-2 rounded-xl ${allChecked ? 'bg-green-500/5 border-green-400/10' : 'bg-black/5'}`}>
      {/* Switch principal */}
      <div className="flex items-center justify-between border-b pb-2">
        <div>{input.name}</div>
        <div className="flex flex-row gap-2">
          <Label htmlFor="main">Seleccionar todo</Label>
          <Switch id="main" checked={allChecked} onCheckedChange={handleMainToggle} />
        </div>
      </div>

      {/* Switches hijos */}
      {switches.map((opt, index) => (
        <div key={opt.id} className={`p-2 rounded-lg flex flex-row w-full items-center justify-between ${!(index % 2 )? 'bg-black/5' : 'bg-white/5'}`}>
          <Label htmlFor={opt.id.toString()}>{opt.label || opt.name}</Label>
          <Switch
            id={opt.id.toString()}
            checked={opt.checked || false}
            onCheckedChange={checked => handleChildToggle(opt, checked)}
          />
        </div>
      ))}
    </div>
  )
}

