'use client'
import { BadgeX, Check, Hash, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { DynamicForm, InputTypes, TextInputType, validationMessages, FieldProps } from 'shadcn-zod-formkit';
import { z } from "zod";

export const FormBasics = () => {


  const record = {
    username: "John Doe",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: undefined,
    age: 25,
    birthDate: undefined,
    otpCode: "",
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
  // {
  //   name: "username",
  //   label: "Username",
  //   inputType: InputTypes.TEXT,
  //   // zodTypeAny: z
  //   //   .string()
  //   //   .min(3, "El nombre debe tener al menos 3 caracteres")
  //   //   .max(20, "El nombre no puede tener más de 20 caracteres") ,
  // },

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
    inputType: InputTypes.SWITCH,
    zodTypeAny: z.boolean().default(true),
  },

  // // 🎨 Color con validación personalizada
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

  // 📅 Fecha
  [{
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
];

  const [isPending,setIsPending] = useState(false)

  return (
      <>
        <div className="w-full  bg-gray-500/20 rounded-lg ">
        </div>
        <div className="w-full  bg-neutral-50/90 rounded-lg p-2">
          <DynamicForm
          withCard
          errorAlertPosition='down'
          fields={mockFields}
          record={record}
          onSubmit={async (data: any) =>{ 
            const resp = "✅  Resultado final:"
            console.log(resp, data)
            // alert(resp)
          }}
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

