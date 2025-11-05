"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

import { BaseInput, handleOnChage } from "../base";
import { FieldProps, InputOption } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";

export class ComboboxInput extends BaseInput {
  render() {
    const { input, form, isSubmitting } = this;
    return <FieldCombobox input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldCombobox = ({ form, input, isSubmitting }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<InputOption[]>(
    () =>
      input.listConfig?.list?.length
        ? (input.listConfig.list as InputOption[])
        : []
  );

  const optionValue = input?.listConfig?.optionValue ?? input.optionValue ?? "id";
  const [value, setValue] = React.useState<string>(input.value?.toString() ?? "");

  // 🔁 Si depende de otro campo
  React.useEffect(() => {
    const dependsOn = input.dependsOn;
    if (!dependsOn || !input.loadOptions) return;

    const subscription = form.watch(async (values) => {
      const parentValue = values[dependsOn];
      if (parentValue) {
        const loader = input.loadOptions!;
        const newOptions = await loader(parentValue);
        setOptions(newOptions as InputOption[]);
        form.setValue(input.name, "");
        setValue("");
      } else {
        setOptions([]);
      }
    });

    return () => subscription.unsubscribe?.();
  }, [form, input.loadOptions, input.dependsOn]);

  // Sincronizar valor inicial
  React.useEffect(() => {
    const currentValue = form.getValues(input.name);
    if (!currentValue && input.value) {
      form.setValue(input.name, input.value);
      setValue(input.value.toString());
    }
  }, [form, input.name, input.value]);

  const getValue = (item: InputOption): string =>
    (optionValue === "name"
      ? item.name
      : item.value?.toString() ?? item.id?.toString()) ?? "";

  const selectedOption = options.find((o) => getValue(o) === value);

  return (
    <div className="flex flex-col gap-2">
      {input.label && (
        <label className="font-medium text-sm">{input.label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={input.disabled || isSubmitting}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[60%] justify-between bg-black/10 dark:bg-white/25"
          >
            {selectedOption ? selectedOption.name : input.placeHolder ?? "Seleccionar..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[60%] p-0">
          <Command
            filter={(value, search) => {
              const option = options.find((o) => getValue(o) === value);
              return option?.name?.toLowerCase().includes(search.toLowerCase())
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder={`Buscar ${input.label?.toLowerCase()}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={getValue(item)}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value ? "" : currentValue;
                      setValue(newValue);
                      form.setValue(input.name, newValue);
                      handleOnChage(options.find((o) => getValue(o) === newValue), input)
                      input.listConfig?.onOptionChange?.(
                        options.find((o) => getValue(o) === newValue)
                      );
                      setOpen(false);
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === getValue(item) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
