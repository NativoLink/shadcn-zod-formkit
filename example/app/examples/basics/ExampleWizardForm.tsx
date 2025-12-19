"use client"

import { z } from "zod"
import { 
  InputTypes,
  DynamicForm,
  TextInputType, 
  validationMessages,
  FormResp,
  WizardForm,
  FieldConfig } from 'shadcn-zod-formkit';
import { IUserRecord } from "./BasicForm";
import { Hash, Mail, User } from "lucide-react";
import { toast } from "sonner";




// ✅ 1️⃣ Define tus campos por paso
const userFields: FieldConfig<IUserRecord>[] = [
  // Paso 1
  [
    {
      step:1,
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT_GROUP,
      infoTooltip:"Your unique username to login",
      inputGroupConfig:{
        autoValidIcons: true,
        iconsLeft: [User]
      },
      zodType: z
        .string("Es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(20, "El nombre no puede tener más de 20 caracteres") ,
    },
    {
      step:1,
      direction: 'col',
      name: "email",
      label: "Email",
      inputType: InputTypes.TEXT_GROUP,
      inputGroupConfig:{
        // autoValidIcons: true,
        iconsLeft: [Mail],
      },
      zodType: z
        .string()
        .email("Correo inválido")
    },
  ],
  // Paso 2
  [
    {
      step:2,  
      wrapInCard: true,
      name: "bloodType",
      label: "Blood Type",
      description:'This is a description',
      inputType: InputTypes.RADIO_GROUP,
      zodType: z.string(validationMessages.required)
        .min(1, "Selecciona un tipo de sangre"),
    },
    { 
      step:2,  
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
    },
  ],
  // Paso 3
  [
    {
      step:3,
      name: "favoriteColor",
      label: "Color favorito",
      inputType: InputTypes.COLOR,
      required: false,
      zodType: z
        .string()
        .regex(/^#([0-9A-Fa-f]{6})$/, "Debe ser un color hexadecimal válido"),
    },
    {
      step:3,
      name: "isActive",
      label: "Usuario activo",
      description:'This is a description',
      inputType: InputTypes.SWITCH,
      zodType: z.boolean(),
      disabled: true
    }
  ],
]

// ✅ 2️⃣ Usa el WizardForm dentro de un componente
export default function ExampleWizardForm() {
  const record: IUserRecord = {
    id: 1,
    username: "John Doe",
    email: "johndoe@example.com",
    continent: '2',
    country: '1',
    isActive: false,
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
    contacts:[
      {
        "name": "juan XX",
        "email": "123123@adsd.com"
      }
    ],
    secretKeys: [
    {
      "key": "1",
      "value": "zzzz"
    },
    {
      "key": "2",
      "value": "asdaLUISsd"
    }
  ],
    notifications: [],
    cycles: [],
    tags: [ "tag1", "tag2"],
  };

  return (

    <WizardForm<IUserRecord> fields={userFields} record={record} skipSteps={false}>
      {({ stepFields, currentStep, setCurrentStep, totalSteps }) => {
        const isTheEnd = currentStep == totalSteps;
        const btnLabel = isTheEnd ? 'Save' : 'Next'
        return (
        <DynamicForm<IUserRecord>
          record={record}
          formSubTitle="This is a subtitle"
          formTitle={`Wizard Form Example - Step ${currentStep}`}
          withCard
          currentStep={currentStep}
          totalSteps={totalSteps}
          submitBtnLabel={btnLabel}
          errorAlertPosition='down'
          fields={stepFields}
          isWrapInWizard={true}
          onSubmit={({data, form}) => {
            setCurrentStep((prev) => prev + ( isTheEnd ? 0 : 1))
            if (isTheEnd){ 
            console.log("✅ Resultado final del Wizard:", data)
            toast.info(
                    <pre className="flex flex-row  text-xs text-gray-800 p-4">
                <code>{JSON.stringify(form?.getValues(), null, 2)}</code>
              </pre>
            );}
          }}
        /> 
      )}}
    </WizardForm>
      
  )
}
