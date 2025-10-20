'use client'
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "../../../../../components/ui"
import { BaseInput } from "../base";
import { FieldProps, InputOption } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";



export class SelectInput extends BaseInput {
  
  render() {
    const { input, form } = this;
    return ( <FieldSelect input={input} form={form} /> );
  }
}

interface Props {
  form: UseFormReturn
  input: FieldProps
}

const FieldSelect = ({ form, input }: Props) => {
  const mockInputOptions:InputOption[] = [
      { id: 1, name: 'MOCK OPTION - PERMISO 1', checked: false },
      { id: 2, name: 'MOCK OPTION - PERMISO 2', checked: true },
      { id: 3, name: 'MOCK OPTION - PERMISO 3', checked: false },
      { id: 4, name: 'MOCK OPTION - PERMISO 4', checked: false },
    ]
  let lista = input?.listConfig?.list ?? mockInputOptions as InputOption[]
  if (lista == undefined) lista = []

  const value: string = input.value ?? ""
  const optionValue = input?.listConfig?.optionValue ?? input.optionValue ?? "id"


  const getValue = (item: InputOption) => {
    if (optionValue == "name") return item[optionValue]
    return item.value ?? item.id
  }

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-lg bg-blue-100/20">
          <div className="space-y-0.5 pr-5">
            <FormLabel><b>{input.label}</b></FormLabel>
            {/* <label>items: {lista.length}</label> */}
            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </div>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={value.toString()} value={field.value?.toString() ?? value.toString()}>
              <FormControl>
                <SelectTrigger className="w-[60%] bg-black/10 dark:bg-white/25">
                  <SelectValue placeholder={input.placeHolder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {lista
                  .filter((item): item is InputOption => (item as InputOption).name !== undefined)
                  .map((item) => (
                    <SelectItem value={ getValue(item).toString()} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormControl>
          {/* <pre><b>{JSON.stringify(field.value, null, 2) } </b> </pre> */}
        </FormItem>
      )}
      />
  )
}

