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

interface IRangeForm {
  productName: string;
  priceRange: {
    min: number;
    max: number;
  };
  description?: string;
}

export default function RangeForm() {
  const [dataToSend, setDataToSend] = useState<any>({});

  const record: IRangeForm = {
    productName: "",
    priceRange: { min: 0, max: 100 },
    description: "",
  };

  const fields: FieldConfig<IRangeForm> = [
    {
      name: "productName",
      label: "Product Name",
      inputType: InputTypes.TEXT_GROUP,
      placeHolder: "Enter product name",
      description: "The name of your product",
      required: true,
      zodType: z.string().min(2, "Product name must be at least 2 characters"),
    },
    {
      name: "priceRange",
      label: "Price Range",
      inputType: InputTypes.RANGE,
      description: "Select the minimum and maximum price range",
      required: true,
      min: 0,
      max: 1000,
      step: 10,
      zodType: z.object({
        min: z.number().min(0),
        max: z.number().max(1000),
      }).refine((data) => data.max > data.min, {
        message: "Maximum price must be greater than minimum price",
      }),
    },
    {
      name: "description",
      label: "Description",
      inputType: InputTypes.TEXTAREA,
      placeHolder: "Describe your product...",
      description: "Optional product description",
      zodType: z.string().optional(),
    },
  ];

  const onSubmit = (data: FormResp<IRangeForm>) => {
    console.log('Form Data:', data);
    setDataToSend(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Range Input Form Example</h2>
        <p className="text-gray-600 mb-6">
          This form demonstrates the RANGE input type. Use the slider to select a price range for your product.
        </p>

        <DynamicForm<IRangeForm>
          fields={fields}
          record={record}
          onSubmit={onSubmit}
          submitBtnLabel={'Create Product'}
          formTitle={'Range Input Form'} />
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