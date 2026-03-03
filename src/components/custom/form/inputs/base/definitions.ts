import { z, ZodTypeAny } from "zod";
import { InputTypes } from "./input-types"
import { LucideProps } from "lucide-react";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";


export const flattenFields = <T extends Record<string, any>>(
  fields: FieldConfig<T>[],
  onAnyFieldChange?:  (data:any) => void
): FieldProps<T>[] => {
  const result: FieldProps<T>[] = [];

  for (const field of fields) {
    if (Array.isArray(field)) {
      result.push(...flattenFields(field));
    } else if ((field as any).fields) {
      result.push(...flattenFields((field as any).fields));
    } else {
      if (onAnyFieldChange) field.onAnyFieldChange = (data:any) => onAnyFieldChange(data)
      result.push(field);
    }
  }

  return result;
};


export type FieldConfig<T, RT = Record<string,any>> = FieldProps<T,RT> | FieldConfig<T,RT>[];

export interface FieldProps<T = Record<string,any>, RT = Record<string,any>> {
  name: keyof T // Campo debe coincidir con la definición en el esquema
  label: string
  
  showWhen?: (values: Record<string, any>) => boolean
  step?:number;
  withAddBtn?: boolean;
  form?: UseFormReturn<any>;
  isRemovebleOption?:boolean
  withDuplicatTag?: boolean
  onChange?: (event: any[], formValues?: Record<string,any>) => void
  tabLabelField?:string
  childrenPosition?: 'up' | 'down'
  children?: ReactNode | ((item: any, index: number) => ReactNode);
  defaultValue?: any;
  direction?: 'row' | 'col';
  
  repeaterFields?: Array<FieldProps<RT> | FieldProps<RT>[]>;
  minItems?: number;
  maxItems?: number;


  currencyFormat?: Intl.NumberFormatOptions
  mask?: string | RegExp;

  onAnyFieldChange?: (data:Record<string,any>) => void
  wrapInCard?: boolean
  placeHolder?: string
  description?: string
  className?: string
  inputType?: InputTypes
  keyboardType?: TextInputType
  disabled?: boolean
  required?: boolean
  value?: any
  min?: number,
  max?: number,
  zodType?: ZodTypeAny;

  infoTooltip?: string
  
  // Rating input specific
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  allowHalf?: boolean
  
  // Phone input specific
  defaultCountryCode?: string
  
  // URL input specific
  showPreview?: boolean
  autoProtocol?: boolean
  
  // Password input specific
  showStrength?: boolean
  showRequirements?: boolean
  
  // list?: any[]
  dependsOn?: string // Nombre del campo del que depende este campo
  loadOptions?: (dependencyValue: any) => Promise<any[]> // Función para cargar opciones dinámicamente
  optionLabel?: string // Propiedad a mostrar como etiqueta en el select
  optionValue?: string // Propiedad a usar como valor en el select
  optionDescription?: string // Propiedad a usar como valor en el select
  hidden?:boolean
  onListOptionChange?: (item: any) => void


  listConfig?: ListConfig

  fileConfig?: {
    previewSize?: number
    showPreview?: boolean
    accept: string // tipos de archivo permitidos
    multiple: boolean // múltiples archivos
    maxSize: number
  }

  inputGroupConfig?: inputGroudConfig

  // ✨ New UX improvements
  helpText?: string              // Expandable help text
  helpLink?: string              // Link to documentation
  prefix?: string | ReactNode    // Visual prefix
  suffix?: string | ReactNode    // Visual suffix
  loading?: boolean              // Loading state
  skeleton?: boolean             // Show skeleton while loading
  debounce?: number              // Debounce for onChange (ms)
  maxLength?: number             // Max length with visual counter
  showCharCount?: boolean        // Show "50/100" counter
  copyable?: boolean             // Copy button for value
  clearable?: boolean            // X button to clear value
  
  // Validation improvements
  validateOnBlur?: boolean       // Validate on blur
  validateOnChange?: boolean     // Validate on change
  showValidIcon?: boolean        // Show ✓ when valid
  asyncValidation?: (value: any) => Promise<string | true>  // Async validation
  debounceValidation?: number    // Debounce for async validation (ms)
  
  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaRequired?: boolean
}

interface inputGroudConfig {

  autoValidIcons?: boolean 

  iconsLeft?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>[];
  iconsRight?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>[];

  textLeft?: string;
  textRight?: string;
}


interface ListConfig {
  children?: ReactNode | ((item: any, index: number) => ReactNode);
  list: InputOption[] | GroupedOption[]
  optionLabel?: string
  optionValue?: InputOption| string | number | object
  onOptionChange: (item?: InputOption | InputOption[] | GroupedOption ) => void
  optionDescription?: string
  selectedList?: InputOption[]
  sortable?: boolean;

  // filterList?: (all: any, values: any) => any
}
export interface BtnConfig {
  label: string;
  btnType: 'submit' | 'button';
  onClick: () => void
  variant?:  "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  disabled?: boolean;
}

export interface InputOption {
  id: number | string
  name: string
  label?: string
  description?: string
  disabled?: boolean
  checked?: boolean
  groupedLabel?: string
  value?:any
}
export interface GroupedOption {
  id?: number
  label: string
  options: InputOption[]
  selectedOptions: InputOption[]
  totalSelected?: number
  disabled?: boolean
  value?:any
}

export interface InputSetup {
  required: boolean;
  disabled: boolean;
  minLegth?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?:number;
  max?:number;
  isObscure?:boolean;
  isEmail?:boolean;
  isUrl?:boolean;
  zopType?: z.ZodType
}


export enum TextInputType {
  DEFAULT = "default",
  NUMBER = "number",
  EMAIL = "email",
  PHONE = "phone",
  PASSWORD = "password",
}