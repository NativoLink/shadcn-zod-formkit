# Improvements and New Features

This document tracks the new features and improvements added to shadcn-zod-formkit.

## Version 1.35.0 - New Features

### 🎨 New Input Types

#### 1. Rating Input (`InputTypes.RATING`)
Star rating component with customizable options.

```typescript
{
  name: "rating",
  label: "Rate this product",
  inputType: InputTypes.RATING,
  max: 5,
  showValue: true,
  zodType: z.number().min(1).max(5),
}
```

**Props:**
- `max`: Maximum number of stars (default: 5)
- `size`: 'sm' | 'md' | 'lg'
- `allowHalf`: Allow half-star ratings
- `showValue`: Display numeric value

#### 2. Phone Input (`InputTypes.PHONE`)
International phone number input with country code selector.

```typescript
{
  name: "phone",
  label: "Phone Number",
  inputType: InputTypes.PHONE,
  defaultCountryCode: "+1",
  zodType: z.string().min(10),
}
```

**Features:**
- Country code dropdown with flags
- Automatic formatting
- International support

#### 3. URL Input (`InputTypes.URL`)
URL input with validation and preview button.

```typescript
{
  name: "website",
  label: "Website",
  inputType: InputTypes.URL,
  showPreview: true,
  autoProtocol: true,
  zodType: z.string().url(),
}
```

**Features:**
- Auto-add https:// protocol
- Open URL in new tab button
- URL validation

#### 4. Password Input (`InputTypes.PASSWORD`)
Enhanced password input with strength indicator.

```typescript
{
  name: "password",
  label: "Password",
  inputType: InputTypes.PASSWORD,
  showStrength: true,
  showRequirements: true,
  zodType: strongPasswordValidation,
}
```

**Features:**
- Show/hide password toggle
- Password strength meter
- Requirements checklist
- Visual feedback

#### 5. Autocomplete Input (`InputTypes.AUTOCOMPLETE`)
Searchable input with async options loading.

```typescript
{
  name: "city",
  label: "City",
  inputType: InputTypes.AUTOCOMPLETE,
  onSearch: async (query) => {
    const results = await fetchCities(query);
    return results;
  },
  debounceMs: 300,
  minChars: 2,
  zodType: z.string(),
}
```

**Features:**
- Async search
- Debounced queries
- Minimum character threshold
- Loading state

---

### 🎣 New Custom Hooks

#### 1. `useDynamicForm`
Simplified hook for form management.

```typescript
import { useDynamicForm } from 'shadcn-zod-formkit';

const { form, handleSubmit, reset } = useDynamicForm({
  fields: myFields,
  record: initialData,
});

const onSubmit = handleSubmit((data) => {
  console.log(data);
});
```

#### 2. `useFormPersist`
Auto-save form data to localStorage/sessionStorage.

```typescript
import { useFormPersist } from 'shadcn-zod-formkit';

useFormPersist({
  form,
  storageKey: 'my-form-data',
  debounceMs: 500,
  exclude: ['password'], // Don't persist sensitive fields
});
```

**Features:**
- Auto-save on change
- Restore on mount
- Exclude sensitive fields
- Configurable storage (localStorage/sessionStorage)

---

### 🎨 Enhanced Field Props

New optional properties added to `FieldProps`:

#### UX Improvements
```typescript
{
  // Help and documentation
  helpText: "Additional help text",
  helpLink: "https://docs.example.com",
  
  // Visual enhancements
  prefix: "$",
  suffix: "USD",
  loading: true,
  skeleton: true,
  
  // Input behavior
  debounce: 300,
  maxLength: 100,
  showCharCount: true,
  copyable: true,
  clearable: true,
  
  // Validation
  validateOnBlur: true,
  validateOnChange: true,
  showValidIcon: true,
  asyncValidation: async (value) => {
    const isValid = await checkUsername(value);
    return isValid ? true : "Username already taken";
  },
  debounceValidation: 500,
  
  // Accessibility
  ariaLabel: "Username input",
  ariaDescribedBy: "username-help",
  ariaRequired: true,
}
```

---

### 🛠️ Validation Utilities

New validation helpers in `validation-utils.ts`:

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
} from 'shadcn-zod-formkit';

// Usage
{
  name: "email",
  zodType: emailValidation,
}

{
  name: "password",
  zodType: strongPasswordValidation,
}
```

---

### 🎨 Theme Configuration

New theme system for customizing form appearance:

```typescript
import { FormTheme } from 'shadcn-zod-formkit';

const customTheme: FormTheme = {
  colors: {
    primary: '#3b82f6',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  spacing: 'comfortable',
  borderRadius: 'lg',
  labelPosition: 'top',
  fontSize: 'base',
};
```

**Options:**
- `spacing`: 'compact' | 'normal' | 'comfortable'
- `borderRadius`: 'none' | 'sm' | 'md' | 'lg' | 'full'
- `labelPosition`: 'top' | 'left' | 'floating'
- `fontSize`: 'sm' | 'base' | 'lg'

---

## Migration Guide

### From v1.34.0 to v1.35.0

All existing code remains compatible. New features are opt-in.

#### Using New Input Types

```typescript
// Before (using TEXT_GROUP for password)
{
  name: "password",
  inputType: InputTypes.TEXT_GROUP,
  keyboardType: TextInputType.PASSWORD,
}

// After (using new PASSWORD type)
{
  name: "password",
  inputType: InputTypes.PASSWORD,
  showStrength: true,
  showRequirements: true,
}
```

#### Using New Hooks

```typescript
// Before
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: initialValues,
});

// After (simplified)
const { form, handleSubmit } = useDynamicForm({
  fields: myFields,
  record: initialData,
});
```

---

## Breaking Changes

None. All changes are backward compatible.

---

## Future Roadmap

### Planned Features

1. **Rich Text Editor** (`InputTypes.RICH_TEXT`)
   - WYSIWYG editor with TipTap
   - Markdown support
   - Image upload

2. **Code Editor** (`InputTypes.CODE_EDITOR`)
   - Syntax highlighting
   - Multiple languages
   - Monaco editor integration

3. **Image Crop** (`InputTypes.IMAGE_CROP`)
   - Crop and resize images
   - Aspect ratio control
   - Preview

4. **Signature** (`InputTypes.SIGNATURE`)
   - Digital signature pad
   - Export as image

5. **Location Picker** (`InputTypes.LOCATION`)
   - Google Maps integration
   - Address autocomplete
   - Coordinates

6. **Tree Select** (`InputTypes.TREE_SELECT`)
   - Hierarchical selection
   - Expandable nodes

7. **Transfer List** (`InputTypes.TRANSFER`)
   - Move items between lists
   - Bulk operations

8. **Mention Input** (`InputTypes.MENTION`)
   - @mentions like Twitter
   - User suggestions

### Planned Improvements

- [ ] Visual form builder (drag & drop)
- [ ] DevTools Chrome extension
- [ ] Storybook documentation
- [ ] More validation presets
- [ ] Performance optimizations
- [ ] Accessibility audit
- [ ] i18n support
- [ ] Form templates/presets

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Feedback

Have suggestions or found a bug? Please [open an issue](https://github.com/NativoLink/shadcn-zod-formkit/issues).
