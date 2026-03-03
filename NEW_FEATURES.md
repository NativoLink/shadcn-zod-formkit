# 🎉 New Features in v1.35.0

## Quick Start with New Features

### 1. Rating Input ⭐

Perfect for reviews, feedback, and ratings.

```typescript
{
  name: "rating",
  label: "Rate this product",
  inputType: InputTypes.RATING,
  max: 5,
  size: 'md',
  showValue: true,
  zodType: z.number().min(1).max(5),
}
```

### 2. Phone Input 📱

International phone number with country code selector.

```typescript
{
  name: "phone",
  label: "Phone Number",
  inputType: InputTypes.PHONE,
  defaultCountryCode: "+1",
  zodType: phoneValidation, // from 'shadcn-zod-formkit/validation'
}
```

### 3. URL Input 🔗

URL input with auto-protocol and preview button.

```typescript
{
  name: "website",
  label: "Website",
  inputType: InputTypes.URL,
  showPreview: true,
  autoProtocol: true,
  zodType: urlValidation, // from 'shadcn-zod-formkit/validation'
}
```

### 4. Password Input 🔒

Enhanced password with strength meter and requirements.

```typescript
{
  name: "password",
  label: "Password",
  inputType: InputTypes.PASSWORD,
  showStrength: true,
  showRequirements: true,
  zodType: strongPasswordValidation, // from 'shadcn-zod-formkit/validation'
}
```

### 5. Autocomplete Input 🔍

Searchable input with async loading.

```typescript
{
  name: "city",
  label: "City",
  inputType: InputTypes.AUTOCOMPLETE,
  onSearch: async (query) => {
    const results = await fetchCities(query);
    return results.map(city => ({
      value: city.id,
      label: city.name,
      description: city.country
    }));
  },
  debounceMs: 300,
  minChars: 2,
  zodType: z.string(),
}
```

---

## New Custom Hooks 🎣

### useDynamicForm

Simplified form management.

```typescript
import { useDynamicForm } from 'shadcn-zod-formkit';

const { form, handleSubmit, reset, watch, setValue } = useDynamicForm({
  fields: myFields,
  record: initialData,
  extraValidations: [
    (schema) => schema.refine(/* custom validation */)
  ],
});

const onSubmit = handleSubmit((data) => {
  console.log(data);
});
```

### useFormPersist

Auto-save form data to storage.

```typescript
import { useFormPersist } from 'shadcn-zod-formkit';

useFormPersist({
  form,
  storageKey: 'my-form',
  debounceMs: 500,
  exclude: ['password', 'creditCard'], // Don't persist sensitive data
  storage: localStorage, // or sessionStorage
  onRestore: (data) => {
    console.log('Form data restored:', data);
  },
});
```

---

## Enhanced Field Props ✨

### New UX Features

```typescript
{
  name: "email",
  label: "Email",
  inputType: InputTypes.TEXT_GROUP,
  
  // Help and documentation
  helpText: "We'll never share your email",
  helpLink: "https://example.com/privacy",
  
  // Visual enhancements
  prefix: "📧",
  suffix: "@company.com",
  
  // Loading states
  loading: isLoading,
  skeleton: true,
  
  // Input behavior
  debounce: 300,
  maxLength: 100,
  showCharCount: true,
  copyable: true,
  clearable: true,
  
  // Validation
  validateOnBlur: true,
  validateOnChange: false,
  showValidIcon: true,
  
  // Async validation
  asyncValidation: async (value) => {
    const exists = await checkEmailExists(value);
    return exists ? "Email already registered" : true;
  },
  debounceValidation: 500,
  
  // Accessibility
  ariaLabel: "Email address",
  ariaDescribedBy: "email-help",
  ariaRequired: true,
}
```

---

## Validation Utilities 🛡️

Pre-built validation schemas.

```typescript
import {
  phoneValidation,
  urlValidation,
  strongPasswordValidation,
  emailValidation,
  creditCardValidation,
  usernameValidation,
  hexColorValidation,
  ipAddressValidation,
  slugValidation,
  fileSizeValidation,
  fileTypeValidation,
} from 'shadcn-zod-formkit/validation';

// Usage in fields
{
  name: "email",
  zodType: emailValidation,
}

{
  name: "password",
  zodType: strongPasswordValidation,
}

{
  name: "username",
  zodType: usernameValidation,
}
```

### Custom Async Validation

```typescript
import { createAsyncValidation } from 'shadcn-zod-formkit/validation';

const uniqueEmailValidation = createAsyncValidation(
  async (email) => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const { available } = await response.json();
    return available;
  },
  "Email is already registered"
);
```

---

## Theme Configuration 🎨

Customize form appearance.

```typescript
import { FormTheme } from 'shadcn-zod-formkit/theme';

const customTheme: FormTheme = {
  colors: {
    primary: '#3b82f6',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  spacing: 'comfortable', // 'compact' | 'normal' | 'comfortable'
  borderRadius: 'lg', // 'none' | 'sm' | 'md' | 'lg' | 'full'
  labelPosition: 'top', // 'top' | 'left' | 'floating'
  fontSize: 'base', // 'sm' | 'base' | 'lg'
};

// Apply to form (coming soon)
<DynamicForm theme={customTheme} {...props} />
```

---

## Complete Example

```typescript
'use client'

import { useState } from 'react';
import { 
  DynamicForm,
  InputTypes,
  FieldConfig,
  useDynamicForm,
  useFormPersist,
} from 'shadcn-zod-formkit';
import { 
  strongPasswordValidation, 
  phoneValidation, 
  urlValidation,
  emailValidation,
} from 'shadcn-zod-formkit/validation';
import { z } from 'zod';

interface IUserProfile {
  username: string;
  email: string;
  phone: string;
  website: string;
  password: string;
  rating: number;
  city: string;
}

export default function UserProfileForm() {
  const fields: FieldConfig<IUserProfile> = [
    {
      name: "username",
      label: "Username",
      inputType: InputTypes.TEXT_GROUP,
      maxLength: 20,
      showCharCount: true,
      clearable: true,
      asyncValidation: async (value) => {
        const available = await checkUsername(value);
        return available ? true : "Username taken";
      },
      debounceValidation: 500,
      zodType: z.string().min(3).max(20),
    },
    {
      name: "email",
      label: "Email",
      inputType: InputTypes.TEXT_GROUP,
      copyable: true,
      zodType: emailValidation,
    },
    {
      name: "phone",
      label: "Phone",
      inputType: InputTypes.PHONE,
      zodType: phoneValidation,
    },
    {
      name: "website",
      label: "Website",
      inputType: InputTypes.URL,
      showPreview: true,
      zodType: urlValidation,
    },
    {
      name: "password",
      label: "Password",
      inputType: InputTypes.PASSWORD,
      showStrength: true,
      showRequirements: true,
      zodType: strongPasswordValidation,
    },
    {
      name: "rating",
      label: "Rate Us",
      inputType: InputTypes.RATING,
      showValue: true,
      zodType: z.number().min(1).max(5),
    },
    {
      name: "city",
      label: "City",
      inputType: InputTypes.AUTOCOMPLETE,
      onSearch: searchCities,
      zodType: z.string(),
    },
  ];

  const { form, handleSubmit } = useDynamicForm({
    fields,
    record: initialData,
  });

  useFormPersist({
    form,
    storageKey: 'user-profile',
    exclude: ['password'],
  });

  return (
    <DynamicForm
      formTitle="User Profile"
      withCard
      fields={fields}
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    />
  );
}
```

---

## Migration from v1.34.0

All existing code works without changes. New features are opt-in.

### Before
```typescript
{
  name: "password",
  inputType: InputTypes.TEXT_GROUP,
  keyboardType: TextInputType.PASSWORD,
}
```

### After
```typescript
{
  name: "password",
  inputType: InputTypes.PASSWORD,
  showStrength: true,
  showRequirements: true,
}
```

---

## What's Next?

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for the full roadmap including:
- Rich text editor
- Code editor
- Image crop
- Location picker
- And more!

---

## Feedback

Love these features? Have suggestions? [Open an issue](https://github.com/NativoLink/shadcn-zod-formkit/issues)!
