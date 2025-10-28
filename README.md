⚡️  # React Dynamic Form Maker

⚡️ **Next.js & Client Components**



📦 A React library for creating **dynamic forms** with **Zod validations**, supporting multiple input types: text, number, email, switch, color, date, select, file, and OTP.

---

## 📌 Installation

```typescript
# Using npm
npm install shadcn-zod-formkit

# Using yarn
yarn add shadcn-zod-formkit
```

 Add Shadcn
 ```typescript 
  # Add Shadcn 
  npx shadcn@latest init
 ```
 You need installa shadcn basic components
 ```typescript 
 # Add Shadcn Basics
 npx shadcn@latest add  accordion alert badge button calendar card checkbox dialog popover form input label select sonner tooltip switch textarea input-otp collapsible input-group radio-group slider button-group
 ```



##  🛠️ Basic Usage
#### First Dynamic Form 

```typescript
'use client'

import { 
  DynamicForm,
  FieldProps,
  InputTypes,
  TextInputType
} from "shadcn-zod-formkit";

export default function Home() {
  // Record From DB example (User),
  // record is used for define default values
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
      formTitle="Title Form"
      fields={mockFields}
      record={record}
      onSubmit={(data) => console.log("📤 Resultado final:", data)}
    />
  );
}

const mockFields: Array<FieldProps |FieldProps[]> = [
  {
    name: "username",
    label: "Nombre de usuario",
    inputType: InputTypes.TEXT,
    ZodTypeAny: z .string().min(3).max(20),
  },
  {
    name: "email",
    label: "Correo electrónico",
    inputType: InputTypes.TEXT,
  },
]
```

## 📚 Field Types ( InputTypes ) Avaible
  | Types                    | Use                            |
  | -------------------------|:-------------------------------:
  | **Text**                 |  `InputTypes.TEXT_GROUP`           | 
  | **Color Picker**         |  `InputTypes.COLOR`                | 
  | **Switch**               |  `InputTypes.SWITCH`               | 
  | **Checkbox**             |  `InputTypes.CHECKBOX`             | 
  | **Date Picker**          |  `InputTypes.DATE`                 | 
  | **Date Time Picker**     |  `InputTypes.DATE_TIME`            | 
  | **Select**               |  `InputTypes.SELECT`               | 
  | **OTP Code**             |  `InputTypes.OTP`                  | 
  | **Upload File**          |  `InputTypes.FILE`                 | 
  | **Checkbox List**        |  `InputTypes.SIMPLE_CHECK_LIST`    | 
  | **Switch List**          |  `InputTypes.GROUPED_SWITCH_LIST`  | 
  | **Radio Group**          |  `InputTypes.RADIO_GROUP`          | 
  | **Tags**                 |  `InputTypes.TAGS`                 | 


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