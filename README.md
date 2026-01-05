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
 npx shadcn@latest add  accordion alert badge button calendar card checkbox dialog popover form input label select sonner tooltip switch textarea input-otp collapsible input-group radio-group slider button-group command tabs
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
  | **Input Currency**       |  `InputTypes.CURRENCY`             | 
  | **Input Key Value**      |  `InputTypes.KEY_VALUE`            | 
  | **Input Repeater**       |  `InputTypes.REPEATER`             | 
  | **Input Multi Select**   |  `InputTypes.MULTI_SELECT`         | 
  | **Select With Search**   |  `InputTypes.COMBOBOX`             | 
  | **Input Drag Drop List** |  `InputTypes.SORTABLE_LIST`        | 
  | **Dynamic Tabs**         |  `InputTypes.REPEATER_TABS`        | 
  | **Dynamic String List**  |  `InputTypes.STRING_LIST`          | 


## 🧩 FieldProps

Each field is defined using the `FieldProps` interface.

### Common Properties

| Property | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | `string` | ✅ | Field key |
| `label` | `string` | ✅ | Label text |
| `inputType` | `InputTypes` | ✅ | Input type |
| `zodType` | `ZodType` | ❌ | Validation schema |
| `placeHolder` | `string` | ❌ | Input placeholder |
| `disabled` | `boolean` | ❌ | Disable input |
| `options` | `Array` | ❌ | For select, radio, checkbox |
| `keyboardType` | `TextInputType` | ❌ | For Keyboard  |
| `className` | `string` | ❌ | For add CSS class  |
| `hidden` | `boolean` | ❌ | Hidden Input  |
| `infoTooltip` | `string` | ❌ | Add text Info tooltip  |
| `description` | `string` | ❌ | Description text |

#### 🔀 Conditional & Dynamic Behavior
| Property           | Type                        | Description            |
| ------------------ | --------------------------- | ---------------------- |
| `showWhen`         | `(values) => boolean`       | Conditional rendering  |
| `dependsOn`        | `string`                    | Dependency field       |
| `loadOptions`      | `(value) => Promise<any[]>` | Load dynamic options   |
| `onAnyFieldChange` | `(data) => void`            | Global change listener |


#### 📋 List Configuration
| Property            | Type                               | Description        |
| ------------------- | ---------------------------------- | ------------------ |
| `list`              | `InputOption[] \| GroupedOption[]` | Options list       |
| `optionLabel`       | `string`                           | Display property   |
| `optionValue`       | `string`                           | Value property     |
| `optionDescription` | `string`                           | Description field  |
| `sortable`          | `boolean`                          | Enable drag & drop |
| `onOptionChange`    | `(item) => void`                   | Selection callback |

#### 🔤 Input Group Configuration
| Property         | Type           | Description           |
| ---------------- | -------------- | --------------------- |
| `autoValidIcons` | `boolean`      | Auto validation icons |
| `iconsLeft`      | `LucideIcon[]` | Left icons            |
| `iconsRight`     | `LucideIcon[]` | Right icons           |
| `textLeft`       | `string`       | Prefix text           |
| `textRight`      | `string`       | Suffix text           |


#### 📂 File Input Configuration
| Property      | Type      | Description          |
| ------------- | --------- | -------------------- |
| `accept`      | `string`  | Accepted file types  |
| `multiple`    | `boolean` | Allow multiple files |
| `maxSize`     | `number`  | Max file size        |
| `previewSize` | `number`  | Preview size         |
| `showPreview` | `boolean` | Show file preview    |


#### 🗂️ GroupedOption
| Property          | Type            | Description    |
| ----------------- | --------------- | -------------- |
| `label`           | `string`        | Group label    |
| `options`         | `InputOption[]` | Group options  |
| `selectedOptions` | `InputOption[]` | Selected items |
| `disabled`        | `boolean`       | Disable group  |


#### 🔁 Repeater Fields (Dynamic Arrays)
| Property            | Type           | Description     |
| ------------------- | -------------- | --------------- |
| `repeaterFields`    | `FieldProps[]` | Nested fields   |
| `minItems`          | `number`       | Minimum items   |
| `maxItems`          | `number`       | Maximum items   |
| `withAddBtn`        | `boolean`      | Show add button |
| `isRemovebleOption` | `boolean`      | Allow remove    |



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

