export interface FormTheme {
  colors?: {
    primary?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  spacing?: 'compact' | 'normal' | 'comfortable';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  labelPosition?: 'top' | 'left' | 'floating';
  fontSize?: 'sm' | 'base' | 'lg';
}

export const defaultTheme: FormTheme = {
  colors: {
    primary: 'hsl(var(--primary))',
    error: 'hsl(var(--destructive))',
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
  },
  spacing: 'normal',
  borderRadius: 'md',
  labelPosition: 'top',
  fontSize: 'base',
};

export const spacingClasses = {
  compact: 'gap-1',
  normal: 'gap-2',
  comfortable: 'gap-4',
};

export const borderRadiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const fontSizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export const labelPositionClasses = {
  top: 'flex-col',
  left: 'flex-row items-center',
  floating: 'relative',
};
