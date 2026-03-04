⚡️ # React Dynamic Form Maker

⚡️ **Next.js & Client Components**

📦 A React library for creating **dynamic forms** with **Zod validations**, supporting multiple input types: text, number, email, switch, color, date, select, file, OTP and many more.

---

## 📌 Installation

```bash
# Using npm
npm install shadcn-zod-formkit

# Using yarn
yarn add shadcn-zod-formkit

# Using pnpm
pnpm add shadcn-zod-formkit
```

### Add Shadcn UI

```bash
# Initialize Shadcn 
npx shadcn@latest init
```

### Install Required Shadcn Components

```bash
# Add Shadcn Basics
npx shadcn@latest add accordion alert badge button calendar card checkbox dialog popover form input label select sonner tooltip switch textarea input-otp collapsible input-group radio-group slider button-group command tabs
```

---

## 🛠️ Basic Usage

### First Dynamic Form 

```typescript
'use client'

import { 
  DynamicForm,
  FieldConfig,
  InputTypes,
  TextInputType
} from "shadcn-zod-formkit";
import { Mail, User } from 'lucide-react';
import { z } from 'zod';

interface IUser {
  username: string;
  email: string;
  age: number;
}

export default function BasicFormExample() {
  const record: IUser = {
    username: "John Doe",
    email: "johndoe@example.com",
    age: 25,
  };

  const fields: FieldConfig<IUser> = [
    {
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT_GROUP,
      inputGroupConfig: {
        autoValidIcons: true,
        iconsLeft: [User]
      },
      zodType: z.string().min(3).max(20),
    },
    {
      name: "email",
      label: "Email",
      inputType: InputTypes.TEXT_GROUP,
      inputGroupConfig: {
        autoValidIcons: true,
        iconsLeft: [Mail],
      },
      zodType: z.string().email("Invalid Email"),
    },
    {
      name: "age",
      label: "Age",
      inputType: InputTypes.NUMBER,
      zodType: z.coerce.number().min(18).max(99),
    }
  ];

  return (
    <DynamicForm<IUser>
      formTitle="User Registration"
      formSubTitle="Fill in your details"
      withCard
      fields={fields}
      record={record}
      onSubmit={({ data }) => {
        console.log("📤 Form submitted:", data);
      }}
    />
  );
}
```

---

## 📚 Available Input Types

| Input Type                          | Constant                                  | Description                           |
|-------------------------------------|-------------------------------------------|---------------------------------------|
| **Text Input**                      | `InputTypes.TEXT_GROUP`                   | Text input with icon support          |
| **Email Input** ✨                  | `InputTypes.EMAIL`                        | Email with validation & suggestions   |
| **Search Input** ✨                 | `InputTypes.SEARCH`                       | Search with history & fuzzy matching  |
| **Number Input**                    | `InputTypes.NUMBER`                       | Numeric input                         |
| **Currency Input**                  | `InputTypes.CURRENCY`                     | Currency formatted input              |
| **Color Picker**                    | `InputTypes.COLOR`                        | Color selection                       |
| **Switch**                          | `InputTypes.SWITCH`                       | Toggle switch                         |
| **Checkbox**                        | `InputTypes.CHECKBOX`                     | Single checkbox                       |
| **Date Picker**                     | `InputTypes.DATE`                         | Date selection                        |
| **Date Time Picker**                | `InputTypes.DATE_TIME`                    | Date and time selection               |
| **Time Picker**                     | `InputTypes.TIME`                         | Time selection                        |
| **Location Picker** ✨              | `InputTypes.LOCATION_PICKER`              | Interactive map with GPS & geocoding  |
| **Select**                          | `InputTypes.SELECT`                       | Dropdown select                       |
| **Multi Select**                    | `InputTypes.MULTI_SELECT`                 | Multiple selection dropdown           |
| **Combobox**                        | `InputTypes.COMBOBOX`                     | Searchable select                     |
| **Radio Group**                     | `InputTypes.RADIO_GROUP`                  | Radio button group                    |
| **Button Group**                    | `InputTypes.BUTTON_GROUP`                 | Button selection group                |
| **Slider**                          | `InputTypes.SLIDER`                       | Range slider                          |
| **OTP Code**                        | `InputTypes.OTP`                          | One-time password input               |
| **File Upload**                     | `InputTypes.FILE`                         | Single file upload                    |
| **Multi File Upload**               | `InputTypes.FILE_MULTI_UPLOAD`            | Multiple file upload                  |
| **Tags**                            | `InputTypes.TAGS`                         | Tag input (deprecated)                |
| **String List**                     | `InputTypes.STRING_LIST`                  | Dynamic string list                   |
| **Simple Check List**               | `InputTypes.SIMPLE_CHECK_LIST`            | Simple checkbox list                  |
| **Grouped Switch List**             | `InputTypes.GROUPED_SWITCH_LIST`          | Grouped switches                      |
| **Accordion Grouped Switches**      | `InputTypes.ACCORDION_GROUPED_SWITCH_LIST`| Accordion with grouped switches       |
| **Key-Value Input**                 | `InputTypes.KEY_VALUE`                    | Key-value pair input                  |
| **Repeater**                        | `InputTypes.REPEATER`                     | Dynamic array of fields               |
| **Repeater Tabs**                   | `InputTypes.REPEATER_TABS`                | Dynamic tabs with fields              |
| **Sortable List**                   | `InputTypes.SORTABLE_LIST`                | Drag and drop sortable list           |
| **Hidden**                          | `InputTypes.HIDDEN`                       | Hidden field                          |

---

## 🧩 DynamicForm Props

### Main Props

| Property              | Type                              | Required | Default      | Description                          |
|-----------------------|-----------------------------------|----------|--------------|--------------------------------------|
| `formTitle`           | `string`                          | ✅       | -            | Form title                           |
| `formSubTitle`        | `string`                          | ❌       | -            | Form subtitle                        |
| `fields`              | `FieldConfig<T>[]`                | ✅       | -            | Array of field configurations        |
| `record`              | `Partial<T>`                      | ❌       | `{}`         | Initial form values                  |
| `onSubmit`            | `(resp: FormResp<T>) => void`     | ❌       | -            | Submit handler                       |
| `onClick`             | `(resp: FormResp<T>) => void`     | ❌       | -            | Click handler (alternative to submit)|
| `onAnyFieldChange`    | `(data: Record<string,any>) => void` | ❌    | -            | Triggered on any field change        |

### Display Options

| Property              | Type                              | Default      | Description                          |
|-----------------------|-----------------------------------|--------------|--------------------------------------|
| `withCard`            | `boolean`                         | `false`      | Wrap form in a card                  |
| `showFormHeader`      | `boolean`                         | `true`       | Show/hide form header                |
| `showIcon`            | `boolean`                         | `false`      | Show icon in header                  |
| `readOnly`            | `boolean`                         | `false`      | Make all fields read-only            |
| `withErrorsAlert`     | `boolean`                         | `true`       | Show error alert                     |
| `errorAlertPosition`  | `'up' \| 'down'`                  | `'up'`       | Position of error alert              |

### Button Configuration

| Property                  | Type                              | Default         | Description                          |
|---------------------------|-----------------------------------|-----------------|--------------------------------------|
| `withSubmitBtn`           | `boolean`                         | `true`          | Show submit button                   |
| `submitBtnLabel`          | `string`                          | `'Guardar'`     | Submit button label                  |
| `submitBtnLabelSubmiting` | `string`                          | `'Guardando...'`| Label while submitting               |
| `submitBtnClass`          | `string`                          | `''`            | Custom CSS class for submit button   |
| `btnGroupDirection`       | `'flex-start' \| 'flex-end' \| 'flex-center'` | `'flex-end'` | Button alignment    |
| `listBtnConfig`           | `BtnConfig[]`                     | `[]`            | Additional custom buttons            |

### Advanced Options

| Property              | Type                                          | Description                          |
|-----------------------|-----------------------------------------------|--------------------------------------|
| `extraValidations`    | `((schema: ZodObject<any>) => ZodObject<any>)[]` | Additional Zod validations        |
| `children`            | `ReactNode`                                   | Additional content                   |
| `childrenHeader`      | `ReactNode`                                   | Custom header content                |
| `debug`               | `boolean`                                     | Enable debug mode                    |

### Wizard Form Props

| Property              | Type                              | Description                          |
|-----------------------|-----------------------------------|--------------------------------------|
| `isWrapInWizard`      | `boolean`                         | Enable wizard mode                   |
| `currentStep`         | `number`                          | Current step number                  |
| `totalSteps`          | `number`                          | Total number of steps                |

---

## 🔧 FieldProps Configuration

### Common Properties

| Property          | Type                              | Required | Description                          |
|-------------------|-----------------------------------|----------|--------------------------------------|
| `name`            | `keyof T`                         | ✅       | Field key (must match type)          |
| `label`           | `string`                          | ✅       | Field label                          |
| `inputType`       | `InputTypes`                      | ✅       | Type of input                        |
| `zodType`         | `ZodTypeAny`                      | ❌       | Zod validation schema                |
| `placeHolder`     | `string`                          | ❌       | Input placeholder                    |
| `description`     | `string`                          | ❌       | Helper text below input              |
| `disabled`        | `boolean`                         | ❌       | Disable input                        |
| `required`        | `boolean`                         | ❌       | Mark as required                     |
| `hidden`          | `boolean`                         | ❌       | Hide field                           |
| `className`       | `string`                          | ❌       | Custom CSS class                     |
| `infoTooltip`     | `string`                          | ❌       | Tooltip text                         |
| `wrapInCard`      | `boolean`                         | ❌       | Wrap field in card                   |
| `defaultValue`    | `any`                             | ❌       | Default value                        |
| `direction`       | `'row' \| 'col'`                  | ❌       | Layout direction                     |

### Conditional & Dynamic Behavior

| Property          | Type                                  | Description                          |
|-------------------|---------------------------------------|--------------------------------------|
| `showWhen`        | `(values: Record<string, any>) => boolean` | Conditional rendering           |
| `dependsOn`       | `string`                              | Field dependency                     |
| `loadOptions`     | `(value: any) => Promise<any[]>`      | Load dynamic options                 |
| `onChange`        | `(event: any[], formValues?: Record<string,any>) => void` | Change handler |
| `onAnyFieldChange`| `(data: Record<string,any>) => void`  | Global change listener               |

### Input Group Configuration

| Property              | Type                              | Description                          |
|-----------------------|-----------------------------------|--------------------------------------|
| `inputGroupConfig`    | `inputGroudConfig`                | Input group settings                 |

#### inputGroudConfig Properties

| Property          | Type                              | Description                          |
|-------------------|-----------------------------------|--------------------------------------|
| `autoValidIcons`  | `boolean`                         | Auto validation icons                |
| `iconsLeft`       | `LucideIcon[]`                    | Left icons                           |
| `iconsRight`      | `LucideIcon[]`                    | Right icons                          |
| `textLeft`        | `string`                          | Prefix text                          |
| `textRight`       | `string`                          | Suffix text                          |

### List Configuration

| Property          | Type                                  | Description                          |
|-------------------|---------------------------------------|--------------------------------------|
| `listConfig`      | `ListConfig`                          | List/options configuration           |

#### ListConfig Properties

| Property          | Type                                  | Description                          |
|-------------------|---------------------------------------|--------------------------------------|
| `list`            | `InputOption[] \| GroupedOption[]`    | Options array                        |
| `optionLabel`     | `string`                              | Display property                     |
| `optionValue`     | `string`                              | Value property                       |
| `optionDescription` | `string`                            | Description property                 |
| `onOptionChange`  | `(item?: InputOption \| InputOption[] \| GroupedOption) => void` | Selection callback |
| `selectedList`    | `InputOption[]`                       | Pre-selected items                   |
| `sortable`        | `boolean`                             | Enable drag & drop                   |
| `children`        | `ReactNode \| ((item: any, index: number) => ReactNode)` | Custom render function |

### File Input Configuration

| Property          | Type                              | Description                          |
|-------------------|-----------------------------------|--------------------------------------|
| `fileConfig`      | `object`                          | File input settings                  |

#### fileConfig Properties

| Property          | Type                              | Description                          |
|-------------------|-----------------------------------|--------------------------------------|
| `accept`          | `string`                          | Accepted file types                  |
| `multiple`        | `boolean`                         | Allow multiple files                 |
| `maxSize`         | `number`                          | Max file size (bytes)                |
| `previewSize`     | `number`                          | Preview size                         |
| `showPreview`     | `boolean`                         | Show file preview                    |

### Repeater Configuration

| Property              | Type                              | Description                          |
|-----------------------|-----------------------------------|--------------------------------------|
| `repeaterFields`      | `Array<FieldProps<RT> \| FieldProps<RT>[]>` | Nested fields for repeater |
| `minItems`            | `number`                          | Minimum items                        |
| `maxItems`            | `number`                          | Maximum items                        |
| `withAddBtn`          | `boolean`                         | Show add button                      |
| `isRemovebleOption`   | `boolean`                         | Allow item removal                   |
| `tabLabelField`       | `string`                          | Field to use as tab label (for REPEATER_TABS) |

### Number & Currency Configuration

| Property          | Type                              | Description                          |
|-------------------|-----------------------------------|--------------------------------------|
| `min`             | `number`                          | Minimum value                        |
| `max`             | `number`                          | Maximum value                        |
| `currencyFormat`  | `Intl.NumberFormatOptions`        | Currency formatting options          |
| `mask`            | `string \| RegExp`                | Input mask                           |

### Wizard Configuration

| Property          | Type                              | Description                          |
|-------------------|-----------------------------------|--------------------------------------|
| `step`            | `number`                          | Step number for wizard forms         |

---



## 📖 Usage Examples

### Conditional Fields with `showWhen`

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "continent",
    label: "Continent",
    inputType: InputTypes.SELECT,
    listConfig: {
      list: [
        { id: 1, value: "1", name: "Africa" },
        { id: 2, value: "2", name: "America" },
        { id: 3, value: "3", name: "Europe" },
      ],
      onOptionChange: () => {},
    },
    zodType: z.string(),
  },
  {
    name: "country",
    label: "Country",
    inputType: InputTypes.SELECT,
    listConfig: {
      list: [
        { id: 1, name: "Dominican Republic", value: "RD" },
        { id: 2, name: "Mexico", value: "MX" },
        { id: 3, name: "Colombia", value: "CO" },
      ],
      onOptionChange: () => {},
    },
    // Only show when America is selected
    showWhen: (values) => values.continent === "2",
    zodType: z.string().min(1),
  },
];
```

### Dynamic Options with `dependsOn` and `loadOptions`

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "category",
    label: "Category",
    inputType: InputTypes.SELECT,
    listConfig: {
      list: [
        { id: 1, name: "Electronics", value: "1" },
        { id: 2, name: "Clothing", value: "2" },
      ],
      onOptionChange: () => {},
    },
    zodType: z.string(),
  },
  {
    name: "product",
    label: "Product",
    inputType: InputTypes.SELECT,
    dependsOn: "category",
    loadOptions: async (categoryId) => {
      if (categoryId === "1") {
        return [
          { id: "1", name: "Laptop" },
          { id: "2", name: "Phone" },
        ];
      }
      if (categoryId === "2") {
        return [
          { id: "3", name: "Shirt" },
          { id: "4", name: "Pants" },
        ];
      }
      return [];
    },
    listConfig: { list: [], onOptionChange: () => {} },
    zodType: z.string(),
  },
];
```

### Repeater Fields (Dynamic Arrays)

```typescript
interface IContact {
  name: string;
  email: string;
}

const fields: FieldConfig<IUser> = [
  {
    name: "contacts",
    label: "Contacts",
    inputType: InputTypes.REPEATER,
    wrapInCard: true,
    repeaterFields: [
      { 
        name: "name", 
        label: "Name", 
        placeHolder: "e.g. John",
        zodType: z.string().min(1).max(50)
      },
      { 
        name: "email", 
        label: "Email", 
        placeHolder: "e.g. john@mail.com",
        zodType: z.string().email()
      },
    ],
    minItems: 1,
    maxItems: 5,
    zodType: z.array(
      z.object({
        name: z.string().min(1, "Name is required").max(50),
        email: z.string().email("Must be a valid email"),
      })
    ).min(1, "At least one contact is required").max(5, "Maximum 5 contacts"),
  },
];
```

### Repeater Tabs (Dynamic Tabs)

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "cycles",
    label: "Process Cycles",
    description: "Add or remove cycles with specific data",
    inputType: InputTypes.REPEATER_TABS,
    tabLabelField: "name", // Shows cycle name in tab
    repeaterFields: [
      [
        { name: "name", label: "Cycle Name", placeHolder: "e.g. Cycle 1" },
        { name: "duration", label: "Duration (days)", inputType: InputTypes.NUMBER }
      ],
      [
        { name: "description", label: "Description", placeHolder: "Optional details" }
      ]
    ],
    zodType: z.array(z.object({
      name: z.string(),
      duration: z.number().optional(),
      description: z.string().optional()
    }))
  },
];
```

### Key-Value Input

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "secretKeys",
    label: "Secret Keys",
    inputType: InputTypes.KEY_VALUE,
    wrapInCard: true,
    zodType: z.array(
      z.object({
        key: z.string()
          .min(1, "Key is required")
          .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers or hyphens"),
        value: z.string().min(1, "Value is required")
      })
    ).min(1, "At least one key-value pair is required")
  },
];
```

### String List (Tags)

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "tags",
    label: "Tags",
    wrapInCard: true,
    withDuplicatTag: false,
    inputType: InputTypes.STRING_LIST,
    isRemovebleOption: true,
    zodType: z.array(z.string().min(1)),
  },
];
```

### Sortable List (Drag & Drop)

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "ordenItems",
    label: "Sort Elements",
    description: "Drag to change order",
    inputType: InputTypes.SORTABLE_LIST,
    listConfig: {
      list: [
        { id: 1, name: "Element A" },
        { id: 2, name: "Element B" },
        { id: 3, name: "Element C" },
      ],
      onOptionChange: (newList) => console.log("New order:", newList),
      children: (item: any, index: number) => (
        <div className="flex items-center justify-between p-3 bg-blue-50 border rounded-md">
          <span>{index + 1}. {item.name}</span>
          <span className="text-xs text-gray-400">ID: {item.id}</span>
        </div>
      ),
    },
    zodType: z.array(z.object({ id: z.number(), name: z.string() })),
  },
];
```

### Multi Select

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "shoppingPreferences",
    label: "Shopping Preferences",
    inputType: InputTypes.MULTI_SELECT,
    listConfig: {
      list: [
        { id: 1, name: "Technology", value: "technology" },
        { id: 2, name: "Fashion", value: "fashion" },
        { id: 3, name: "Home", value: "home" },
        { id: 4, name: "Sports", value: "sports" },
      ],
      onOptionChange: (item) => console.log("Selected:", item),
    },
  },
];
```

### Button Group

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "gender",
    label: "Gender",
    inputType: InputTypes.BUTTON_GROUP,
    description: "Select your gender",
    listConfig: {
      list: [
        { id: 1, name: "Male", value: "male" },
        { id: 2, name: "Female", value: "female" },
        { id: 3, name: "Other", value: "other" },
      ],
      onOptionChange: (item) => {},
    },
    zodType: z.string().min(1, "You must select an option")
  },
];
```

### Currency Input

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "salary",
    label: "Salary",
    inputType: InputTypes.CURRENCY,
    inputGroupConfig: {
      autoValidIcons: true,
      iconsLeft: [Hash]
    },
    currencyFormat: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    zodType: z.number().min(100),
  },
];
```

### File Upload

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "profileImage",
    label: "Profile Image",
    inputType: InputTypes.FILE,
    fileConfig: {
      accept: "image/jpeg,image/png",
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10MB
      showPreview: true,
    },
    zodType: z
      .any()
      .refine(
        (file) => {
          if (!file) return true;
          return (
            file.size <= 10 * 1024 * 1024 &&
            ["image/jpeg", "image/png"].includes(file.type)
          );
        },
        { message: "Only JPG or PNG images under 10MB are allowed" }
      )
      .optional(),
  },
];
```

### Multi File Upload

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "documents",
    label: "Upload Documents",
    inputType: InputTypes.FILE_MULTI_UPLOAD,
    description: "You can upload multiple files at once",
    fileConfig: {
      accept: "application/pdf,image/*",
      multiple: true,
      maxSize: 5 * 1024 * 1024, // 5MB per file
    },
  },
];
```

### Accordion Grouped Switches

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: 'permissions',
    label: 'User Permissions',
    inputType: InputTypes.ACCORDION_GROUPED_SWITCH_LIST,
    listConfig: {
      selectedList: selectedPermissions,
      list: entitiesToGroupedOption(groups), 
      optionLabel: "name",
      optionValue: "id",
      onOptionChange: (item) => { 
        handleRolesChange(item as InputOption[])
      },
    }
  },
];
```

### Wizard Form (Multi-Step)

```typescript
import { WizardForm, DynamicForm, FieldConfig } from 'shadcn-zod-formkit';

const userFields: FieldConfig<IUser>[] = [
  // Step 1
  [
    {
      step: 1,
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT_GROUP,
      zodType: z.string().min(3).max(20),
    },
    {
      step: 1,
      name: "email",
      label: "Email",
      inputType: InputTypes.TEXT_GROUP,
      zodType: z.string().email(),
    },
  ],
  // Step 2
  [
    {
      step: 2,
      name: "age",
      label: "Age",
      inputType: InputTypes.NUMBER,
      zodType: z.coerce.number().min(18).max(99),
    },
  ],
  // Step 3
  [
    {
      step: 3,
      name: "favoriteColor",
      label: "Favorite Color",
      inputType: InputTypes.COLOR,
      zodType: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
    },
  ],
];

export default function ExampleWizardForm() {
  return (
    <WizardForm<IUser> fields={userFields} record={record}>
      {({ stepFields, currentStep, setCurrentStep, totalSteps }) => {
        const isTheEnd = currentStep === totalSteps;
        const btnLabel = isTheEnd ? 'Save' : 'Next';
        
        return (
          <DynamicForm<IUser>
            record={record}
            formTitle={`Wizard Form - Step ${currentStep}`}
            withCard
            currentStep={currentStep}
            totalSteps={totalSteps}
            submitBtnLabel={btnLabel}
            fields={stepFields}
            isWrapInWizard={true}
            onSubmit={({ data }) => {
              setCurrentStep((prev) => prev + (isTheEnd ? 0 : 1));
              if (isTheEnd) {
                console.log("✅ Final result:", data);
              }
            }}
          />
        );
      }}
    </WizardForm>
  );
}
```

### Field Layout (Rows and Columns)

```typescript
// Fields in the same array will be displayed in the same row
const fields: FieldConfig<IUser> = [
  // Single field (full width)
  {
    name: "username",
    label: "Username",
    inputType: InputTypes.TEXT_GROUP,
    zodType: z.string(),
  },
  // Two fields in the same row
  [
    {
      name: "firstName",
      label: "First Name",
      inputType: InputTypes.TEXT_GROUP,
      zodType: z.string(),
    },
    {
      name: "lastName",
      label: "Last Name",
      inputType: InputTypes.TEXT_GROUP,
      zodType: z.string(),
    },
  ],
  // Nested arrays for complex layouts
  [
    [
      {
        name: "city",
        label: "City",
        inputType: InputTypes.TEXT_GROUP,
        direction: 'col', // Force column direction
        zodType: z.string(),
      }
    ],
    [
      {
        name: "state",
        label: "State",
        inputType: InputTypes.TEXT_GROUP,
        zodType: z.string(),
      },
      {
        name: "zip",
        label: "ZIP Code",
        inputType: InputTypes.TEXT_GROUP,
        zodType: z.string(),
      }
    ],
  ],
];
```

### Custom Validation

```typescript
<DynamicForm<IUser>
  fields={fields}
  record={record}
  extraValidations={[
    (schema) =>
      schema.refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
      }),
  ]}
  onSubmit={({ data }) => console.log(data)}
/>
```

### Custom Buttons

```typescript
<DynamicForm<IUser>
  fields={fields}
  record={record}
  listBtnConfig={[
    {
      variant: 'outline',
      label: 'Cancel',
      btnType: 'button',
      onClick: () => router.back()
    },
    {
      variant: 'secondary',
      label: 'Save Draft',
      btnType: 'button',
      onClick: () => saveDraft()
    }
  ]}
  onSubmit={({ data }) => console.log(data)}
/>
```

---

## ✨ New Input Types

### Email Input with Suggestions

The EMAIL input provides RFC 5322 validation, domain suggestions, and typo detection:

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "email",
    label: "Email Address",
    inputType: InputTypes.EMAIL,
    placeHolder: "Enter your email",
    description: "We'll suggest common domains as you type",
    showSuggestions: true, // Enable domain suggestions
    clearable: true, // Show clear button
    showValidIcon: true, // Show checkmark when valid
    zodType: z.string().email("Invalid email address"),
  },
];
```

**Features:**
- ✅ RFC 5322 email validation
- 🎯 Domain suggestions (@gmail.com, @outlook.com, etc.)
- 🔍 Typo detection (gmial.com → gmail.com)
- ⌨️ Keyboard navigation for suggestions
- ✓ Visual validation icons
- 🗑️ Clearable button

### Search Input with History

The SEARCH input provides fuzzy search, history tracking, and debounced input:

```typescript
const fields: FieldConfig<IUser> = [
  {
    name: "searchQuery",
    label: "Search Products",
    inputType: InputTypes.SEARCH,
    placeHolder: "Search...",
    description: "Search with fuzzy matching",
    debounce: 300, // Debounce delay in ms
    maxLength: 100,
    showCharCount: true,
    zodType: z.string().optional(),
  },
];
```

**Features:**
- 🔍 Fuzzy search matching
- 📝 Search history (localStorage)
- ⏱️ Debounced input
- ⌨️ Keyboard navigation
- 🎯 Highlighted matches
- 🗑️ Clear history option

### Location Picker with Interactive Map

The LOCATION_PICKER input provides an interactive map with OpenStreetMap and Leaflet:

```typescript
interface ILocationForm {
  businessLocation: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    formattedAddress?: string;
  };
}

const fields: FieldConfig<ILocationForm> = [
  {
    name: "businessLocation",
    label: "Business Location",
    inputType: InputTypes.LOCATION_PICKER,
    description: "Click on the map or search for an address",
    required: true,
    defaultZoom: 15, // Initial zoom level
    showSearch: true, // Show address search bar
    showCurrentLocation: true, // Show GPS button
    showCoordinates: true, // Show lat/lng display
    height: 400, // Map height in pixels
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
];
```

**Features:**
- 🗺️ Interactive map with OpenStreetMap (free, no API key)
- 📍 Click to mark location
- 🔍 Address search (geocoding with Nominatim)
- 🔄 Reverse geocoding (coordinates → address)
- 📱 GPS location detection
- 🎯 Draggable marker
- 📋 Copy coordinates to clipboard
- ⚙️ Configurable zoom, height, and features
- ✅ Required/optional support (hides "Clear" button when required)

**Installation for Location Picker:**

```bash
npm install leaflet react-leaflet @types/leaflet
```

Add Leaflet CSS to your global CSS:

```css
@import 'leaflet/dist/leaflet.css';
```

---

## 🔧 Helper Functions

### entitiesToInputOption

Convert an array of entities to InputOption format:

```typescript
import { entitiesToInputOption } from 'shadcn-zod-formkit';

const users = [
  { id: 1, username: "john", email: "john@example.com" },
  { id: 2, username: "jane", email: "jane@example.com" },
];

const options = entitiesToInputOption(users, 'username', 'users', 'email');
// Result: [
//   { id: 1, name: "john", description: "john@example.com", groupedLabel: "users" },
//   { id: 2, name: "jane", description: "jane@example.com", groupedLabel: "users" }
// ]
```

### entitiesToGroupedOption

Convert grouped entities to GroupedOption format:

```typescript
import { entitiesToGroupedOption } from 'shadcn-zod-formkit';

const groups = [
  {
    id: 1,
    label: "Administrators",
    options: [...],
    selectedOptions: []
  },
  {
    id: 2,
    label: "Users",
    options: [...],
    selectedOptions: []
  }
];

const groupedOptions = entitiesToGroupedOption(groups);
```

---


## 🎨 TypeScript Support

This library is fully typed with TypeScript. Define your form data interface for complete type safety:

```typescript
interface IUserForm {
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  favoriteColor: string;
  tags: string[];
  contacts: Array<{
    name: string;
    email: string;
  }>;
}

// Full type safety throughout
const fields: FieldConfig<IUserForm> = [
  {
    name: "username", // ✅ Autocomplete and type checking
    label: "Username",
    inputType: InputTypes.TEXT_GROUP,
    zodType: z.string(),
  },
  // ... more fields
];

<DynamicForm<IUserForm>
  fields={fields}
  record={initialData}
  onSubmit={({ data }) => {
    // data is fully typed as IUserForm
    console.log(data.username); // ✅ Type safe
  }}
/>
```

---

## ✅ Features

- ✨ Fully dynamic fields array support
- 🎯 28+ input types including:
  - 📧 **EMAIL** - Smart email input with domain suggestions and typo detection
  - 🔍 **SEARCH** - Search with history, fuzzy matching, and debounce
  - 📍 **LOCATION_PICKER** - Interactive map with GPS, geocoding, and OpenStreetMap
  - Plus: text, number, color, date, select, switch, file, OTP, and more
- 🔒 Zod validation integration for robust form validation
- 📝 TypeScript support with full type safety
- 🎨 Built on Shadcn UI components
- 🔄 Conditional fields with `showWhen`
- 🔗 Dynamic options with `dependsOn` and `loadOptions`
- 📋 Repeater fields for dynamic arrays
- 🧙‍♂️ Multi-step wizard forms
- 🎨 Flexible layouts (rows, columns, nested)
- 🔧 Custom validation and buttons
- 📱 Responsive and accessible
- 🎯 Works seamlessly with React 19+ and Next.js

---

## 💡 Tips

- Use `FieldConfig<T>` with TypeScript interfaces for full type safety
- Wrap your forms inside a `"use client"` component if using Next.js App Router
- Combine multiple FieldProps in arrays for grouped fields in the same row
- Use `showWhen` for conditional rendering instead of manually hiding fields
- Use `dependsOn` and `loadOptions` for cascading selects
- Set `wrapInCard={true}` on individual fields to visually group them
- Use `extraValidations` for cross-field validation (e.g., password confirmation)
- The `record` prop sets initial values - perfect for edit forms
- Use `onAnyFieldChange` to react to any field change in real-time
- For wizard forms, use the `WizardForm` wrapper component with `step` property on fields

---

## 📦 Peer Dependencies

```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "zod": "^4.1.12"
}
```

### Optional Dependencies

For the LOCATION_PICKER input:

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🔗 Links

- [GitHub Repository](https://github.com/NativoLink/shadcn-zod-formkit)
- [NPM Package](https://www.npmjs.com/package/shadcn-zod-formkit)
- [Report Issues](https://github.com/NativoLink/shadcn-zod-formkit/issues)

---

## 🧠 Acknowledgements

- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [Next.js](https://nextjs.org/) - The React framework for production
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation
- [React Hook Form](https://react-hook-form.com/) - Performant, flexible forms
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

Made with ❤️ by [Luis A. Rosario](https://github.com/NativoLink)
