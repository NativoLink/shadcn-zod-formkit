'use client'

import { useState } from 'react';
import {
  DynamicForm,
  InputTypes,
  FieldConfig,
  FormResp,
} from 'shadcn-zod-formkit';
import { z } from "zod";
import { Card } from '@/components/ui/card';

interface ICountryForm {
  userName: string;
  country: string;
  description?: string;
}

export default function CountrySelectForm() {
  const [dataToSend, setDataToSend] = useState<any>({});

  const record: ICountryForm = {
    userName: "",
    country: "",
    description: "",
  };

  const fields: FieldConfig<ICountryForm> = [
    {
      name: "userName",
      label: "User Name",
      inputType: InputTypes.TEXT_GROUP,
      placeHolder: "Enter your name",
      description: "Your full name",
      required: true,
      zodType: z.string().min(2, "Name must be at least 2 characters"),
    },
    {
      name: "country",
      label: "Country",
      inputType: InputTypes.COUNTRY_SELECT,
      description: "Select your country from the list",
      required: true,
      zodType: z.string().min(1, "Please select a country"),
    },
    {
      name: "description",
      label: "Description",
      inputType: InputTypes.TEXTAREA,
      placeHolder: "Tell us about yourself...",
      description: "Optional description",
      zodType: z.string().optional(),
    },
  ];

  const onSubmit = (data: FormResp<ICountryForm>) => {
    console.log('Form Data:', data);
    setDataToSend(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">🌍 Country Select Form Example</h2>
        <p className="text-gray-600 mb-6">
          This form demonstrates the COUNTRY_SELECT input type. Choose your country from the searchable dropdown with flags.
        </p>

        <DynamicForm<ICountryForm>
          fields={fields}
          record={record}
          onSubmit={onSubmit}
          submitBtnLabel={'Submit'}
          formTitle={'Country Select Form'}        />
      </Card>

      {Object.keys(dataToSend).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">📤 Submitted Data</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(dataToSend, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}