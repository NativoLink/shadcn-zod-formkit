"use client"

import * as React from "react"
import { ColorPicker, IColor, useColor } from "react-color-palette"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import "react-color-palette/css"

export interface Props {
  value?: string
  onChange?: (color: string) => void
  onBlur?: () => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

const ColorCnInput = React.forwardRef<HTMLButtonElement, Props>(
  ({ value = "#000000", onChange, onBlur, disabled, className }, ref) => {
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
              <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: color.hex }} />
              <span>{color.hex}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <ColorPicker color={color} onChange={handleColorChange} hideInput={["rgb", "hsv"]} />
        </PopoverContent>
      </Popover>
    )
  },
)

ColorCnInput.displayName = "ColorCnInput"

export { ColorCnInput }
