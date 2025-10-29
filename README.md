⚡️  # React Dynamic Form Maker

⚡️ **Next.js & Client Components**



📦 A React library for creating **dynamic forms** with **Zod validations**, supporting multiple input types: text, number, email, switch, color, date, select, file, OTP and others.

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

import { Mail, User } from 'lucide-react';

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
    label: "Username",
    inputType: InputTypes.TEXT_GROUP,
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [User]
    },
    zodType: z.string().min(3).max(20),
  },
  {
    name: "email",
    label: "Email",
    inputType: InputTypes.TEXT_GROUP,
    inputGroupConfig:{
      autoValidIcons: true,
      iconsLeft: [Mail],
    },
    zodType: z
      .string()
      .email("Invalid Email")
      .optional(),
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
  | **Input Date Time**      |  `InputTypes.DATE_TIME`            | 
  | **Input Time**           |  `InputTypes.TIME`                 | 
  | **Upload Multi File**    |  `InputTypes.FILE_MULTI_UPLOAD`    | 
  | **Button Group**         |  `InputTypes.BUTTON_GROUP`         | 



## ✅ Features
  - Fully dynamic fields array support.
  - Multiple input types (text, email, number, color, date, select, switch, file, OTP, and others).
  - Zod validation integration for robust form validation.
  - Supports default values via record prop.
  - Works seamlessly with React 18+ and TypeScript.

## 💡 Tips
  - Use peerDependencies for React to avoid version conflicts.
  - Wrap your forms inside a "use client" component if using Next.js App Router.
  - Combine multiple FieldProps in arrays for grouped fields (like age + color).

## 🧠 Acknowledgements
  - React - A JavaScript library for building user interfaces.
  - Next.js - The React framework for production.
  - Tailwind CSS - A utility-first CSS framework for creating custom designs.
  - Zod - TypeScript-first schema declaration and validation.

