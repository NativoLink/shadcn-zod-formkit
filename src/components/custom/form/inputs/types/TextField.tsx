
import { useEffect } from 'react';
import { Info } from 'lucide-react';
import { InputGroupAddon, InputGroupText } from '@/src/components/ui';
import { cn } from '@/src/lib';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { TextInputType, ActiveColorType, TextFieldProps, sizeClasses, activeColorClasses } from '../base';



export const TextField = ({
  name,
  value,
  isActive = false,
  onFocus,

  onKeyPress,
  onDelete,
  onSpace,

  infoTooltip,
  textLeft,
  textRight,
  iconsLeft = [],
  iconsRight = [],

  size = 'md',
  disabled = false,
  hidden = false,

  prefix,
  suffix,
  placeholder = '',
  className,

  activeColor = ActiveColorType.amber,
  inputType = TextInputType.DEFAULT
}: TextFieldProps) => {

  // 🔥 KEYBOARD (DESACOPLADO)
  useEffect(() => {
    if (!isActive || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        onDelete?.();
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        onKeyPress?.(e.key);
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        onSpace?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, disabled, onKeyPress, onDelete, onSpace]);

  if (hidden) return null;

  const handleClick = () => {
    if (!disabled) {
      onFocus?.(name);
    }
  };

  const displayValue = value ?? '';

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        'flex flex-row items-center gap-3 rounded-xl border-2 transition-all min-h-16 outline-none',
        sizeClasses[size],
        isActive
          ? activeColorClasses[activeColor]
          : 'border-zinc-700/40 hover:border-zinc-600',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer',
        className
      )}
    >
      {prefix && (
        <span className="text-zinc-400 text-xs font-mono font-bold">
          {prefix}
        </span>
      )}

      {(iconsLeft.length > 0 || textLeft) && (
        <InputGroupAddon>
          {textLeft && <InputGroupText>{typeof textLeft === 'string' ? textLeft : ''}</InputGroupText>}
          {iconsLeft.map((IconComponent, index) => (
            <IconComponent key={index} size={20} className="text-zinc-400" />
          ))}
        </InputGroupAddon>
      )}

      {placeholder && displayValue.toString().length == 0 && (
        <span className="font-mono font-bold text-zinc-500/20" style={{color:'#8080807d'}}>
          {placeholder}
        </span>
      )}

      <span className={cn(
        'font-mono font-bold tracking-widest',
        !displayValue && 'text-zinc-500'
      )}>
        {inputType !== TextInputType.PASSWORD
          ? displayValue
          : '•'.repeat(displayValue.toString().length)}
      </span>

      {suffix && (
        <span className="text-zinc-400 text-sm">
          {suffix}
        </span>
      )}

      {(iconsRight.length > 0 || textRight) && (
        <InputGroupAddon className="ml-auto">
          {textRight && <InputGroupText>{textRight}</InputGroupText>}
          {iconsRight.map((IconComponent, index) => (
            <IconComponent key={index} size={20} className="text-zinc-400" />
          ))}
        </InputGroupAddon>
      )}

      {infoTooltip && (
        <span className="mr-auto text-[10px] uppercase tracking-widest">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={20} className="text-zinc-400 hover:text-zinc-200" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{infoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      )}
    </div>
  );
};
