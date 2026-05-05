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

interface IDateRangeForm {
  eventName: string;
  eventDateRange: {
    from?: Date;
    to?: Date;
  };
  description?: string;
}

export default function DateRangeForm() {
  const [dataToSend, setDataToSend] = useState<any>({});

  const record: IDateRangeForm = {
    eventName: "",
    eventDateRange: {},
    description: "",
  };

  const fields: FieldConfig<IDateRangeForm> = [
    {
      name: "eventName",
      label: "Event Name",
      inputType: InputTypes.TEXT_GROUP,
      placeHolder: "Enter event name",
      description: "The name of your event",
      required: true,
      zodType: z.string().min(3, "Event name must be at least 3 characters"),
    },
    {
      name: "eventDateRange",
      label: "Event Date Range",
      inputType: InputTypes.DATE_RANGE,
      description: "Select the start and end dates for your event",
      required: true,
      zodType: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }).refine((data) => data.from && data.to, {
        message: "Both start and end dates are required",
      }),
    },
    {
      name: "description",
      label: "Description",
      inputType: InputTypes.TEXTAREA,
      placeHolder: "Describe your event...",
      description: "Provide details about the event",
      zodType: z.string().optional(),
    },
  ];

  const onSubmit = (data: FormResp<IDateRangeForm>) => {
    console.log('Form Data:', data);
    setDataToSend(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">🗓️ Date Range Form Example</h2>
        <p className="text-gray-600 mb-6">
          This form demonstrates the DATE_RANGE input type. Select a date range for your event.
        </p>

        <DynamicForm<IDateRangeForm>
          fields={fields}
          record={record}
          onSubmit={onSubmit}
          submitBtnLabel={'Create Event'} 
          formTitle={'Date Range Form'} />
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