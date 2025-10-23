'use client'
import { mockPermissions, listOptions } from "@/app/mocks";
import { useEffect, useState } from "react";
import { 
  DynamicForm,
  entitiesToGroupedOption,
  entitiesToInputOption,
  FieldProps,
  GroupedOption,
  InputOption,
  InputTypes,
  TextInputType,
  validationMessages 
} from "shadcn-zod-formkit";


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
      Object.entries(permissionsByCategory).map(([category, perms], indx):GroupedOption => ({
        id: indx+1,
        label: category,
        options: entitiesToInputOption(perms, 'description', category),
        selectedOptions: []
      }))
    );
  }, []);

  const handleRolesChange = (optionsUpdated: InputOption[]) => {
    setSelectedPermissions(optionsUpdated);
    if (optionsUpdated.length === 0)  return
    const group = groups.find(g => g.options.some(o => o?.groupedLabel === optionsUpdated[0].groupedLabel))
    if (group) {
      const others = groups.filter(g => g.id !== group.id)
      setGroups([
        ...others,
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
  };


  const mockFields: Array<FieldProps |FieldProps[]> = [

  // {
  //   name: 'permissions',
  //   label: 'User Permissions',
  //   inputType: InputTypes.GROUPED_SWITCH_LIST,
  //   listConfig: {
  //     selectedList: selectedPermissions,
  //     list: listOptions,//entitiesToGroupedOption(groups), 
  //     optionLabel: "name",
  //     optionValue: "id",
  //     onOptionChange: (item) => {/* handleRolesChange(item as InputOption[]) */},
  //   }
  // },

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
    <>
      <div className="w-full h-200 bg-gray-500/20 rounded-lg ">
      </div>
      <div className="w-full  bg-neutral-50/90 rounded-lg p-2">
        <DynamicForm
        fields={mockFields}
        record={record}
        onSubmit={async (resp: any) =>{ 
            setDataToSend(resp.data)
            const msg = "✅  Resultado final:"
            console.log(resp.data, msg)
            // alert(resp)
          }}
        />
      </div>
      <div className="w-full flex flex-col  bg-gray-100 rounded-lg">
        <div className="flex flex-row  text-lg text-gray-800 p-4">
            DATA SENDED
          </div>
          <pre className="flex flex-row  text-xs text-gray-800 p-4">
            <code>{JSON.stringify(dataToSend, null, 2)}</code>
          </pre>
      </div>
    </>
  );

  
}

