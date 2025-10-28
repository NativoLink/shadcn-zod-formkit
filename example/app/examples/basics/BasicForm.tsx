'use client'
import { Hash, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { DynamicForm, InputTypes, TextInputType, validationMessages, FieldProps } from 'shadcn-zod-formkit';
import { z } from "zod";

export default function FormBasics() {

  const [dataToSend, setDataToSend] = useState<any>({})

  const record = {
    username: "John Doe",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: '#000000',
    age: 25,
    birthDate: undefined,
    bloodType: "",
    otpCode: "",
    notifications: [],
    tags: [] as string[],
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
    zodTypeAny: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(20, "El nombre no puede tener más de 20 caracteres") ,
  },
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
  {
    name: "bloodType",
    label: "Blood Type",
    description:'This is a description',
    inputType: InputTypes.RADIO_GROUP,
    zodTypeAny: z.string(validationMessages.required).min(1, "Selecciona un tipo de sangre"),
  },
  {
    name: "tags",
    label: "Tags",
    inputType: InputTypes.TAGS,
    zodTypeAny: z.array(z.string()),
  },
  {
    name: "isActive",
    label: "Usuario activo",
    description:'This is a description',
    inputType: InputTypes.CHECKBOX,
    zodTypeAny: z.boolean().default(true),
  },
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
    {
      name: "birthDate",
      label: "Fecha de nacimiento",
      inputType: InputTypes.DATE,
      zodTypeAny: z.coerce.date(validationMessages.required).refine((d) => d < new Date(), {
        message: "La fecha no puede ser futura",
      }),
    },
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