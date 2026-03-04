'use client'

import { useState } from 'react';
import { 
  DynamicForm,
  InputTypes,
  FieldConfig,
} from 'shadcn-zod-formkit';
import { z } from "zod";
import { Card } from '@/components/ui/card';

interface INewFeaturesForm {
  email: string;
  rating: number;
  phone: string;
  website: string;
  password: string;
  username: string;
}

export default function NewFeaturesForm() {
  const [dataToSend, setDataToSend] = useState<any>({});

  const record: INewFeaturesForm = {
    email: "",
    rating: 0,
    phone: "",
    website: "",
    password: "",
    username: "",
  };

  const fields: FieldConfig<INewFeaturesForm> = [
    {
      name: "email",
      label: "Email Address",
      inputType: InputTypes.EMAIL,
      placeHolder: "your@email.com",
      description: "We'll send you a confirmation email",
      showSuggestions: true,
      showValidIcon: true,
      clearable: true,
      zodType: z.string().email("Please enter a valid email address"),
    },
    {
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT_GROUP,
      placeHolder: "Choose a unique username",
      description: "Your username must be unique",
      maxLength: 20,
      showCharCount: true,
      clearable: true,
      zodType: z.string().min(3).max(20),
    },
    {
      name: "rating",
      label: "Rate Your Experience",
      inputType: InputTypes.RATING,
      description: "How would you rate our service?",
      max: 5,
      showValue: true,
      zodType: z.number().min(1, "Please provide a rating").max(5),
    },
    {
      name: "phone",
      label: "Phone Number",
      inputType: InputTypes.PHONE,
      description: "Enter your phone number with country code",
      defaultCountryCode: "+1",
      zodType: z.string().min(10, "Phone number is required"),
    },
    {
      name: "website",
      label: "Website",
      inputType: InputTypes.URL,
      description: "Your personal or company website",
      showPreview: true,
      autoProtocol: true,
      zodType: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    },
    {
      name: "password",
      label: "Password",
      inputType: InputTypes.PASSWORD,
      description: "Create a strong password",
      showStrength: true,
      showRequirements: true,
      zodType: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain uppercase letter")
        .regex(/[a-z]/, "Must contain lowercase letter")
        .regex(/\d/, "Must contain number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character"),
    },
  ];

  return (
    <div className='w-full gap-2 grid grid-cols-1 lg:grid-cols-2'>
      <div className='w-full'>
        <DynamicForm<INewFeaturesForm>
          formTitle="New Features Demo"
          formSubTitle="Try out the latest input types and features"
          withCard
          fields={fields}
          record={record}
          errorAlertPosition='down'
          onSubmit={({ data }) => {
            setDataToSend(data);
            console.log("📤 Result:", data);
          }}
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">Form Data</div>
          <div className="text-sm text-muted-foreground">
            Live form data preview
          </div>
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
            <code>{JSON.stringify(dataToSend, null, 2)}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
}
