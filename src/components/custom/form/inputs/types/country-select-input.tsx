"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { BaseInput, FieldProps, handleOnChage, isValidField } from "../base"
import { JSX, useState } from "react"
import { cn } from '@/src/lib/utils';
import { UseFormReturn } from "react-hook-form"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText } from "@/src/components/ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components"

interface Country {
  name: string
  code: string
  flag: string
}

const countries: Country[] = [
  { name: "Afghanistan", code: "AF", flag: "🇦🇫" },
  { name: "Albania", code: "AL", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", flag: "🇩🇿" },
  { name: "Argentina", code: "AR", flag: "🇦🇷" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "Austria", code: "AT", flag: "🇦🇹" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
  { name: "Belgium", code: "BE", flag: "🇧🇪" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Chile", code: "CL", flag: "🇨🇱" },
  { name: "China", code: "CN", flag: "🇨🇳" },
  { name: "Colombia", code: "CO", flag: "🇨🇴" },
  { name: "Denmark", code: "DK", flag: "🇩🇰" },
  { name: "Egypt", code: "EG", flag: "🇪🇬" },
  { name: "Finland", code: "FI", flag: "🇫🇮" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "Greece", code: "GR", flag: "🇬🇷" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩" },
  { name: "Ireland", code: "IE", flag: "🇮🇪" },
  { name: "Italy", code: "IT", flag: "🇮🇹" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", flag: "🇯🇴" },
  { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "South Korea", code: "KR", flag: "🇰🇷" },
  { name: "Lebanon", code: "LB", flag: "🇱🇧" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾" },
  { name: "Mexico", code: "MX", flag: "🇲🇽" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { name: "Norway", code: "NO", flag: "🇳🇴" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰" },
  { name: "Peru", code: "PE", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", flag: "🇵🇭" },
  { name: "Poland", code: "PL", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", flag: "🇵🇹" },
  { name: "Romania", code: "RO", flag: "🇷🇴" },
  { name: "Russia", code: "RU", flag: "🇷🇺" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "Spain", code: "ES", flag: "🇪🇸" },
  { name: "Sweden", code: "SE", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭" },
  { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Turkey", code: "TR", flag: "🇹🇷" },
  { name: "Ukraine", code: "UA", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳" },
]

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export class CountrySelectInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldCountrySelectInput input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

const FieldCountrySelectInput = ({ form, input, isSubmitting }: Props) => {
  const [isValid, setIsValid] = useState<boolean>(isValidField(input, form));
  const infoTooltip = input?.infoTooltip;
  const groupConfig = input.inputGroupConfig;
  const autoValidate = groupConfig?.autoValidIcons ?? input.zodType ? true : false;

  const iconValidState = <Check style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <Check style={{ color: "#ff8080" }} />;

  const iconsRight = groupConfig?.iconsRight ?? [];
  const iconsLeft = groupConfig?.iconsLeft ?? [];
  const textLeft = groupConfig?.textLeft;
  const textRight = groupConfig?.textRight;

  const formField = <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field }) => {
      setIsValid(isValidField(input, form));

      const [open, setOpen] = React.useState(false)
      const [value, setValue] = React.useState(field.value || "")

      const selectedCountry = countries.find(country => country.code === value)

      const handleSelect = (countryCode: string) => {
        setValue(countryCode)
        setOpen(false)
        handleOnChage(countryCode, input, field)
      }

      return (
        <FormItem>
          <FormLabel><b>{input.label}</b></FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <InputGroup className="flex flex-row gap-1">
                  {infoTooltip && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Globe size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{infoTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCountry ? (
                      <div className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                        <span className="text-muted-foreground">({selectedCountry.code})</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{input.placeHolder ?? 'Select country...'}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {(iconsRight.length > 0 || textRight || autoValidate) && (
                    <>
                      {textRight && <InputGroupText>{textRight}</InputGroupText>}
                      {iconsRight.map((IconComponent, index) => (
                        <IconComponent key={index} size={24} className="w-6! h-6!" />
                      ))}

                      {autoValidate && (
                        <div>
                          {isValid ? iconValidState : iconInvalidState}
                        </div>
                      )}
                    </>
                  )}
                </InputGroup>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search countries..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={`${country.name} ${country.code}`}
                        onSelect={() => handleSelect(country.code)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === country.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="mr-2">{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="ml-auto text-muted-foreground">({country.code})</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      );
    }}
  />;
  return <>{formField}</>;
};