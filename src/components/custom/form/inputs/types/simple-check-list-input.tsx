"use client";

import { JSX, useState } from "react";
import { Card, Label, Checkbox } from "@/src/components/ui";
import { BaseInput } from "../base";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { FieldProps, InputOption } from "../base/definitions";
import { cn } from "@/src/lib/utils";

export class SimpleCheckListInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return (
      <FormField
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FieldSimpleCheckList
            input={input}
            value={field.value || []}
            onChange={field.onChange}
          />
        )}
      />
    );
  }
}

interface Props {
  input: FieldProps;
  value: InputOption[];
  onChange: (value: InputOption[]) => void;
}

export const FieldSimpleCheckList = ({ input, value, onChange }: Props) => {
  const mockInputOptions: InputOption[] = [
    { id: 1, name: "MOCK OPTION - CREATE", checked: false },
    { id: 2, name: "MOCK OPTION - READ", checked: true },
    { id: 3, name: "MOCK OPTION - UPDATE", checked: false },
    { id: 4, name: "MOCK OPTION - DELETE", checked: false },
  ];

  // Usa las opciones del input o las mock
  const initialOptions =
    (input.listConfig?.list as InputOption[]) ?? mockInputOptions;

  // Estado local sincronizado con el form
  const [options, setOptions] = useState<InputOption[]>(
    value.length > 0 ? value : initialOptions
  );

  const allChecked = options.every((opt) => opt.checked);

  const handleMainToggle = (checked: boolean) => {
    const updated = options.map((opt) => ({ ...opt, checked }));
    setOptions(updated);
    onChange(updated); // sincroniza con el form
  };

  const handleChildToggle = (option: InputOption, checked: boolean) => {
    const updated = options.map((opt) =>
      opt.id === option.id ? { ...opt, checked } : opt
    );
    setOptions(updated);
    onChange(updated); // sincroniza con el form
  };

  return (
    <Card className="p-4 space-y-3">
      <FormItem>
        <div className="flex items-center justify-between p-2 border-b">
          <FormLabel className="font-semibold">{input.label || input.name}</FormLabel>
          <div className="flex items-center gap-2">
            <Label htmlFor="main">Seleccionar todo</Label>
            <Checkbox
              id="main"
              checked={allChecked}
              onCheckedChange={handleMainToggle}
            />
          </div>
        </div>

        <FormControl>
          <div className="space-y-2 mt-3">
            {options.map((opt, index) => (
              <div
                key={opt.id}
                className={cn(
                  "p-2 rounded-lg flex justify-items-start gap-2 items-center",
                  index % 2 ? "bg-black/5" : "bg-white/5"
                )}
              >
                <Checkbox
                  id={String(opt.id)}
                  checked={opt.checked || false}
                  onCheckedChange={(checked) =>
                    handleChildToggle(opt, checked as boolean)
                  }
                />
                <Label htmlFor={String(opt.id)}>{opt.label || opt.name}</Label>
              </div>
            ))}
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    </Card>
  );
};
