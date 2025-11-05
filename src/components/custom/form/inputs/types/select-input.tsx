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
  SelectValue,
} from "@/src/components/ui";
import { BaseInput, handleOnChage } from "../base";
import { FieldProps, InputOption } from "../base/definitions";
import { UseFormReturn } from "react-hook-form";
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
    { value: 1, id: 1, name: "MOCK OPTION - PERMISO 1" },
    { value: 2, id: 2, name: "MOCK OPTION - PERMISO 2" },
    { value: 3, id: 3, name: "MOCK OPTION - PERMISO 3" },
    { value: 4, id: 4, name: "MOCK OPTION - PERMISO 4" },
  ];

  // 🧩 Estado interno para lista y valor seleccionado
  const [lista, setLista] = useState<InputOption[]>(
    (input?.listConfig?.list?.every((item): item is InputOption => "name" in item)
      ? input.listConfig.list
      : mockInputOptions) as InputOption[]
  );
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>(input.value?.toString() ?? "");

  const optionValue = input?.listConfig?.optionValue ?? input.optionValue ?? "id";

  // 🧠 Sincroniza el valor inicial con react-hook-form
  useEffect(() => {
    const currentValue = form.getValues(input.name);
    if (!currentValue && input.value) {
      form.setValue(input.name, input.value);
      setValue(input.value.toString());
    }
  }, [form, input.name, input.value]);

  // 🪄 Nuevo: escucha cambios en el campo del que depende (si existe)
  useEffect(() => {
    if (input.dependsOn && input.loadOptions) {
      const subscription = form.watch(async (values) => {
        const dependencyValue = values[input.dependsOn!];
        if (dependencyValue) {
          try {
            setLoading(true);
            const newOptions = await input.loadOptions!(dependencyValue);
            setLista(newOptions);
          } catch (err) {
            console.error(`Error loading options for ${input.name}:`, err);
            setLista([]);
          } finally {
            setLoading(false);
          }
        } else {
          // Limpia opciones si el campo dependiente se vacía
          setLista([]);
          form.setValue(input.name, ""); // limpia selección
        }
      });

      // cleanup
      return () => subscription.unsubscribe?.();
    }
  }, [form, input.dependsOn, input.loadOptions, input.name]);

  const getValue = (item: InputOption): string => {
    const val =
      optionValue === "name"
        ? item.name
        : item.value?.toString?.() ?? item.id?.toString();
    return val?.toString() ?? "";
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
              <FormLabel>
                <b>{input.label}</b>
              </FormLabel>
              {input.description && (
                <FormDescription>{input.description}</FormDescription>
              )}
              <FormMessage />
            </div>

            <FormControl>
              <Select
                disabled={input.disabled || isSubmitting || loading}
                onValueChange={(val) => {
                  handleOnChage(val, input, field)
                  // field.onChange(val);
                  setValue(val);

                  // 🔸 Ejecuta el callback definido si existe
                  if (input.listConfig?.onOptionChange) {
                    const selectedItem = lista.find(
                      (item) => getValue(item) === val
                    );
                    input.listConfig.onOptionChange(selectedItem);
                  }
                }}
                value={currentValue || undefined}
              >
                <FormControl>
                  <SelectTrigger className="w-[60%] bg-black/10 dark:bg-white/25">
                    <SelectValue
                      placeholder={
                        loading
                          ? "Cargando..."
                          : input.placeHolder ?? "Seleccionar"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {lista.map((item) => (
                    <SelectItem value={getValue(item)} key={`${input.name}-${item.id}-s`}>
                      {item.name}
                    </SelectItem>
                  ))}
                  {lista.length === 0 && !loading && (
                    <div className="p-2 text-sm text-muted-foreground">
                      No hay opciones disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
