'use client'
import { CodeExample } from '@/components/ui/code-example';
import { Hash, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { DynamicForm, InputTypes, TextInputType, validationMessages, FieldProps } from 'shadcn-zod-formkit';
import { z } from "zod";
import { rawCodeBasicForm } from './BasicForm.raw';

export const FormBasics = () => {

  const [dataToSend, setDataToSend] = useState<any>({})

  const record = {
    username: "John Doe",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: '#000000',
    age: 25,
    birthDate: undefined,
    otpCode: "",
    notifications: [],
  };


  const mockFields: Array<FieldProps |FieldProps[]> = [
  // 🧍‍♂️ Campo requerido simple
  {
    name: "username",
    label: "Username",
    inputType: InputTypes.TEXT_GROUP,
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [User]
    },
    zodTypeAny: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(20, "El nombre no puede tener más de 20 caracteres") ,
  },


  // 📧 Campo de correo con validación personalizada (ZodTypeAny)
  {
    name: "email",
    label: "Correo electrónico",
    inputType: InputTypes.TEXT_GROUP,
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Mail],
    },
    zodTypeAny: z
      .string()
      .email("Correo inválido")
      .optional(),
  },

  // 🔒 Campo opcional (no requerido)
  {
    name: "password",
    label: "Contraseña",
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Lock]
    },
    inputType: InputTypes.TEXT_GROUP,
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
    description:'This is a description',
    inputType: InputTypes.CHECKBOX,
    zodTypeAny: z.boolean().default(true),
  },

  // 🎨 Color con validación personalizada
  [ 
    {
      name: "favoriteColor",
      label: "Color favorito",
      inputType: InputTypes.COLOR,
      required: false,
      zodTypeAny: z
        .string()
        .regex(/^#([0-9A-Fa-f]{6})$/, "Debe ser un color hexadecimal válido"),
    },

    // 🔢 Número con rango
    {
      name: "age",
      label: "Edad",
      inputType: InputTypes.NUMBER,
      keyboardType: TextInputType.NUMBER,
      inputGroupConfig:{
        autoValidIcons: true,
        iconsLeft: [Hash]
      },
      zodTypeAny: z
        .coerce.number("Debe ser un número") // fuerza a number
        .min(18, "Debe ser mayor de 18")
        .max(99, "Debe ser menor de 99"),
    }
  ],

  [
    // 📅 Fecha
    {
      name: "birthDate",
      label: "Fecha de nacimiento",
      inputType: InputTypes.DATE,
      zodTypeAny: z.coerce.date(validationMessages.required).refine((d) => d < new Date(), {
        message: "La fecha no puede ser futura",
      }),
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
  // 🔢 Notifications
  {
    name: "notifications",
    label: "Recibir Notificaciones con:",
    inputType: InputTypes.SIMPLE_CHECK_LIST,
    required: false,
    listConfig: {
      list:  [
        { id: 1, name: "PERMISSION CREATE", checked: false },
        { id: 2, name: "PERMISSION READ", checked: false },
        { id: 3, name: "PERMISSION UPDATE", checked: false },
        { id: 4, name: "PERMISSION DELETE", checked: false },
      ],
      onOptionChange: (item) => {},
    }
  }
];

  return (
      <>
        <div className="flex flex-col w-full  bg-gray-500/20 rounded-lg p-2 gap-2">
          <CodeExample code={rawCodeBasicForm} language="javascript" />
        </div>

        <DynamicForm
          withCard
          errorAlertPosition='down'
          fields={mockFields}
          record={record}
          onSubmit={async (resp: any) =>{ 
            setDataToSend(resp.data)
            const msg = "✅  Resultado final:"
            console.log(resp.data, msg)
          }}
        />

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

