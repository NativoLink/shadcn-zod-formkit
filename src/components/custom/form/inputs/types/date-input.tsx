"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { BaseInput } from "../base"
import { JSX } from "react"
import { cn } from '@/src/lib/utils';
import { Card } from "@/src/components/ui/card"


export class DateInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    
    const formField = <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => {
        // 🔑 Inicializa el estado con el valor actual del formulario (si existe)
        const [date, setDate] = React.useState<Date | undefined>(
          field.value ? new Date(field.value) : undefined
        )

        // 🔑 Sincroniza el estado con el form cuando cambie
        React.useEffect(() => {
          if (field.value && !date) {
            setDate(new Date(field.value))
          }
        }, [field.value])

        const handleSelect = (selectedDate?: Date) => {
          setDate(selectedDate)
          field.onChange(selectedDate) // <-- Actualiza el form
        }

        return (
          <FormItem>
            <FormLabel><b>{input.label}</b></FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                {/* <div className="flex flex-col justify-start gap-2 "> */}
                <FormControl>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>{input.placeHolder ?? 'Fecha'}</span>}
                  </Button>
                </FormControl>
                {/* </div> */}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleSelect}
                  initialFocus />
              </PopoverContent>
            </Popover>
            <FormDescription>{input.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )
      } } />
  return <>{formField}</>;
  }
}


