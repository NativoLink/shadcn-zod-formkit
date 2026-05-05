'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { JSX, ReactNode } from "react";
import { AccordionGroupForm } from "./examples/advanced";
import NewFeaturesForm from "./examples/advanced/NewFeaturesForm";
import BasicForm from "./examples/basics/BasicForm";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LocationPickerForm = dynamic(() => import("./examples/advanced/LocationPickerForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

const DateRangeForm = dynamic(() => import("./examples/advanced/DateRangeForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

const CountrySelectForm = dynamic(() => import("./examples/advanced/CountrySelectForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

const RangeForm = dynamic(() => import("./examples/advanced/RangeForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

const FileUploadForm = dynamic(() => import("./examples/advanced/FileUploadForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

interface ITab {
  name: string,
  value?: string,
  children: ReactNode | JSX.Element
}

export function ExamplesTabs() {
  const tabs: ITab[] = [
    { name: 'Basics', children: <BasicForm/>},
    { name: 'Advanced', children: <AccordionGroupForm />},
    { name: '✨ New Features', children: <NewFeaturesForm />},
    { name: '📍 Location Picker', children: <LocationPickerForm />},
    { name: '🗓️ Date Range', children: <DateRangeForm />},
    { name: '🌍 Country Select', children: <CountrySelectForm />},
    { name: '📊 Range', children: <RangeForm />},
    { name: '📁 File Upload', children: <FileUploadForm />}
  ]

  return (
    <Tabs defaultValue={tabs[0].name} >
      <TabsList>
      { 
        tabs.map((tab, indx) => 
          <TabsTrigger key={indx} value={tab.value ?? tab.name}>{tab.name}</TabsTrigger>
        )}
      </TabsList>
      
      { 
      tabs.map((tab, indx) => 
        <TabsContent key={indx} value={tab.value ?? tab.name}>
          <div className="flex flex-row align-middle justify-around w-full gap-6 p-2">
            {tab.children}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
