"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, CircleCheck, CircleX, Info, Loader2 } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { BaseInput, FieldProps, handleOnChage, isValidField } from "../base"
import { JSX, useState } from "react"
import { cn } from '@/src/lib/utils';
import { UseFormReturn } from "react-hook-form"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText } from "@/src/components/ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components"

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean; // estado submit externo opcional
}

interface DateRange {
  from?: Date;
  to?: Date;
}

export class DateRangeInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldDateRangeInput input={input} form={form} isSubmitting={isSubmitting} />;
  }
}

const FieldDateRangeInput = ({ form, input, isSubmitting }: Props) => {
  const [isValid, setIsValid] = useState<boolean>(isValidField(input, form));
  const infoTooltip = input?.infoTooltip;
  const groupConfig = input.inputGroupConfig;
  const autoValidate = groupConfig?.autoValidIcons ?? input.zodType ? true : false;

  const iconValidState = <CircleCheck style={{ color: "#00bf3e" }} />;
  const iconInvalidState = <CircleX style={{ color: "#ff8080" }} />;
  const iconLoadingState = <Loader2 className="animate-spin" style={{ color: "#1e90ff" }} />;

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

      // 🔑 Inicializa el estado con el valor actual del formulario (si existe)
      const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
        field.value ? {
          from: field.value.from ? new Date(field.value.from) : undefined,
          to: field.value.to ? new Date(field.value.to) : undefined
        } : undefined
      );

      // 🔑 Sincroniza el estado con el form cuando cambie
      React.useEffect(() => {
        if (field.value && !dateRange) {
          setDateRange({
            from: field.value.from ? new Date(field.value.from) : undefined,
            to: field.value.to ? new Date(field.value.to) : undefined
          });
          setIsValid(isValidField(input, form));
        }
      }, [field.value]);

      const handleSelect = (selectedRange?: DateRange) => {
        setDateRange(selectedRange);
        handleOnChage(selectedRange, input, field);
      };

      const formatDateRange = (range?: DateRange) => {
        if (!range || !range.from) return input.placeHolder ?? 'Seleccionar rango de fechas';
        if (range.to) {
          return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`;
        }
        return format(range.from, "LLL dd, y");
      };

      return (
        <FormItem>
          <FormLabel><b>{input.label}</b></FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <InputGroup className="flex flex-row gap-1">
                  {/* Tooltip de información */}
                  {infoTooltip && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{infoTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left py-0.5 ",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <div className="flex flex-1 items-center gap-1 justify-start text-left ">
                      <CalendarIcon />
                      {formatDateRange(dateRange)}
                    </div>
                    {(iconsRight.length > 0 || textRight || autoValidate) && (
                      <>
                        {textRight && <InputGroupText>{textRight}</InputGroupText>}
                        {iconsRight.map((IconComponent, index) => (
                          <IconComponent key={index} size={24} className="w-6! h-6!" />
                        ))}

                        {autoValidate && (
                          <div>
                            {isSubmitting
                              ? iconLoadingState
                              : isValid
                              ? iconValidState
                              : iconInvalidState}
                          </div>
                        )}
                      </>
                    )}
                  </Button>
                </InputGroup>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {/* <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                captionLayout={'dropdown'}
                initialFocus
              /> */}
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