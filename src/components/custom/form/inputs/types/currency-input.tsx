'use client'

import { JSX, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/src/components/ui/form";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupText 
} from "@/src/components/ui/input-group";
import { FieldProps } from "../base/definitions";
import { BaseInput, handleOnChage } from "../base/base-input";
import { CircleCheck, CircleX, Keyboard, Loader2 } from "lucide-react";
import { useKeyboardStore } from "../../../keyboard/providers/keyboard.store";

export class CurrencyInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldCurrency input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export const FieldCurrency = ({ form, input, isSubmitting }: Props): JSX.Element => {

  const setIsOpen = useKeyboardStore((state) => state.setIsOpen);
  const setCurrentInputField = useKeyboardStore((state) => state.setCurrentInputField);

  const withKeyboard = input.withKeyboard;
  const autoValidate = input.inputGroupConfig?.autoValidIcons;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  const formatter = useMemo(() => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: input?.currencyFormat?.currency ?? 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [input?.currencyFormat]);

  const parseValue = (val: string): number | null => {
    const numeric = parseFloat(val.replace(/[^0-9.-]/g, ""));
    return isNaN(numeric) ? null : numeric;
  };

  const formatValue = (val: number | null): string => {
    if (val === null || val === undefined) return "";
    return formatter.format(val);
  };

  return (
    <FormField
      control={form.control}
      name={input.name}
      render={({ field, fieldState }) => {

        const [displayValue, setDisplayValue] = useState<string>(() => {
          return field.value ? formatValue(field.value) : "";
        });

        const isValid = !fieldState.error && field.value !== undefined && field.value !== "";

        return (
          <FormItem className={`${input.withLateralLabel ? 'flex items-center gap-2' : ''} ${input.className}`}>
            
            <FormLabel className={`${input.withLateralLabel ? 'w-32 text-right' : ''}`}>
              <b>{input.label}</b>
            </FormLabel>

            <FormControl>
              <InputGroup>

                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>

                <InputGroupInput
                  ref={field.ref}
                  name={field.name}
                  disabled={input.disabled || isSubmitting}
                  placeholder="0.00"
                  inputMode="decimal"

                  value={displayValue}

                  onFocus={(e) => {
                    // 👉 quitar formato para edición natural
                    const raw = field.value ? String(field.value) : "";
                    setDisplayValue(raw);

                    setCurrentInputField({ input, field });
                  }}

                  onChange={(e) => {
                    const val = e.target.value;

                    // 👉 permitir escribir libremente (teclado físico OK)
                    setDisplayValue(val);

                    const parsed = parseValue(val);
                    field.onChange(parsed);
                    handleOnChage(parsed, input, field);
                  }}

                  onBlur={() => {
                    // 👉 aplicar formato bonito al salir
                    const formatted = formatValue(field.value);
                    setDisplayValue(formatted);
                  }}
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupText>
                    {input?.currencyFormat?.currency ?? 'USD'}
                  </InputGroupText>

                  {withKeyboard && (
                    <button
                      type="button"
                      className="text-2xl"
                      onClick={() => {
                        setIsOpen();
                        setCurrentInputField({ input, field });
                      }}
                    >
                      <Keyboard />
                    </button>
                  )}

                  {autoValidate && (
                    <div>
                      {isSubmitting
                        ? iconLoadingState
                        : isValid
                          ? iconValidState
                          : iconInvalidState}
                    </div>
                  )}
                </InputGroupAddon>

              </InputGroup>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};