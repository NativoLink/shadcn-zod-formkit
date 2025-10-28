⚡️  # React Dynamic Form Maker

⚡️ **Next.js & Client Components**



📦 A React library for creating **dynamic forms** with **Zod validations**, supporting multiple input types: text, number, email, switch, color, date, select, file, and OTP.

---

## 📌 Installation

```bash
# Using npm
npm install shadcn-zod-formkit

# Using yarn
yarn add shadcn-zod-formkit
```

 Add Shadcn
 ```bash 
  # Add Shadcn 
  npx shadcn@latest init
 ```
 You need installa shadcn basic components
 ```bash 
 # Add Shadcn Basics
 npx shadcn@latest add  accordion alert badge button calendar card checkbox dialog popover form input label select sonner tooltip switch textarea input-otp collapsible input-group 
 ```



##  🛠️ Basic Usage

```bash
'use client'

import { 
  DynamicForm,
  FieldProps,
  InputTypes,
  TextInputType
} from "shadcn-zod-formkit";

export default function Home() {
  const record= {
    username: "John Doe ",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: undefined,
    age: 25,
    role: "editor",
  };

  return (
    <DynamicForm
      fields={mockFields}
      record={record}
      onSubmit={(data) => console.log("📤 Resultado final:", data)}
    />
  );
}

const mockFields: Array<FieldProps |FieldProps[]> = [
  // 🧍‍♂️ Campo requerido simple
  {
    name: "username",
    label: "Nombre de usuario",
    inputType: InputTypes.TEXT,
    // ZodTypeAny: z
    //   .string()
    //   .min(3)
    //   .max(20),
  },

  // // 📧 Campo de correo con validación personalizada (ZodTypeAny)
  {
    name: "email",
    label: "Correo electrónico",
    inputType: InputTypes.TEXT,
  },
]
```


## ✅ Features
  - Fully dynamic fields array support.
  - Multiple input types (text, email, number, color, date, select, switch, file, OTP).
  - Zod validation integration for robust form validation.
  - Supports default values via record prop.
  - Works seamlessly with React 18+ and TypeScript.

## 💡 Tips
  - Use peerDependencies for React to avoid version conflicts.
  - Wrap your forms inside a "use client" component if using Next.js App Router.
- Combine multiple FieldProps in arrays for grouped fields (like age + color).