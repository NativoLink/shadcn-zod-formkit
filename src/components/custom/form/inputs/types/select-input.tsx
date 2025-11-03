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
} from "@/src/components/ui"
import { BaseInput } from "../base";
import { FieldProps, InputOption } from "../base/definitions";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";

export class SelectInput extends BaseInput {
  render() {
    const { input, form, isSubmitting } = this;
    return <FieldSelect input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldSelect = ({ form, input, isSubmitting }: Props) => {
  const mockInputOptions: InputOption[] = [
    { value: 1, id: 1, name: 'MOCK OPTION - PERMISO 1' },
    { value: 2, id: 2, name: 'MOCK OPTION - PERMISO 2' },
    { value: 3, id: 3, name: 'MOCK OPTION - PERMISO 3' },
    { value: 4, id: 4, name: 'MOCK OPTION - PERMISO 4' },
  ];

  const lista: InputOption[] = (input?.listConfig?.list?.every((item): item is InputOption => 'name' in item) 
    ? input.listConfig.list 
    : mockInputOptions) as InputOption[];
  const optionValue = input?.listConfig?.optionValue ?? input.optionValue ?? "id";

  const [value, setValue] = useState<string>(
    input.value?.toString() ?? ""
  );

  // 🧠 Sincroniza el valor inicial con react-hook-form
  useEffect(() => {
    const currentValue = form.getValues(input.name);
    if (!currentValue && input.value) {
      form.setValue(input.name, input.value);
      setValue(input.value.toString());
    }
  }, [form, input.name, input.value]);

  const getValue = (item: InputOption): string => {
    return (optionValue === "name" ? item.name.toString() : item.value.toString() ?? item.id).toString();
  };

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => {
        const currentValue = field.value?.toString() ?? value;

        return (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-lg bg-blue-100/20">
            <div className="space-y-0.5 pr-5">
              <FormLabel><b>{input.label}</b></FormLabel>
              {input.description && <FormDescription>{input.description}</FormDescription>}
              <FormMessage />
            </div>

            <FormControl>
              <Select
                disabled={input.disabled || isSubmitting}
                onValueChange={(val) => {
                  field.onChange(val);
                  setValue(val);
                }}
                value={currentValue || undefined}
              >
                <FormControl>
                  <SelectTrigger className="w-[60%] bg-black/10 dark:bg-white/25">
                    <SelectValue placeholder={input.placeHolder} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {lista.map((item) => (
                    <SelectItem value={getValue(item)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            {/* Debug visual */}
            {/* <pre><b>{JSON.stringify(field, null, 2)}</b></pre> */}
          </FormItem>
        );
      }}
    />
  );
};
