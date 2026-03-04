'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const LocationPickerForm = dynamic(() => import('../advanced/LocationPickerForm'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

export default function LocationPickerPage() {
  return (
    <div className="container mx-auto py-8">
      <LocationPickerForm />
    </div>
  );
}
