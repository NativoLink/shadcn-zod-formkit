'use client';

import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps } from "../base";
import { useState } from "react";

export class PhoneInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldPhone form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+1-809", country: "DO", flag: "🇩🇴" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+54", country: "AR", flag: "🇦🇷" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+57", country: "CO", flag: "🇨🇴" },
  { code: "+56", country: "CL", flag: "🇨🇱" },
  { code: "+51", country: "PE", flag: "🇵🇪" },
];

const FieldPhone = ({ input, form, isSubmitting }: Props): JSX.Element => {
  const defaultCountryCode = input.defaultCountryCode ?? "+1";
  const [countryCode, setCountryCode] = useState(defaultCountryCode);

  return (
    <FormField
      key={input.name as string}
      control={form.control}
      name={input.name as string}
      render={({ field }) => {
        const phoneNumber = field.value?.replace(countryCode, "").trim() || "";

        return (
          <FormItem className={input.className}>
            <FormLabel><b>{input.label}</b></FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Select
                  value={countryCode}
                  onValueChange={(newCode) => {
                    setCountryCode(newCode);
                    field.onChange(`${newCode} ${phoneNumber}`);
                  }}
                  disabled={input.disabled || isSubmitting}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        <span className="flex items-center gap-2">
                          <span>{item.flag}</span>
                          <span>{item.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const newNumber = e.target.value.replace(/[^\d\s-]/g, "");
                    field.onChange(`${countryCode} ${newNumber}`);
                    input.onChange?.([`${countryCode} ${newNumber}`], form.getValues());
                  }}
                  disabled={input.disabled || isSubmitting}
                  placeholder={input.placeHolder || "Enter phone number"}
                  className="flex-1"
                />
              </div>
            </FormControl>
            {input.description && <FormDescription>{input.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
