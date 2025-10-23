'use client'


import { UseFormReturn } from 'react-hook-form'
import { JSX, useEffect, useState } from 'react'
import { BaseInput, FieldProps, GroupedOption, InputOption } from '../base'
import { GroupedSwitches } from './grouped-switches-input'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage 
} from '@/src/components/ui'

/* ========= INPUT PRINCIPAL ========= */

export class AccordionGroupedSwitchInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this
    return (
      <AccordionGroupedSwitches
        form={form}
        input={input}
        groups={(input?.listConfig?.list as GroupedOption[]) ?? []}
        onChange={input?.listConfig?.onOptionChange ?? (() => {})}
      />
    )
  }
}

/* ========= COMPONENTE ========= */

interface Props {
  form: UseFormReturn
  input: FieldProps
  groups?: GroupedOption[]
  onChange?: (optionsUpdated: InputOption[]) => void
}

export const AccordionGroupedSwitches = ({ form, input, groups = [], onChange }: Props) => {
  const [groupsState, setGroupsState] = useState<GroupedOption[]>([])
  const [selectedOptions, setSelectedOptions] = useState<InputOption[]>([])

  // 🔹 Cargar los grupos y sincronizar seleccionados
  useEffect(() => {
    const selected = input.listConfig?.selectedList ?? []
    const updatedGroups = groups.map((group) => ({
      ...group,
      options: group.options.map((opt) => ({
        ...opt,
        checked: selected.some((sel) => sel.id === opt.id),
        groupedLabel: group.label,
      })),
    }))
    setGroupsState(updatedGroups)
    setSelectedOptions(selected)
  }, [groups, input])

  // 🔹 Calcular cuántos están seleccionados por grupo
  const countCheckedByGroup = (group: GroupedOption): number => {
    return group.options.filter((opt) => opt.checked).length
  }

  // 🔹 Manejar cambio en switches individuales
  const handleOptionChange = (field: any, updatedGroupLabel: string, updatedOptions: InputOption[]) => {
    const newGroups = groupsState.map((group) =>
      group.label === updatedGroupLabel ? { ...group, options: updatedOptions } : group
    )

    setGroupsState(newGroups)

    const allChecked = newGroups.flatMap((g) => g.options).filter((o) => o.checked)
    setSelectedOptions(allChecked)
    field.onChange(allChecked)
    onChange?.(allChecked)
  }

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem className="shadow-lg">
          <FormControl>
            <Card className="p-4 space-y-4">
              <h2 className="text-2xl font-bold">{input.label}</h2>
              <Accordion type="multiple">
                {groupsState.map((group, indx) => (
                  <AccordionItem
                    key={indx}
                    value={group.label}
                    className={`px-1 ${indx % 2 ? `bg-black/10` : 'bg-black/5'}`}
                  >
                    <AccordionTrigger>
                      <div className="grid grid-cols-2 w-full">
                        {group.label}{' '}
                        <Badge>
                          {countCheckedByGroup(group)} / {group.options.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <GroupedSwitches
                        input={input}
                        options={group.options}
                        onChange={(updated: InputOption[]) =>
                          handleOptionChange(field, group.label, updated)
                        }
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </FormControl>

          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />

          {/* Debug visual opcional */}
          <pre className="text-xs font-bold mt-2 bg-black/5 p-2 rounded-lg">
            <code>{JSON.stringify(selectedOptions, null, 2)}</code>
          </pre>
        </FormItem>
      )}
    />
  )
}
