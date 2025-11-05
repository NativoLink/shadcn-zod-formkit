"use client"

import { useState, useEffect, useRef } from "react"
import { InputTypes } from "../form/inputs/base/input-types"
import { FieldProps, GroupedOption, InputOption } from "../form/inputs/base/definitions"
import { DynamicForm } from "../form/inputs/DynamicForm"

interface FilterOption {
  name: string
  label?: string
  inputType: InputTypes
  options?: Array<{ label: string; value: any }> | string[]
  placeholder?: string
}

interface GenericFilterProps<T> {
  filters?: FilterOption[]
  pagination?: boolean
  autoSubmit?: boolean
  defaultValues?: Record<string, any>
  initPage?: number
  initLimit?: number
  onChange?: (values: Record<string, any>) => void
  rangeLimit?: number[]
  withSearch?: boolean
  withInitDate?: boolean
  withEndDate?: boolean
  withActive?: boolean
  withLimit?: boolean
  customFieldsConfig?: Array<FieldProps<T>|FieldProps<T>[]> 
}



interface Filter {
  page?: number;
  limit?: number;
  seach?: string;
  active?: boolean;
  initDate?: Date;
  endDate?: Date;
  defaultValues?: Record<string, any>
}

/**
 * ✅ Componente genérico de filtro con DynamicForm.
 */
export function GenericFilter<T = Record<string,any>>({
  filters,
  pagination,
  autoSubmit = true,
  defaultValues = {},
  initPage = 1,
  initLimit = 10,
  rangeLimit = [10, 25, 50, 100],
  onChange,
  withSearch = true,
  withInitDate = true,
  withEndDate = true,
  withActive = true,
  withLimit = true,
}: GenericFilterProps<T>) {
  
  const record: Filter = {
    page: initPage,
    limit: initLimit,
    ...defaultValues,

  }
  const [values, setValues] = useState<Filter>(record)


  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // onChange(values)
  }, [values])

  const handleChange = (name: string, value: any) => {
    alert('changing')
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setValues({
      page: initPage,
      limit: initLimit,
      ...defaultValues,
    })
  }

  const searchField: FieldProps = {
        name: 'search',
        label: 'Buscar',
        inputType: InputTypes.TEXT_GROUP,
        onChange: (...args) => {
          console.log('args',args)
          handleChange('active', true)
        }
      }
  const initDateField: FieldProps = {
        name: "initDate",
        label: "Fecha de Inicio",
        inputType: InputTypes.DATE,
        onChange: (...args) => {
          console.log('args',args)
          handleChange('active', true)
        }
      }
  const endDateField: FieldProps = {
        name: "endDate",
        label: "Fecha de Inicio",
        inputType: InputTypes.DATE,
      }
  const activeField: FieldProps = {
        wrapInCard: true,
        name: "active",
        label: "",
        inputType: InputTypes.BUTTON_GROUP,
        description: "Selecciona tu género",
        listConfig: {
          list: [
            { id:1, name: "Activo", value: true },
            { id:2, name: "Inactivo", value: false },
            { id:3, name: "Todos", value: undefined },
          ],
          onOptionChange: (item?: InputOption | InputOption[] | GroupedOption) => {
            if (Array.isArray(item)) {
              // Handle array of InputOption if needed
              // Example: handleChange for the first item
              if (item[0]) handleChange(item[0].name ?? item[0].label, item[0].value)
            } else if (item && typeof item === "object" && "value" in item) {
              // Handle single InputOption
            }
            handleChange('active', true)
            // Optionally handle GroupedOption if needed
          },
        },
      }

    const rangeLimitField = {
        name: 'limit',
        label: 'Limite por Página',
        inputType: InputTypes.SELECT,
        listConfig: {
        list: rangeLimit.map((num) => ({ value: String(num), id: num, name: String(num), })),
        onOptionChange: (item:any) => {},
      },
    }

  const customFieldsConfig: Array<FieldProps|FieldProps[]> = []
  // type FieldConfig = Array<FieldProps|FieldProps[]> | FieldProps | FieldConfig[];
  const fieldsConfig: Array<FieldProps|FieldProps[]> = [
  // const fieldsConfig: FieldConfig = [
      ...customFieldsConfig,
      ...(withSearch ? [searchField] : []),
      ...(withInitDate ? [initDateField] : []),
      ...(withEndDate ? [endDateField] : []),
      ...(withActive ? [activeField] : []),
      ...(withLimit ? [rangeLimitField] : []),
  ]

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 py-3">
      <div className="flex-1">
        <DynamicForm<Filter>
          withSubmitBtn={!autoSubmit}
          formTitle=""
          submitBtnLabel="Buscar"
          fields={fieldsConfig}
          record={values}
          // onChange={handleChange}
          showFormHeader={false}
          // withCard
        />
      </div>

      {/* <Button variant="secondary" onClick={handleReset}>
        Reset
      </Button> */}
    </div>
  )
}
