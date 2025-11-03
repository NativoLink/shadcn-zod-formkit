'use client'
import { Card } from '@/components/ui/card';
import { Earth, Hash, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { 
  DynamicForm,
  InputTypes,
  TextInputType,
  validationMessages,
  FormResp,
  FieldProps, 
  Button
} from 'shadcn-zod-formkit';
import { z } from "zod";

//ADD EXAMPLE WITH TYPING..

interface IUserRecord {
    id: number;
    continent?: string;
    country?: string;
    appointment?: any;
    password?: string;
    confirmPassword?: string;
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
    ordenItems?: string[];
    cycles?: unknown[];
    shoppingPreferences?: string[];
    contacts?: Record<string,any>[],
}

export default function FormBasics() {

  const [dataToSend, setDataToSend] = useState<any>({})

  const record: IUserRecord = {
    id: 1,
    username: "John Doe",
    email: "johndoe@example.com",
    continent: '2',
    country: '1',
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
    ordenItems: [],
    secretKeys: [],
    notifications: [],
    cycles: [],
    tags: [] as string[],
  };

  const mockFields: Array<FieldProps<IUserRecord> |FieldProps<IUserRecord>[]> = [
  {
    name: 'id',
    label: "ID",
    inputType: InputTypes.HIDDEN,
    // hidden: true, // alternativa a InputTypes.HIDDEN
  },
  [
    {
      // children: (
      //   <div className="flex items-center justify-between p-3 bg-blue-50 border rounded-md">
      //     <span>CUSTOM ITEM</span>
      //   </div>
      // ),
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
    }
  ],
  {
    name: "shoppingPreferences",
    label: "Shopping preferences",
    inputType: InputTypes.MULTI_SELECT,
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Mail],
    },
    listConfig: {
      list: [
        { id: 1, name: "Tecnología", value: "technology" },
        { id: 2, name: "Moda", value: "fashion" },
        { id: 3, name: "Hogar", value: "home" },
        { id: 4, name: "Deportes", value: "sports" },
        { id: 5, name: "Belleza", value: "beauty" },
        { id: 6, name: "Viajes", value: "travel" }
      ],
      onOptionChange: (item:any) => {},
    },
  },
  {
    name: "ordenItems",
    label: "Ordenar elementos",
    description: "Arrastra para cambiar el orden de los elementos",
    inputType: InputTypes.SORTABLE_LIST,
    listConfig: {
      list: [
        { id: 1, name: "Elemento A" },
        { id: 2, name: "Elemento B" },
        { id: 3, name: "Elemento C" },
      ],
      onOptionChange: (newList:any) => console.log("Nuevo orden:", newList),
      children: (item: any, index: number) => (
        <div className="flex items-center justify-between p-3 bg-blue-50 border rounded-md">
          <span>{index + 1} {item.name} - CUSTOM ITEM</span>
          <span className="text-xs text-gray-400">ID: {item.id}</span>
        </div>
      ),
    },
    zodType: z.array(z.object({ id: z.number(), name: z.string() })),
  },
  // {
  //   name: "continent",
  //   label: "Continente",
  //   inputType: InputTypes.COMBOBOX, // 👈 Usa el nuevo ComboboxInput
  //   placeHolder: "Selecciona un continente",
  //   listConfig: {
  //     list: [
  //       { id: 1, name: "América", value: "1" },
  //       { id: 2, name: "Europa", value: "2" },
  //       { id: 3, name: "Asia", value: "3" },
  //     ],
  //     onOptionChange: (item:any) => console.log("🌎 Seleccionaste continente:", item),
  //   },
  //   zodType: z.string().min(1, "El continente es obligatorio"),
  // },
  // {
  //   name: "continent",
  //   label: "Your Location",
  //   description: "Your description",
  //   inputType: InputTypes.SELECT,
  //   inputGroupConfig:{
  //     autoValidIcons: true,
  //     iconsLeft: [Earth],
  //   },
  //   listConfig: {
  //     // optionValue:'value',
  //     list: [
  //       { value: '1', id: 1, name: "África" },
  //       { value: '2', id: 2, name: "América" },
  //       { value: '3', id: 3, name: "Antártida" },
  //       { value: '4', id: 4, name: "Asia" },
  //       { value: '5', id: 5, name: "Europa" },
  //       { value: '6', id: 6, name: "Oceanía" },
  //     ],
  //     onOptionChange: (item:any) => {},
  //   },
  //   zodType: z.string("requerido")
  // },

  {
    name: "continent",
    label: "Categoría",
    inputType: InputTypes.SELECT,
    listConfig: {
      list: [
        { id: 1, name: "América", value: "1" },
        { id: 2, name: "Europa", value: "2" },
      ],
      onOptionChange: (item:any) => console.log("Seleccionaste:", item),
    },
    zodType: z.string(),
  },
  {
    name: "country",
    label: "País",
    inputType: InputTypes.SELECT,
    dependsOn: "continent",
    loadOptions: async (categoria) => {
      if (categoria === "1")
        return [
          { id: "1", name: "EE.UU." },
          { id: "2", name: "Argentina" },
        ];
      if (categoria === "2")
        return [
          { id: "3", name: "España" },
          { id: "4", name: "Francia" },
        ];
      return [];
    },
    listConfig: { list: [], onOptionChange: () => {} },
    zodType: z.string(),
  },

  {
  name: "cycles",
  label: "Ciclos del proceso",
  description: "Agrega o elimina ciclos con sus datos específicos",
  inputType: InputTypes.REPEATER_TABS,
  tabLabelField: "name", // 🔹 mostrará el nombre del ciclo en el tab
  repeaterFields: [
    [
      { name: "name", label: "Nombre del ciclo", placeHolder: "Ej: Ciclo 1" },
      { name: "duration", label: "Duración (días)", inputType: InputTypes.NUMBER }
    ],
    [
      { name: "description", label: "Descripción", placeHolder: "Detalle opcional" }
    ]
  ],
  zodType: z.array(z.object({
    name: z.string(),
    duration: z.number().optional(),
    description: z.string().optional()
  }))
}
  // {
  //   wrapInCard:true,
  //   name: "contacts",
  //   label: "Contactos",
  //   inputType: InputTypes.REPEATER,
  //   repeaterFields: [
  //     { name: "name", label: "Nombre", placeHolder: "Ej: Juan" },
  //     [ { name: "email", label: "Email", placeHolder: "Ej: juan@mail.com" },
  //     { name: "xxx", label: "xxx", placeHolder: "Ej: juan@mail.com" }],
  //   ],
  //   minItems: 1,
  //   maxItems: 5,
  //   zodType:z.array(
  //     z.object({
  //       name: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  //       email: z.string().email("Debe ser un correo válido"),
  //     })
  //   ).min(1, "Debe agregar al menos un contacto").max(5, "Máximo 5 contactos permitidos"),
  // },
  // [{
  //   name: "password",
  //   label: "Password",
  //   inputGroupConfig:{
  //     autoValidIcons: true,
  //     iconsLeft: [Lock]
  //   },
  //   inputType: InputTypes.TEXT_GROUP,
  //   keyboardType: TextInputType.PASSWORD,
  //   zodType: z
  //     .string(validationMessages.required)
  //     .min(6, validationMessages.minLength(6))
  //     .max(20, "No más de 20 caracteres"),
  // },
  // {
  //   name: "confirmPassword",
  //   label: "Confirm Password",
  //   inputGroupConfig:{
  //     autoValidIcons: true,
  //     iconsLeft: [Lock]
  //   },
  //   inputType: InputTypes.TEXT_GROUP,
  //   keyboardType: TextInputType.PASSWORD,
  //   zodType: z.string(validationMessages.required)
  // }],

  // {
  //   name: "gender",
  //   label: "Género",
  //   inputType: InputTypes.BUTTON_GROUP,
  //   description: "Selecciona tu género",
  //   listConfig: {
  //     list: [
  //       { id:1, name: "Masculino", value: "male" },
  //       { id:2, name: "Femenino", value: "female" },
  //       { id:3, name: "Otro", value: "other" },
  //     ],
  //     onOptionChange: (item:any) => {},
  //   },
  //   zodType: z.string().nonempty("Debes seleccionar una opción")
  // },
  // {
  //   wrapInCard: true,
  //   name: "passportPhoto",
  //   label: "Subir foto de pasaporte",
  //   inputType: InputTypes.FILE_MULTI_UPLOAD,
  //   description: "Puedes subir múltiples archivos a la vez",
  //   inputGroupConfig: {
  //     autoValidIcons: true
  //   },
  //   // zodType: z.array(z.instanceof(File)).min(1, "Debes subir al menos un archivo")
  // },
  // {
  //   wrapInCard: true,
  //   name: "bloodType",
  //   label: "Blood Type",
  //   description:'This is a description',
  //   inputType: InputTypes.RADIO_GROUP,
  //   zodType: z.string(validationMessages.required)
  //     .min(1, "Selecciona un tipo de sangre"),
  // },
  // {
  //   name: "salary",
  //   label: "Salary",
  //   inputType: InputTypes.CURRENCY,
  //   zodType: z.number().min(100),
  //   inputGroupConfig:{
  //     autoValidIcons: true,
  //     iconsLeft: [Hash]
  //   },
  //   currencyFormat: {
  //     style: 'currency',
  //     currency: 'DOP',
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }
  //   // mask: /^\d{1,3}(,\d{3})*(\.\d{0,2})?$/, // e.g: 1,234.56
  // },
  // {
  //   name: "tags",
  //   label: "Tags",
  //   inputType: InputTypes.TAGS,
  //   zodType: z.array(z.string()),
  // },
  // {
  //   name: "secretKeys",
  //   label: "SECRET KEYS",
  //   inputType: InputTypes.KEY_VALUE,
  //   zodType: z.array( 
  //     z.object({ key: z.string("se requiere por lo menos 1 clave ...")
  //       .min(1, "La clave es requerida")
  //       .regex(/^[a-zA-Z0-9_.-]+$/, "Solo letras, números o guiones"), 
  //       value: z.string().min(1, "El valor es requerido") 
  //     })).min(1, "Debe haber al menos un par clave-valor")
  // },
  // {
  //   name: "isActive",
  //   label: "Usuario activo",
  //   description:'This is a description',
  //   inputType: InputTypes.CHECKBOX,
  //   zodType: z.boolean().default(true),
  // },
  // [ 
  //   {
  //     name: "favoriteColor",
  //     label: "Color favorito",
  //     inputType: InputTypes.COLOR,
  //     required: false,
  //     zodType: z
  //       .string()
  //       .regex(/^#([0-9A-Fa-f]{6})$/, "Debe ser un color hexadecimal válido"),
  //   },
  //   {
  //     name: "age",
  //     label: "Edad",
  //     inputType: InputTypes.NUMBER,
  //     keyboardType: TextInputType.NUMBER,
  //     inputGroupConfig:{
  //       autoValidIcons: true,
  //       iconsLeft: [Hash]
  //     },
  //     zodType: z
  //       .coerce.number("Debe ser un número") // fuerza a number
  //       .min(18, "Debe ser mayor de 18")
  //       .max(99, "Debe ser menor de 99"),
  //   }
  // ],
  // [
  //   {
  //     name: "birthDate",
  //     label: "Fecha de nacimiento",
  //     inputType: InputTypes.DATE,
  //     // zodType: z.coerce
  //     //   .date(validationMessages.required)
  //     //   .refine((d) => d < new Date(), {
  //     //     message: "La fecha no puede ser futura",
  //     //   }),
  //   },
  //   {
  //     name: "appointment",
  //     label: "Agendar Cita - Fecha y hora",
  //     inputType: InputTypes.DATE_TIME, // tipo que puedes agregar
  //     placeHolder: "Selecciona fecha y hora",
  //     description: "Selecciona la fecha y la hora de la cita",
  //     // zodType: z.coerce.date().refine((d) => d > new Date(), {
  //     //   message: "La fecha debe ser futura",
  //     // }),
  //   },
  // ],
  // {
  //   wrapInCard: true,
  //   name: "volume",
  //   label: "Volumen",
  //   inputType: InputTypes.SLIDER,
  //   description: "Ajusta el volumen entre 0 y 100",
  //   min: 0,
  //   max: 100,
  //   zodType: z.number().min(0).max(100)
  // },
  // {
  //   name: "alarmTime",
  //   label: "Hora de alarma",
  //   inputType: InputTypes.TIME,
  //   // zodType: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm")
  // },
  // {
  //   name: "otpCode",
  //   label: "Código OTP",
  //   inputType: InputTypes.OTP,
  //   required: false,
  //   zodType: z
  //     .string(validationMessages.required)
  //     .min(6, "Debe tener al menos 6 dígitos"),
  // },
  // {
  //   wrapInCard: true,
  //   name: "notifications",
  //   label: "Recibir Notificaciones con:",
  //   inputType: InputTypes.SIMPLE_CHECK_LIST,
  //   required: false,
  //   listConfig: {
  //     list:  [
  //       { id: 1, name: "email", checked: false },
  //       { id: 2, name: "sms", checked: false },
  //       { id: 3, name: "phone call", checked: false },
  //       { id: 4, name: "push notifications", checked: false },
  //     ],
  //     onOptionChange: (item:any) => {},
  //   }
  // }
];

  return (
    <>
      <DynamicForm<IUserRecord>
        formSubTitle="This is a subtitle"
        formTitle="Basic Form Example"
        withCard
        errorAlertPosition='down'
        // childrenHeader={<Button> childrenHeader</Button>}
        fields={mockFields}
        record={record}
        // extraValidations={[
        //   (s) =>
        //     s.refine((data) => data.password === data.confirmPassword, {
        //       path: ["confirmPassword"],
        //       message: "Las contraseñas no coinciden",
        //     }),
        // ]}
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