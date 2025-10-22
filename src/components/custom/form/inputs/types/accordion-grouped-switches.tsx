'use client'
import { Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  Separator
} from '../../../../../components/ui'
import { UseFormReturn } from 'react-hook-form';
import { JSX, useEffect, useState } from 'react';
import { BaseInput, FieldProps, GroupedOption, InputOption } from '../base';
import { GroupedSwitches } from './grouped-switches-input';

export class AccordionGroupedSwitchInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return (
      <AccordionGroupedSwitches
        form={form}
        input={input}
        groups={input?.listConfig?.list as GroupedOption[] ?? []}
        onChange={input?.listConfig?.onOptionChange ?? (() => {})}
      />
    )
  }
}


interface Props {
  form: UseFormReturn
  input: FieldProps
  groups?: GroupedOption[]
  onChange?: (optionsUpdated: InputOption[]) => void
}

export const AccordionGroupedSwitches = ({ form, input, groups, onChange }: Props) => {


  const selectedListToInputOptionList = () : InputOption[] => {
    const list = input.listConfig?.selectedList?.map(opt => ({
      ...opt,
      checked: true
    }))
    return list ?? []
  }

  const [groupsState, setGroupsState] = useState(groups)
  const [allOptions, setAllOptions] = useState<InputOption[]>(selectedListToInputOptionList())
  const [selectOptions, setSelectOptions] = useState<InputOption[]>([])

  const getChecked = (options: InputOption[]) : InputOption[] => {
    const selected = selectedListToInputOptionList()
    const updated = options.map(opt => ({
      ...opt,
      checked: selected?.some(item2 => item2.id === opt.id)
    }))
    return updated
  }


  const coutCheckedByGroup = (group:GroupedOption): number =>{
    const filter = allOptions.filter(o => o.checked && o.groupedLabel == group.label)
    return filter.length

  }

  const onCheckedSwitch = () =>{
    setGroupsState(groups)
    const updated = groups?.map(group => ({ ...group, options: getChecked(group?.options) }))
    console.log("🚀 ~ AccordionGroupedSwitches ~ updated:", updated)
    setGroupsState(updated)
    setAllOptions(updated?.flatMap(group => group.options) ?? [])
  }
  
  useEffect(()=>{
    onCheckedSwitch()
  },[input])
  
  const handleOptionChange = (inputs: InputOption[]) => {
    onCheckedSwitch()
    setSelectOptions(inputs)
    // field.onChange(allOptions.filter(o => o.checked))
    // setAllOptions(groupsState?.flatMap(group => group.options) ?? [])
    // onChange?.(allOptions)
    console.log("🚀 ~ handleOptionChange ~ selectOptions:", selectOptions)
  }
  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem className="shadow-lg">
          {/* <FormLabel><b>{input.label}</b></FormLabel> */}
          <FormControl>

            <Card className='p-4'>
            <h2 className='text-2xl font-bold'>{input.label}</h2>
            <Accordion type="multiple">
              {groupsState?.map((group,indx) => (
                <AccordionItem key={indx} value={group.label} className={`px-1 ${indx % 2 ? `bg-black/10` : 'bg-black/5'}`}>
                  <AccordionTrigger>
                    <div className='grid grid-cols-2 w-full'>
                      {group.label} <Badge>{coutCheckedByGroup(group)} / {group.options.length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <GroupedSwitches
                      input={input}
                      options={group.options}
                      onChange={(v:any)=> handleOptionChange(v)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>


            {/* <Input className="min-w-[180px] bg-white" placeholder={input.placeHolder} {...field} type={input.keyboardType}
            disabled={input.disabled}/> */}
          </FormControl>
          {input.description && <FormDescription>
            {input.description}
            </FormDescription>}
          <FormMessage />
          {/* <pre className='text-xs font-bold'>  <code>{JSON.stringify(allOptions, null, 2)}</code></pre> */}
          {/* <pre className='text-xs font-bold'>  <code>{JSON.stringify(input.listConfig?.selectedList, null, 2)}</code></pre> */}
        </FormItem>
      )}
    />

  )
}
