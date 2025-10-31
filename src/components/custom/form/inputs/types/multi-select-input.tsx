'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,

} from "@/src/components/ui";
import { Check, ChevronsUpDown } from "lucide-react";
import { BaseInput } from "../base";
import { FieldProps, InputOption } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/src/lib/utils";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command";

export class MultiSelectInput extends BaseInput {
  render() {
    const { input, form, isSubmitting } = this;
    return <FieldMultiSelect input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldMultiSelect = ({ form, input, isSubmitting }: Props) => {
  const mockInputOptions: InputOption[] = [
    { id: 1, name: "PERMISO 1" },
    { id: 2, name: "PERMISO 2" },
    { id: 3, name: "PERMISO 3" },
    { id: 4, name: "PERMISO 4" },
  ];

  const lista = (input?.listConfig?.list ?? mockInputOptions) as InputOption[];

  const optionValue = input?.listConfig?.optionValue ?? input.optionValue ?? "id";

  const getValue = (item: InputOption) => {
    if (optionValue === "name") return item[optionValue];
    return item.value ?? item.id;
  };

  const [open, setOpen] = useState(false);

  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        const toggleOption = (value: string) => {
          const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
          field.onChange(newValues);
        };

        return (
          <FormItem className="flex flex-col rounded-lg border p-3 shadow bg-blue-100/20">
            <FormLabel><b>{input.label}</b></FormLabel>
            {input.description && <FormDescription>{input.description}</FormDescription>}

            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={input.disabled || isSubmitting}
                    className={cn(
                      "justify-between w-full bg-black/10 dark:bg-white/10",
                      !selectedValues.length && "text-muted-foreground"
                    )}
                  >
                    {selectedValues.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedValues.map((val) => {
                          const option = lista.find(
                            (item) => getValue(item).toString() === val
                          );
                          return (
                            <Badge key={val} variant="secondary">
                              {option?.name ?? val}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <span>{input.placeHolder ?? "Selecciona..."}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                      <CommandEmpty>No hay resultados.</CommandEmpty>
                      <CommandGroup>
                        {lista.map((item) => {
                          const value = getValue(item).toString();
                          const selected = selectedValues.includes(value);
                          return (
                            <CommandItem
                              key={value}
                              onSelect={() => toggleOption(value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {item.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
