export const rawCodeAccordionGroupForm =`'use client'
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import z from "zod";
import { 
  DynamicForm,
  entitiesToGroupedOption,
  entitiesToInputOption,
  FieldProps,
  GroupedOption,
  InputOption,
  InputTypes,
} from "shadcn-zod-formkit";
import { CodeExample } from "@/components/ui/code-example";
import { mockPermissions } from "@/app/mocks";

interface IPermission {
  id: string
  name: string
  description?: string
  category: string
  createdAt?:string,
  updatedAt?:string,
}

export const AccordionGroupForm = () => {
  const [dataToSend, setDataToSend] = useState<any>({})
  const [selectedPermissions,setSelectedPermissions] = useState<InputOption[]>([])
  const [groups, setGroups] = useState<GroupedOption[]>([])

  const groupByCategory = (data: IPermission[]) => {
    return data.reduce<Record<string, IPermission[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
  }

  useEffect(() => {
    const permissionsByCategory = groupByCategory(mockPermissions || [])
    setGroups(
      Object.entries(permissionsByCategory).map(
        ([category, perms], indx):GroupedOption => ({
          id: indx+1,
          label: category,
          options: entitiesToInputOption(perms, 'description', category),
          selectedOptions: []
        })
      )
    );
  }, []);

  const handleRolesChange = (optionsUpdated: InputOption[]) => {
    setSelectedPermissions(optionsUpdated);
    if (optionsUpdated.length === 0)  return
    const group = groups.find(
      g => g.options.some( o => o?.groupedLabel === optionsUpdated[0].groupedLabel )
    )
    if (group) {
      const others = groups.filter(g => g.id !== group.id)
      setGroups([ ...others,
        { ...group, options: group.options, totalSelected: optionsUpdated.length }
      ].sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0)))
    }
  }

  const record = {
    username: "John Doe ",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: undefined,
    age: 25,
    role: "editor",
    permissions: []
  };

  const mockFields: Array<FieldProps |FieldProps[]> = [
    {
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT_GROUP,
      inputGroupConfig:{
        autoValidIcons: true,
        iconsLeft: [User]
      },
      zodType: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(20, "El nombre no puede tener más de 20 caracteres") ,
    },
    {
      name: 'permissions',
      label: 'Permisos',
      inputType: InputTypes.ACCORDION_GROUPED_SWITCH_LIST,
      listConfig: {
        selectedList: selectedPermissions,
        list: entitiesToGroupedOption(groups), 
        optionLabel: "name",
        optionValue: "id",
        onOptionChange: (item) => { handleRolesChange(item as InputOption[])},
      }
    },
  ];

  return (
    <DynamicForm
      formTitle="Title Form"
      withCard
      fields={mockFields}
      record={record}
      onSubmit={async (resp: any) =>{ 
        setDataToSend(resp.data)
        console.log(resp.data, "✅  Resultado final:")
      }}
    />
  );
}`
