
import { FormTest } from "./FormTest";
import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { JSX, ReactNode } from "react";
import { AccordionGroupForm } from "./examples/advanced";


interface ITab {
  name: string,
  value?: string,
  children:ReactNode | JSX.Element
}

export default function Home() {


  const tabs: ITab[] = [
    { name: 'Basics', children: <FormTest/>},
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
        tabs.map(tab => 
          <TabsContent value={tab.value ?? tab.name}>
            <div className="grid grid-cols-3 align-middle justify-around w-full gap-6 p-2">
              {tab.children}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </main>
  )
}

