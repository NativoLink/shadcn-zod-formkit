import { z, ZodTypeAny } from "zod";
import { InputTypes } from "./input-types"

export interface CustomFormProps {
  formTitle: string
  inputConfig: FieldProps[]
  fieldsConfig: Array<FieldProps | FieldProps[]>
  defaultValues: Record<string, any>
  formSchema: ZodTypeAny
  submitBtnLabel?: string
  className?: string
  isFormChild?: boolean
  columns?: number
  gap?: number
  onSubmit: (values: Record<string, any>) => void
}

export interface FieldProps {
  name: string // Campo debe coincidir con la definición en el esquema
  label: string
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
  ZodTypeAny?: z.ZodTypeAny
  
  list?: any[]
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
}


interface ListConfig {
  list: InputOption[] | GroupedOption[]
  optionLabel?: string
  optionValue?: InputOption| string | number | object
  onOptionChange: (item?: InputOption | InputOption[] | GroupedOption ) => void
  optionDescription?: string
  selectedList?: InputOption[]
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