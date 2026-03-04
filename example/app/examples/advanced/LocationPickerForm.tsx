'use client'

import { useState } from 'react';
import { 
  DynamicForm,
  InputTypes,
  FieldConfig,
} from 'shadcn-zod-formkit';
import { z } from "zod";
import { Card } from '@/components/ui/card';

interface ILocationForm {
  businessName: string;
  businessLocation: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    formattedAddress?: string;
  };
  deliveryLocation?: {
    lat: number;
    lng: number;
    address?: string;
    formattedAddress?: string;
  };
  notes?: string;
}

export default function LocationPickerForm() {
  const [dataToSend, setDataToSend] = useState<any>({});

  const record: ILocationForm = {
    businessName: "",
    businessLocation: {
      lat: 0,
      lng: 0,
    },
    deliveryLocation: undefined,
    notes: "",
  };

  const fields: FieldConfig<ILocationForm> = [
    {
      name: "businessName",
      label: "Business Name",
      inputType: InputTypes.TEXT_GROUP,
      placeHolder: "Enter your business name",
      description: "The name of your business or location",
      required: true,
      zodType: z.string().min(3, "Business name must be at least 3 characters"),
    },
    {
      name: "businessLocation",
      label: "Business Location",
      inputType: InputTypes.LOCATION_PICKER,
      description: "Select the exact location of your business on the map",
      required: true,
      defaultZoom: 15,
      showSearch: true,
      showCurrentLocation: true,
      showCoordinates: true,
      height: 400,
      zodType: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        formattedAddress: z.string().optional(),
      }),
    },
    {
      name: "deliveryLocation",
      label: "Delivery Location (Optional)",
      inputType: InputTypes.LOCATION_PICKER,
      description: "If different from business location, select delivery address",
      required: false,
      defaultZoom: 13,
      showSearch: true,
      showCurrentLocation: true,
      showCoordinates: true,
      height: 350,
      zodType: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
        formattedAddress: z.string().optional(),
      }).optional(),
    },
    {
      name: "notes",
      label: "Additional Notes",
      inputType: InputTypes.TEXTAREA,
      placeHolder: "Any additional information about the location...",
      description: "Provide any special instructions or details",
      zodType: z.string().optional(),
    },
  ];

  return (
    <div className='w-full gap-4 grid grid-cols-1'>
      <div className='w-full'>
        <DynamicForm<ILocationForm>
          formTitle="📍 Location Picker Demo"
          formSubTitle="Select locations using OpenStreetMap"
          withCard
          fields={fields}
          record={record}
          errorAlertPosition='down'
          onSubmit={({ data }) => {
            setDataToSend(data);
            console.log("📤 Location Data:", data);
          }}
        />
      </div>

      {/* Result Display */}
      {Object.keys(dataToSend).length > 0 && (
        <Card className='p-6'>
          <h3 className='text-lg font-bold mb-4'>📊 Submitted Data</h3>
          
          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold text-sm text-gray-700 mb-2'>Business Information:</h4>
              <p className='text-sm'><strong>Name:</strong> {dataToSend.businessName}</p>
            </div>

            {dataToSend.businessLocation && (
              <div>
                <h4 className='font-semibold text-sm text-gray-700 mb-2'>Business Location:</h4>
                <div className='text-sm space-y-1'>
                  <p><strong>Coordinates:</strong> {dataToSend.businessLocation.lat.toFixed(6)}, {dataToSend.businessLocation.lng.toFixed(6)}</p>
                  {dataToSend.businessLocation.formattedAddress && (
                    <p><strong>Address:</strong> {dataToSend.businessLocation.formattedAddress}</p>
                  )}
                  {dataToSend.businessLocation.city && (
                    <p><strong>City:</strong> {dataToSend.businessLocation.city}</p>
                  )}
                  {dataToSend.businessLocation.country && (
                    <p><strong>Country:</strong> {dataToSend.businessLocation.country}</p>
                  )}
                  {dataToSend.businessLocation.postalCode && (
                    <p><strong>Postal Code:</strong> {dataToSend.businessLocation.postalCode}</p>
                  )}
                </div>
              </div>
            )}

            {dataToSend.deliveryLocation && (
              <div>
                <h4 className='font-semibold text-sm text-gray-700 mb-2'>Delivery Location:</h4>
                <div className='text-sm space-y-1'>
                  <p><strong>Coordinates:</strong> {dataToSend.deliveryLocation.lat.toFixed(6)}, {dataToSend.deliveryLocation.lng.toFixed(6)}</p>
                  {dataToSend.deliveryLocation.formattedAddress && (
                    <p><strong>Address:</strong> {dataToSend.deliveryLocation.formattedAddress}</p>
                  )}
                </div>
              </div>
            )}

            {dataToSend.notes && (
              <div>
                <h4 className='font-semibold text-sm text-gray-700 mb-2'>Notes:</h4>
                <p className='text-sm'>{dataToSend.notes}</p>
              </div>
            )}
          </div>

          <div className='mt-6 p-4 bg-gray-50 rounded-md'>
            <h4 className='font-semibold text-sm text-gray-700 mb-2'>Raw JSON:</h4>
            <pre className='text-xs overflow-auto max-h-64'>
              {JSON.stringify(dataToSend, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className='p-6 bg-blue-50 border-blue-200'>
        <h3 className='text-lg font-bold mb-3 text-blue-900'>💡 How to Use</h3>
        <ul className='text-sm text-blue-800 space-y-2'>
          <li>🔍 <strong>Search:</strong> Type an address in the search box and press Enter</li>
          <li>📍 <strong>Current Location:</strong> Click the navigation button to use your GPS location</li>
          <li>🗺️ <strong>Map Controls:</strong> Use zoom buttons and fullscreen mode</li>
          <li>📋 <strong>Copy Coordinates:</strong> Click the copy button to copy lat/lng to clipboard</li>
          <li>🌍 <strong>OpenStreetMap:</strong> Free and open-source mapping service</li>
        </ul>
      </Card>

      {/* Features Card */}
      <Card className='p-6 bg-green-50 border-green-200'>
        <h3 className='text-lg font-bold mb-3 text-green-900'>✨ Features</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800'>
          <div>
            <p className='font-semibold mb-1'>🎯 Geocoding</p>
            <p className='text-xs'>Search addresses and get coordinates</p>
          </div>
          <div>
            <p className='font-semibold mb-1'>🔄 Reverse Geocoding</p>
            <p className='text-xs'>Get address from coordinates</p>
          </div>
          <div>
            <p className='font-semibold mb-1'>📱 GPS Detection</p>
            <p className='text-xs'>Use device location automatically</p>
          </div>
          <div>
            <p className='font-semibold mb-1'>🗺️ Interactive Map</p>
            <p className='text-xs'>Zoom, pan, and fullscreen mode</p>
          </div>
          <div>
            <p className='font-semibold mb-1'>📍 Precise Coordinates</p>
            <p className='text-xs'>Latitude and longitude with 6 decimals</p>
          </div>
          <div>
            <p className='font-semibold mb-1'>🆓 No API Key</p>
            <p className='text-xs'>Uses free OpenStreetMap services</p>
          </div>
        </div>
      </Card>

      {/* Use Cases Card */}
      <Card className='p-6 bg-purple-50 border-purple-200'>
        <h3 className='text-lg font-bold mb-3 text-purple-900'>🎯 Use Cases</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-800'>
          <div>
            <p className='font-semibold mb-2'>🏢 Business Registration</p>
            <ul className='text-xs space-y-1 list-disc list-inside'>
              <li>Store locations</li>
              <li>Office addresses</li>
              <li>Branch locations</li>
            </ul>
          </div>
          <div>
            <p className='font-semibold mb-2'>🚚 Delivery Apps</p>
            <ul className='text-xs space-y-1 list-disc list-inside'>
              <li>Pickup locations</li>
              <li>Delivery addresses</li>
              <li>Route planning</li>
            </ul>
          </div>
          <div>
            <p className='font-semibold mb-2'>📍 Check-in Systems</p>
            <ul className='text-xs space-y-1 list-disc list-inside'>
              <li>Event locations</li>
              <li>Attendance tracking</li>
              <li>Geofencing</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
