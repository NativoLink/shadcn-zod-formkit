'use client'

import { LucideProps } from 'lucide-react'
import { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import { IKey } from './keyboard-builder'
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';

export type KeyFontSize =
  | 'text-xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl'
  | 'text-5xl'
  | 'text-6xl'
  | string

export interface BorderConfig {
  width?: number // grosor en píxeles
  color?: string // color del borde
}

export interface TeclaBorders {
  left?: BorderConfig | string   // solo color o config completa
  right?: BorderConfig | string
  top?: BorderConfig | string
  bottom?: BorderConfig | string
  all?: BorderConfig | string    // aplica a todos los lados
}

interface Props {
  label?: string
  onClick?: (key: string) => void
  onDoubleClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  className?: string
  iconClassName?: string
  iconSize?: number
  shortcut?: string
  style?: CSSProperties
  children?: ReactNode
  withLabel?: boolean
  isActive?: boolean
  fontSize?: KeyFontSize
  icons?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >[]
  /** Configuración de bordes laterales */
  borders?: TeclaBorders
}

// Función helper para normalizar la configuración de borde
function normalizeBorder(border: BorderConfig | string | undefined, defaultWidth = 4): BorderConfig | null {
  if (!border) return null
  if (typeof border === 'string') {
    return { width: defaultWidth, color: border }
  }
  return { width: border.width ?? defaultWidth, color: border.color }
}

// Genera el box-shadow para simular bordes gruesos
function generateBorderShadows(borders: TeclaBorders | undefined): string {
  if (!borders) return 'none'

  const shadows: string[] = []
  
  // Si hay 'all', lo aplicamos a todos los lados
  const allBorder = normalizeBorder(borders.all)
  
  const left = normalizeBorder(borders.left) ?? allBorder
  const right = normalizeBorder(borders.right) ?? allBorder
  const top = normalizeBorder(borders.top) ?? allBorder
  const bottom = normalizeBorder(borders.bottom) ?? allBorder

  // box-shadow inset: x y blur spread color
  // left: inset positivo en X
  if (left?.color) {
    shadows.push(`inset ${left.width}px 0 0 0 ${left.color}`)
  }
  // right: inset negativo en X
  if (right?.color) {
    shadows.push(`inset -${right.width}px 0 0 0 ${right.color}`)
  }
  // top: inset positivo en Y
  if (top?.color) {
    shadows.push(`inset 0 ${top.width}px 0 0 ${top.color}`)
  }
  // bottom: inset negativo en Y
  if (bottom?.color) {
    shadows.push(`inset 0 -${bottom.width}px 0 0 ${bottom.color}`)
  }

  return shadows.length > 0 ? shadows.join(', ') : 'none'
}

export const Key = ({
  label,
  onClick,
  onDoubleClick,
  style,
  disabled = false,
  className,
  shortcut,
  children,
  withLabel = true,
  isActive = false,
  fontSize = 'text-sm',
  icons,
  borders,
  // iconSize = 72,
  iconClassName = 'w-8 h-8'
}: Props) => {
  let content = (
    <>
      {withLabel && label}
      {shortcut && ` (${shortcut})`}
    </>
  )

  if (children) content = <>{children}</>

  const borderShadow = generateBorderShadows(borders)
  const hasBorders = borders && borderShadow !== 'none'

  return (
    <Button
      disabled={disabled}
      onDoubleClick={onDoubleClick}
      onClick={(e) => onClick?.(label ?? e.currentTarget.textContent ?? '')}
      style={{
        ...style,
        ...(hasBorders && { boxShadow: borderShadow }),
      }}
      className={cn(
        // Base
        'shadow-md shadow-black/20',
        'flex flex-1 items-center justify-center rounded-lg h-full w-full',
        'font-mono font-bold transition-all duration-100',
        'active:scale-95',

        fontSize,

        // Estados base (soft UI)
        'border border-(--color-border)',
        'bg-(--color-secondary-soft) text-(--color-foreground)',

        // Hover
        'hover:bg-(--color-accent-soft)',

        // Active click (presionado)
        'active:bg-(--color-primary) active:text-(--color-primary-foreground)',

        // Estado activo (seleccionado)
        isActive &&
          'bg-(--color-primary) text-(--color-primary-foreground) border-(--color-primary)',

        // Backspace especial
        // label === '⌫' &&
        //   'bg-(--color-destructive) text-white hover:opacity-90',

        // Overflow hidden para que los bordes respeten el border-radius
        'overflow-hidden',

        className
      )}
    >
      <div className="flex flex-col justify-center items-center">
        {icons && (
          <div className="flex flex-row justify-center text-3xl">
            {icons.map((IconComponent, index) => (
              <IconComponent
                key={index}
                className={iconClassName}
                // size={iconSize}
              />
            ))}
          </div>
        )}

        {content}
      </div>
    </Button>
  )
}


export const applyCase = (label: string | undefined, upper: boolean): string | undefined => {
  if (!label || label.length !== 1 || !/[a-z]/.test(label)) return label;
  return upper ? label.toUpperCase() : label;
};

export const letter = (l: string, isUpper: boolean, handleKey: (key: string)=> void): IKey => ({
  label: applyCase(l, isUpper),
  onClick: handleKey,
  className: 'flex-1',
});
