import { TextInputType } from "@/src/components";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, ReactNode } from "react";


export interface TextFieldProps {
  label?: string;
  name: string;
  value: string | number;

  isActive?: boolean;
  onFocus?: (name: string) => void;

  // 🔥 EVENTOS DESACOPLADOS
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onSpace?: () => void;

  infoTooltip?: string;
  textLeft?: string;
  textRight?: string;

  iconsLeft?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>[];
  iconsRight?:  ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>[];

  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  hidden?: boolean;

  prefix?: string | ReactNode;
  suffix?: string | ReactNode;

  placeholder?: string;
  className?: string;

  activeColor?: ActiveColorType
  inputType?: TextInputType;
}

export const enum ActiveColorType {
  amber = 'amber',
  blue = 'blue',
  green = 'green',
  red = 'red',
  purple = 'purple',
}

export const sizeClasses = {
  sm: 'px-3 py-2 text-xl',
  md: 'px-4 py-3 text-3xl',
  lg: 'px-5 py-4 text-4xl',
};

export const activeColorClasses = {
  amber: 'border-amber-400 bg-amber-400/10',
  blue: 'border-blue-400 bg-blue-400/10',
  green: 'border-green-400 bg-green-400/10',
  red: 'border-red-400 bg-red-400/10',
  purple: 'border-purple-400 bg-purple-400/10',
};

