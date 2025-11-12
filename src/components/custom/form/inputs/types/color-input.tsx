"use client"
import React, { JSX, useEffect, useState } from "react"
import { ColorPicker, useColor } from 'react-color-palette';
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
import { BaseInput, FieldProps, handleOnChage } from "../base"
// ...existing code...

export class ColorInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldColor input={input} form={form} isSubmitting={isSubmitting} />
    )
  }
}

type HideInputOption = "rgb" | "hsv" | "hex";

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#64748b", // slate
  "#000000", // black
]


const FieldColor = ({ form, input, isSubmitting }: Props) => {
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
                onChange={(event: any[])=> {
                  handleOnChage(event, input, field)
                }}
                onBlur={field.onBlur}
                disabled={input.disabled || isSubmitting}
                placeholder={input.placeHolder}
              />
            ) : (
              'N/A'
              // <input
              //   type="color"
              //   value={field.value || "#000000"}
              //   onChange={(e) => {
              //     field.onChange(e.target.value);
              //     input.onChange?.(e)
              //   }}
              //   onBlur={() => field.onBlur()}
              //   disabled={input.disabled || isSubmitting}
              //   placeholder={input.placeHolder}
              //   style={{ width: 48, height: 28 }}
              // />
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
    // const [color, setColor] = useColor(value)
    // const [open, setOpen] = React.useState(false)

    // React.useEffect(() => {
    //   if (value !== color.hex) {
    //     setColor({ ...color, hex: value })
    //   }
    // }, [color, setColor, value])

    // const handleColorChange = (newColor: IColor) => {
    //   setColor(newColor)
    //   onChange?.(newColor.hex)
    // }

    // const handleOpenChange = (newOpen: boolean) => {
    //   setOpen(newOpen)
    //   if (!newOpen) {
    //     onBlur?.()
    //   }
    // }

    const [color, setColor] = useColor(value)
    const [open, setOpen] = useState(false)

    React.useEffect(() => {
      if (value !== color.hex) {
        setColor({ ...color, hex: value })
      }
    }, [value])

    const handleColorChange = (newColor: string) => {
      setColor({ ...color, hex: newColor })
      onChange?.(newColor)
    }

    const handlePickerChange = (newColor: any) => {
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 p-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              disabled={disabled}
              className={cn(
                "size-6 rounded-md border-2 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed",
                color.hex === presetColor
                  ? "border-foreground ring-2 ring-foreground/20"
                  : "border-border hover:border-foreground/50",
              )}
              style={{ backgroundColor: presetColor }}
              onClick={() => handleColorChange(presetColor)}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
        </div>
        
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
            <ColorPicker color={color} onChange={handlePickerChange} hideInput={hideInput} />
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)