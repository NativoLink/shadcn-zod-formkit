"use client"
import React, { JSX, useEffect, useState } from "react"
import { ColorPicker, IColor, useColor } from "react-color-palette"
import { UseFormReturn } from "react-hook-form"
import "react-color-palette/css"
import { cn } from "@/src/lib/utils"
import { 
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover, 
  PopoverContent, 
  PopoverTrigger,
} from "@/src/components/ui"
import { BaseInput, FieldProps } from "../base"
// ...existing code...

export class ColorInput extends BaseInput {
  render(): JSX.Element {
    const { input, form } = this;
    return (
      <FieldColor input={input} form={form} />
    )
  }
}

type HideInputOption = "rgb" | "hsv" | "hex";

interface Props {
  form: UseFormReturn
  input: FieldProps
}

const FieldColor = ({ form, input }: Props) => {
  const [ColorCmp, _setColorCmp] = useState<any>(ColorComp)
  return (
    <FormField
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl>
            {ColorCmp ? (
              <ColorCmp
                value={field.value || "#000000"}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={input.disabled}
                placeholder={input.placeHolder}
              />
            ) : (
              <input
                type="color"
                value={field.value || "#000000"}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={() => field.onBlur()}
                disabled={input.disabled}
                placeholder={input.placeHolder}
                style={{ width: 48, height: 28 }}
              />
            )}
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
// ...existing code...


export interface ColorCompProps {
  value?: string;
  onChange?: (color: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  hideInput?: HideInputOption[];
}

const ColorComp = React.forwardRef<HTMLButtonElement, ColorCompProps>(
  ({ value = "#000000", onChange, onBlur, disabled, className, hideInput =["hsv"] }, ref) => {
    const [color, setColor] = useColor(value)
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
      if (value !== color.hex) {
        setColor({ ...color, hex: value })
      }
    }, [color, setColor, value])

    const handleColorChange = (newColor: IColor) => {
      setColor(newColor)
      onChange?.(newColor.hex)
    }

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen)
      if (!newOpen) {
        onBlur?.()
      }
    }

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border border-border rounded-sm" style={{ backgroundColor: color.hex, width: 20, height:20 }} />
              <span>{color.hex}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <ColorPicker color={color} onChange={handleColorChange} hideInput={hideInput} />
        </PopoverContent>
      </Popover>
    )
  },
)