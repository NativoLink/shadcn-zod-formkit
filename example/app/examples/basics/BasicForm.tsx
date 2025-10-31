'use client'
import { Hash, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { 
  DynamicForm,
  InputTypes,
  TextInputType,
  validationMessages,
  FormResp,
  FieldProps 
} from 'shadcn-zod-formkit';
import { z } from "zod";


interface IUserRecord {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    favoriteColor: string;
    salary: number;
    age: number;
    volume: number;
    passportPhoto: undefined;
    alarmTime: undefined;
    gender: undefined;
    birthDate: undefined;
    bloodType: string;
    otpCode: string;
    secretKeys: never[];
    notifications: never[];
    tags: string[];
}

export default function FormBasics() {

  const [dataToSend, setDataToSend] = useState<any>({})

  const record: IUserRecord = {
    id: 1,
    username: "John Doe",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: '#000000',
    salary: 0,
    age: 25,
    volume: 50,
    passportPhoto: undefined,
    alarmTime: undefined,
    gender: undefined,
    birthDate: undefined,
    bloodType: "",
    otpCode: "",
    secretKeys: [],
    notifications: [],
    tags: [] as string[],
  };

  const mockFields: Array<FieldProps |FieldProps[]> = [
  {
    name: "id",
    label: "ID",
    inputType: InputTypes.HIDDEN,
    // hidden: true, // alternativa a InputTypes.HIDDEN
  },
  [{
    name: "username",
    label: "Username",
    inputType: InputTypes.TEXT_GROUP,
    infoTooltip:"Your unique username to login",
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
    name: "email",
    label: "Email",
    inputType: InputTypes.TEXT_GROUP,
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Mail],
    },
    zodType: z
      .string()
      .email("Correo inválido")
      .optional(),
  }],
  {
    wrapInCard:true,
    name: "contacts",
    label: "Contactos",
    inputType: InputTypes.REPEATER,
    repeaterFields: [
      { name: "name", label: "Nombre", placeHolder: "Ej: Juan" },
      [ { name: "email", label: "Email", placeHolder: "Ej: juan@mail.com" },
      { name: "xxx", label: "xxx", placeHolder: "Ej: juan@mail.com" }],
    ],
    minItems: 1,
    maxItems: 5,
    zodType:z.array(
      z.object({
        name: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
        email: z.string().email("Debe ser un correo válido"),
      })
    ).min(1, "Debe agregar al menos un contacto").max(5, "Máximo 5 contactos permitidos"),
  },
  [{
    name: "password",
    label: "Password",
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Lock]
    },
    inputType: InputTypes.TEXT_GROUP,
    keyboardType: TextInputType.PASSWORD,
    zodType: z
      .string(validationMessages.required)
      .min(6, validationMessages.minLength(6))
      .max(20, "No más de 20 caracteres"),
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Lock]
    },
    inputType: InputTypes.TEXT_GROUP,
    keyboardType: TextInputType.PASSWORD,
    zodType: z.string(validationMessages.required)
  }],

  {
    name: "gender",
    label: "Género",
    inputType: InputTypes.BUTTON_GROUP,
    description: "Selecciona tu género",
    listConfig: {
      list: [
        { id:1, name: "Masculino", value: "male" },
        { id:2, name: "Femenino", value: "female" },
        { id:3, name: "Otro", value: "other" },
      ],
      onOptionChange: (item:any) => {},
    },
    zodType: z.string().nonempty("Debes seleccionar una opción")
  },
  {
    wrapInCard: true,
    name: "passportPhoto",
    label: "Subir foto de pasaporte",
    inputType: InputTypes.FILE_MULTI_UPLOAD,
    description: "Puedes subir múltiples archivos a la vez",
    inputGroupConfig: {
      autoValidIcons: true
    },
    // zodType: z.array(z.instanceof(File)).min(1, "Debes subir al menos un archivo")
  },
  {
    wrapInCard: true,
    name: "bloodType",
    label: "Blood Type",
    description:'This is a description',
    inputType: InputTypes.RADIO_GROUP,
    zodType: z.string(validationMessages.required)
      .min(1, "Selecciona un tipo de sangre"),
  },
  {
    name: "salary",
    label: "Salary",
    inputType: InputTypes.CURRENCY,
    zodType: z.number().min(100),
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Hash]
    },
    currencyFormat: {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
    // mask: /^\d{1,3}(,\d{3})*(\.\d{0,2})?$/, // e.g: 1,234.56
  },
  {
    name: "tags",
    label: "Tags",
    inputType: InputTypes.TAGS,
    zodType: z.array(z.string()),
  },
  {
    name: "secretKeys",
    label: "SECRET KEYS",
    inputType: InputTypes.KEY_VALUE,
    zodType: z.array( 
      z.object({ key: z.string("se requiere por lo menos 1 clave ...")
        .min(1, "La clave es requerida")
        .regex(/^[a-zA-Z0-9_.-]+$/, "Solo letras, números o guiones"), 
        value: z.string().min(1, "El valor es requerido") 
      })).min(1, "Debe haber al menos un par clave-valor")
  },
  {
    name: "isActive",
    label: "Usuario activo",
    description:'This is a description',
    inputType: InputTypes.CHECKBOX,
    zodType: z.boolean().default(true),
  },
  [ 
    {
      name: "favoriteColor",
      label: "Color favorito",
      inputType: InputTypes.COLOR,
      required: false,
      zodType: z
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
      zodType: z
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
      // zodType: z.coerce
      //   .date(validationMessages.required)
      //   .refine((d) => d < new Date(), {
      //     message: "La fecha no puede ser futura",
      //   }),
    },
    {
      name: "appointment",
      label: "Agendar Cita - Fecha y hora",
      inputType: InputTypes.DATE_TIME, // tipo que puedes agregar
      placeHolder: "Selecciona fecha y hora",
      description: "Selecciona la fecha y la hora de la cita",
      // zodType: z.coerce.date().refine((d) => d > new Date(), {
      //   message: "La fecha debe ser futura",
      // }),
    },
  ],
  {
    wrapInCard: true,
    name: "volume",
    label: "Volumen",
    inputType: InputTypes.SLIDER,
    description: "Ajusta el volumen entre 0 y 100",
    min: 0,
    max: 100,
    zodType: z.number().min(0).max(100)
  },
  {
    name: "alarmTime",
    label: "Hora de alarma",
    inputType: InputTypes.TIME,
    // zodType: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm")
  },
  {
    name: "otpCode",
    label: "Código OTP",
    inputType: InputTypes.OTP,
    required: false,
    zodType: z
      .string(validationMessages.required)
      .min(6, "Debe tener al menos 6 dígitos"),
  },
  {
    wrapInCard: true,
    name: "notifications",
    label: "Recibir Notificaciones con:",
    inputType: InputTypes.SIMPLE_CHECK_LIST,
    required: false,
    listConfig: {
      list:  [
        { id: 1, name: "email", checked: false },
        { id: 2, name: "sms", checked: false },
        { id: 3, name: "phone call", checked: false },
        { id: 4, name: "push notifications", checked: false },
      ],
      onOptionChange: (item:any) => {},
    }
  }
];

  return (
    <>
      <DynamicForm
        formSubTitle="This is a subtitle"
        formTitle="Basic Form Example"
        withCard
        errorAlertPosition='down'
        fields={mockFields}
        record={record}
        extraValidations={[
          (s) =>
            s.refine((data) => data.password === data.confirmPassword, {
              path: ["confirmPassword"],
              message: "Las contraseñas no coinciden",
            }),
        ]}
        onSubmit={async (resp: FormResp<IUserRecord>) => {
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