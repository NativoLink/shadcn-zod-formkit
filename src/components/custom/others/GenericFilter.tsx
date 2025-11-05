"use client"

import { useState, useEffect, useRef } from "react"
import { FieldProps, GroupedOption, InputOption, InputTypes } from "../form/inputs/base"
import { DynamicForm } from "../form/inputs/DynamicForm"
import { Search } from "lucide-react"


interface GenericFilterProps<T> {
  filters?: Array<FieldProps | FieldProps[]>
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
  wrapInCard?: boolean
}

interface Filter {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  initDate?: Date
  endDate?: Date
  defaultValues?: Record<string, any>
}

/**
 * ✅ Componente genérico y dinámico de filtro
 */
export const GenericFilter = <T,>({
  filters = [],
  pagination,
  autoSubmit = false,
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
  wrapInCard = true,
}: GenericFilterProps<T>) => {
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
  }, [values])

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (autoSubmit && onChange) onChange({ ...values, [name]: value })
  }

  const handleReset = () => {
    setValues({
      page: initPage,
      limit: initLimit,
      ...defaultValues,
    })
  }

  // 🧩 Filtros base (predefinidos)
  const baseFields: FieldProps[] = [
    ...(withSearch
      ? [
          {
            name: "search",
            label: "Buscar",
            inputType: InputTypes.TEXT_GROUP,
            inputGroupConfig: { iconsLeft: [Search] },
            onChange: (value: any) => handleChange("search", value),
          } as FieldProps,
        ]
      : []),
    ...(withInitDate
      ? [
          {
            name: "initDate",
            label: "Fecha de Inicio",
            inputType: InputTypes.DATE,
            onChange: (value: any) => handleChange("initDate", value),
          } as FieldProps,
        ]
      : []),
    ...(withEndDate
      ? [
          {
            name: "endDate",
            label: "Fecha Final",
            inputType: InputTypes.DATE,
            onChange: (value: any) => handleChange("endDate", value),
          } as FieldProps,
        ]
      : []),
    ...(withActive
      ? [
          {
            wrapInCard: true,
            name: "active",
            label: "",
            inputType: InputTypes.BUTTON_GROUP,
            description: "Estado",
            listConfig: {
              list: [
                { id: 1, name: "Activo", value: true },
                { id: 2, name: "Inactivo", value: false },
                { id: 3, name: "Todos", value: undefined },
              ],
              onOptionChange: (item?: InputOption | InputOption[]) => {
                if (Array.isArray(item) && item[0]) handleChange("active", item[0].value)
                else if (item && "value" in item) handleChange("active", item.value)
              },
            },
          } as FieldProps,
        ]
      : []),
    ...(withLimit
      ? [
          {
            name: "limit",
            label: "Límite por página",
            inputType: InputTypes.SELECT,
            listConfig: {
              list: rangeLimit.map((num) => ({
                value: String(num),
                id: num,
                name: String(num),
              })),
              onOptionChange: (item: any) => handleChange("limit", Number(item?.value ?? 10)),
            },
          } as FieldProps,
        ]
      : []),
  ]

  
  // 🧱 Combina todos los campos
  const fieldsConfig: Array<FieldProps | FieldProps[]> = [
    ...filters,
    baseFields,
  ]

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 py-3">
      <div className="flex-1">
        <DynamicForm<Filter>
          withCard={wrapInCard}
          withSubmitBtn={!autoSubmit}
          formTitle=""
          submitBtnLabel="Buscar"
          fields={fieldsConfig}
          record={values}
          showFormHeader={false}
          onSubmit={({ data }) => {
            if (onChange && !autoSubmit) onChange(data)
          }}
        />
      </div>
    </div>
  )
}
