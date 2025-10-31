'use client'

import { JSX, useState, useMemo } from "react";
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
import { BaseInput } from "../base/base-input";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";

export class CurrencyInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldCurrency input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

/**
 * Campo numérico con formato monetario.
 * Acepta solo números y el punto mientras se edita.
 */
interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export const FieldCurrency = ({ form, input, isSubmitting }: Props): JSX.Element => {
  const groupConfig = input.inputGroupConfig;
  const infoTooltip = input?.infoTooltip;
  const autoValidate = groupConfig?.autoValidIcons;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

  // Estado local para manejar validez desde el primer render
  const [isValid, setIsValid] = useState<boolean>(() => {
    const value = form.getValues(input.name);
    const fieldState = form.getFieldState(input.name);
    return !fieldState.error && value !== undefined && value !== "";
  });

  const defaultCurrencyFormat: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const mask = input?.mask;
  const currencyFormat = input?.currencyFormat ?? defaultCurrencyFormat;

  const [rawValue, setRawValue] = useState<string>(form.getValues(input.name) ?? "");

  // Formateador monetario (por defecto: español - República Dominicana)
  const formatter = useMemo(() => {
    return new Intl.NumberFormat('es-DO', currencyFormat);
  }, [currencyFormat]);

  // 🔢 Limpia y convierte el texto a número
  const parseValue = (formatted: string): number | null => {
    const numeric = parseFloat(formatted.replace(/[^0-9.-]/g, ""));
    return isNaN(numeric) ? null : numeric;
  };

  // 🎨 Aplica formato visual
  const formatValue = (value: string): string => {
    if (!value) return "";
    const numeric = parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (isNaN(numeric)) return "";

    if (typeof mask === "string") {
      return mask.replace(/0+(?:[.,]0+)?/, formatter.format(numeric).replace(/[^\d.,]/g, ""));
    }

    if (mask instanceof RegExp) {
      const valid = mask.test(value);
      return valid ? value : rawValue;
    }

    return formatter.format(numeric);
  };

  // 🚫 Permite solo números y punto
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    // Permitir navegación y borrado
    if (allowedKeys.includes(e.key)) return;

    // Permitir solo dígitos y un único punto decimal
    if (!/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Impedir más de un punto
    if (e.key === "." && rawValue.includes(".")) {
      e.preventDefault();
    }
  };

  return (
    <FormField
      control={form.control}
      name={input.name}
      render={({ field, fieldState }) => {
        const validNow = !fieldState.error && field.value !== undefined && field.value !== "";
        if (validNow !== isValid) setIsValid(validNow);
        return (
        <FormItem className={input.className}>
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl>
            <InputGroup>
              {/* Prefijo */}
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
                {input.inputGroupConfig?.textLeft && (
                  <InputGroupText>{input.inputGroupConfig.textLeft}</InputGroupText>
                )}
              </InputGroupAddon>

              {/* Input principal */}
              <InputGroupInput
                {...field}
                disabled={input.disabled || isSubmitting}
                placeholder={input.placeHolder ?? "0.00"}
                inputMode="decimal"
                value={rawValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setRawValue(newVal);
                  const parsed = parseValue(newVal);
                  if (parsed !== null) field.onChange(parsed);
                }}
                onBlur={(e) => {
                  const formatted = formatValue(e.target.value);
                  setRawValue(formatted);
                }}
                onFocus={(e) => {
                  const numeric = e.target.value.replace(/[^0-9.-]/g, "");
                  setRawValue(numeric);
                }}
              />

              {/* Sufijo */}
              <InputGroupAddon align="inline-end">
                <InputGroupText>{currencyFormat.currency}</InputGroupText>
                {input.inputGroupConfig?.textRight && (
                  <InputGroupText>{input.inputGroupConfig.textRight}</InputGroupText>
                )}
                {/* Icono de validación / loading */}
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
      )}}
    />
  );
};
