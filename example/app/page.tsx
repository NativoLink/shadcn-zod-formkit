export const dynamic = 'force-dynamic';

import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExamplesTabs } from "./examples-tabs";

export default function Home() {
  return (
    <main className="flex w-full  flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">shadcn-zod-formkit Examples</h1>
        <Link href="/form-builder">
          <Button variant="default" size="lg">
            🎨 Open Form Builder
          </Button>
        </Link>
      </div>
      
      <ExamplesTabs />
      <Toaster />
    </main>
  )
}

