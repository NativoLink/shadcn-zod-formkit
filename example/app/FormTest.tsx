'use client'
import { useEffect, useState } from "react";
import { Card, DynamicForm, entitiesToGroupedOption, entitiesToInputOption, FieldProps, GroupedOption, InputOption, InputTypes, TextInputType, validationMessages } from "shadcn-zod-formkit";
import { z } from "zod";
import { listOptions, mockPermissions } from "./mocks";

export interface IPermission {
  id: string
  name: string
  description?: string
  category: string
  createdAt?:string,
  updatedAt?:string,
}

export const FormTest = () => {
  
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
    console.log("🚀 ~ FormTest ~ permissionsByCategory:", permissionsByCategory)
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
  // const groups: GroupedOption[] = [
  //   {
  //     label: "Usuarios",
  //     options: [
  //       { id: '1', name: "Crear usuario", checked: false, groupedLabel: "Usuarios" },
  //       { id: '2', name: "Editar usuario", checked: false, groupedLabel: "Usuarios" },
  //       { id: '3', name: "Eliminar usuario", checked: false, groupedLabel: "Usuarios" },
  //     ],
  //   },
  //   {
  //     label: "Productos",
  //     options: [
  //       { id: '4', name: "Ver productos", checked: true, groupedLabel: "Productos" },
  //       { id: '5', name: "Crear producto", checked: false, groupedLabel: "Productos" },
  //       { id: '6', name: "Borrar producto", checked: false, groupedLabel: "Productos" },
  //     ],
  //   },
  // ]

  const record = {
    username: "John Doe ",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: undefined,
    age: 25,
    role: "editor",
  };


  const mockFields: Array<FieldProps |FieldProps[]> = [
  // 🧍‍♂️ Campo requerido simple
  [
    {
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT,
      required: true,
      // zodTypeAny: z
      //   .string()
      //   .min(3, "El nombre debe tener al menos 3 caracteres")
      //   .max(20, "El nombre no puede tener más de 20 caracteres") ,
    },

    // 📧 Campo de correo con validación personalizada (ZodTypeAny)
    {
      name: "email",
      label: "Correo electrónico",
      inputType: InputTypes.TEXT,
      required: true,
      zodTypeAny: z
        .string()
        .email("Correo inválido")
        .optional(),
    }
  ],

  // 🔒 Campo opcional (no requerido)
  {
    name: "password",
    label: "Contraseña",
    inputType: InputTypes.TEXT,
    required: true,
    keyboardType: TextInputType.PASSWORD,
    zodTypeAny: z
      .string(validationMessages.required)
      .min(6, validationMessages.minLength(6))
      .max(20, "No más de 20 caracteres"),
  },

  // 🟢 Campo tipo switch (boolean)
  {
    name: "isActive",
    label: "Usuario activo",
    inputType: InputTypes.SWITCH,
    required: true,
    zodTypeAny: z.boolean().default(true),
  },

  // // 🎨 Color con validación personalizada
  [ 
    // {
    //   name: "favoriteColor",
    //   label: "Color favorito",
    //   inputType: InputTypes.COLOR,
    //   required: false,
    //   zodTypeAny: z
    //     .string()
    //     .regex(/^#([0-9A-Fa-f]{6})$/, "Debe ser un color hexadecimal válido"),
    // },

    // 🔢 Número con rango
    {
      name: "age",
      label: "Edad",
      inputType: InputTypes.NUMBER,
      required: true,
      zodTypeAny: z
        .coerce.number("Debe ser un número") // fuerza a number
        .min(18, "Debe ser mayor de 18")
        .max(99, "Debe ser menor de 99"),
    }
  ],

  // 📅 Fecha
  {
    name: "birthDate",
    label: "Fecha de nacimiento",
    inputType: InputTypes.DATE,
    required: true,
    zodTypeAny: z.coerce.date(validationMessages.required).refine((d) => d < new Date(), {
      message: "La fecha no puede ser futura",
    }),
  },

  // 🎓 Select con validación personalizada
  {
    name: "role",
    label: "Rol de usuario",
    inputType: InputTypes.SELECT,
    required: true,
    listConfig: {
      onOptionChange: () =>{},
      list: listOptions
    },
    zodTypeAny: z.enum(["admin", "editor", "reader"]),
  },


  // 🧾 Campo tipo archivo (file)
  [{
    name: "profileImage",
    label: "Imagen de perfil",
    inputType: InputTypes.FILE,
    required: true,
    zodTypeAny: z
      .any()
      .refine(
        (file) => {
          if (!file) return true;
          return (
            file.size <= 10 * 1024 * 1024 &&
            ["image/jpeg", "image/png"].includes(file.type)
          );
        },
        { message: "Solo se permiten imágenes JPG o PNG de menos de 10MB" }
      )
      .optional(),
  },

  // 🔢 OTP (código)
  {
    name: "otpCode",
    label: "Código OTP",
    inputType: InputTypes.OTP,
    required: false,
    zodTypeAny: z
      .string(validationMessages.required)
      .min(6, "Debe tener al menos 6 dígitos"),
  }
  ],
];



  return (
    <>
      <div className="w-full  bg-gray-500/20 rounded-lg ">
      </div>
      <div className="w-full  bg-neutral-50/90 rounded-lg p-2">
        <DynamicForm
        fields={mockFields}
        record={record}
        onSubmit={(data: any) => console.log("📤 Resultado final:", data)}
        />
      </div>
      <div className="w-full  bg-gray-500/40 rounded-lg">
        <pre className="mt-4 text-xs text-gray-500">
          {/* <code>{JSON.stringify(mockFields, null, 2)}</code> */}
        </pre>
      </div>
    </>
  );

  
}

