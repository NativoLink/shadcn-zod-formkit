
import { FormTest } from "./FormTest";


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { JSX, ReactNode } from "react";
import { AccordionGroupForm, FormBasics } from "./examples";


interface ITab {
  name: string,
  value?: string,
  children:ReactNode | JSX.Element
}

export default function Home() {


  const tabs: ITab[] = [
    { name: 'Basics', children: <FormBasics/>},
    { name: 'Advanced', children: <AccordionGroupForm />}
  ]
  return (
    <main className="flex w-full  flex-col gap-6">
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
            <div className="grid grid-cols-3 align-middle justify-around w-full gap-6 p-2">
              {tab.children}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </main>
  )
}

