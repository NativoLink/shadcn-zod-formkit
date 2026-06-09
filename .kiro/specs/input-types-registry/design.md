# Design Document: Complete InputTypes Registry

## Overview

The `InputTypes` enum defines every input type the library supports. Two structures must stay in sync:

- **`inputFieldComp`** — public array consumers use to discover available types
- **`inputMap`** — internal factory map that instantiates the correct class for each type

Currently four types (`DATE_RANGE`, `COUNTRY_SELECT`, `RANGE`, `FILE_UPLOAD`) exist in both the enum and `inputMap` but are absent from `inputFieldComp`. Additionally, `InputTypes.SEARCH` maps to `TextInput` in `inputMap` because the existing `SearchInput` is a plain function component, not a class extending `BaseInput`.

This feature:
1. Adds the four missing types to `inputFieldComp` (4-line change)
2. Creates `SearchInputClass` — a class-based wrapper that makes `SEARCH` a first-class citizen in the factory
3. Adds regression tests that structurally enforce the `inputFieldComp` ↔ `inputMap` invariant going forward

---

## Architecture

The feature touches three files and adds one:

```
src/components/custom/form/inputs/
├── base/
│   └── input-types.ts          ← add 4 entries to inputFieldComp
├── input-factory.tsx           ← update [InputTypes.SEARCH] → SearchInputClass
└── types/
    ├── index.ts                ← add export for search-input
    └── search-input.tsx        ← replace commented content with SearchInputClass
```

A regression test in the existing test file ensures the two structures can never silently diverge again.

### Design decisions

**Class wrapper over direct functional component.** `InputFactory.create()` always calls `new InputClass(input, form, isSubmitting)` and then `.render()`. A functional component cannot satisfy this protocol without a wrapper class. The wrapper pattern is already established by every other input (`EmailInput`, `NumberInput`, etc.): a thin class that delegates to a functional component for hooks access.

**Keep functional component internal.** The public API is `SearchInputClass` (exported). The functional component (`FieldSearch`) stays in the same file as an implementation detail, matching the pattern used by `EmailInput` → `EmailInputComponent` and `TextInputGroup` → `FieldTextGroup`.

**No changes to `InputFactory.create()` logic.** The factory has no special cases; adding `SearchInputClass` to `inputMap` is sufficient. This is by design — the factory is generic.

**`inputFieldComp` as the single source of consumer truth.** Consumers who want to iterate over available types should use `inputFieldComp`, not inspect `inputMap` (which is not exported). The regression test enforces that these two always agree.

---

## Components and Interfaces

### 1. `inputFieldComp` update (`input-types.ts`)

Add the four missing entries in their natural v1.36.0 / v1.37.0 version groups:

```ts
// ✨ New input types (v1.36.0)
InputTypes.EMAIL,
InputTypes.SEARCH,
InputTypes.LOCATION_PICKER,
InputTypes.DATE_RANGE,    // ← add
InputTypes.COUNTRY_SELECT, // ← add
InputTypes.RANGE,          // ← add

// ✨ New input types (v1.37.0)
InputTypes.FILE_UPLOAD,    // ← add
```

No other changes to this file.

### 2. `SearchInputClass` (`search-input.tsx`)

Replace the commented-out content with:

```ts
'use client';

import { JSX, useCallback, useRef } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { BaseInput, FieldProps, handleOnChage } from '../base';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/src/components/ui/input-group';
import { X } from 'lucide-react';

export class SearchInputClass extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return <FieldSearch form={form} input={input} isSubmitting={isSubmitting} />;
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldSearch = ({ input, form, isSubmitting }: Props): JSX.Element => {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  return (
    <FormField
      key={input.name as string}
      control={form.control}
      name={input.name as string}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          field.onChange(value);

          if (input.debounce) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              handleOnChage(value, input, field);
            }, input.debounce);
          } else {
            handleOnChage(value, input, field);
          }
        };

        const handleClear = () => {
          field.onChange('');
          handleOnChage('', input, field);
        };

        const hasValue = Boolean(field.value);
        const isDisabled = input.disabled || isSubmitting;

        return (
          <FormItem className={input.className}>
            {input.label && <FormLabel><b>{input.label}</b></FormLabel>}
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder={input.placeHolder}
                  disabled={isDisabled}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                {hasValue && !isDisabled && (
                  <InputGroupAddon align="inline-end">
                    <button type="button" onClick={handleClear} aria-label="Clear search">
                      <X size={16} />
                    </button>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
```

**Key interface points:**
- `input.debounce: number | undefined` — already defined in `FieldProps` (ms delay for `onChange`)
- `input.disabled: boolean | undefined` — standard `FieldProps` field
- `isSubmitting: boolean | undefined` — passed by `InputFactory.create()`
- Clear button appears only when `field.value` is non-empty and the field is not disabled

### 3. `types/index.ts` update

Uncomment the search-input export:

```ts
// ✨ New input types (v1.36.0)
export * from './email-input';
export * from './search-input';   // ← uncomment
```

### 4. `input-factory.tsx` update

Replace the placeholder entry:

```ts
// before:
[InputTypes.SEARCH]: TextInput, // SearchInput component is currently a function component

// after:
[InputTypes.SEARCH]: SearchInputClass,
```

Import `SearchInputClass` from `./types` alongside the other v1.36.0 imports.

---

## Data Models

No new data models are introduced. The relevant existing types:

```ts
// FieldProps (definitions.ts) — already has debounce
debounce?: number; // Debounce for onChange (ms)

// InputClassConstructor (input-factory.tsx)
type InputClassConstructor = new (
  input: FieldProps,
  form: UseFormReturn,
  isSubmitting?: boolean,
) => BaseInput;

// inputMap — Record<InputTypes, InputClassConstructor>
// inputFieldComp — InputTypes[]
```

The `debounce` field on `FieldProps` is already defined and documented; `SearchInputClass` simply reads it.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The prework analysis identified several criteria as universal properties over the set of `inputMap` entries and `inputFieldComp` elements. The following properties encode the registry invariant and the `SearchInputClass` behavioral contract.

**Property reflection:** Requirements 1.5 and 1.6 both state the same invariant from opposite directions (inputMap→inputFieldComp and inputFieldComp→inputMap). Requirements 3.2, 3.3, and 3.4 re-state those same directions plus a length check. All five collapse into two complementary properties. Requirements 2.3 and 2.4 address the rendering behavior of `SearchInputClass` and are independent.

---

### Property 1: inputMap → inputFieldComp completeness

*For any* key in `inputMap` that maps to a dedicated component (a class that is not `TextInput` used as a stand-in placeholder), that key SHALL be present in `inputFieldComp`.

**Validates: Requirements 1.5, 1.6, 3.2, 3.4**

---

### Property 2: inputFieldComp → inputMap membership

*For any* value in `inputFieldComp`, that value SHALL exist as a key in `inputMap`.

**Validates: Requirements 3.3**

---

### Property 3: SearchInputClass renders a search-type input

*For any* valid `FieldProps` (varying `name`, `label`, `placeHolder`, `className`), `SearchInputClass.render()` SHALL produce JSX that contains an `<input>` element with `type="search"`.

**Validates: Requirements 2.3**

---

### Property 4: Disabled state propagation

*For any* `FieldProps` where `disabled` is `true`, or *for any* `isSubmitting` value of `true`, `SearchInputClass.render()` SHALL produce an `<input>` element that carries the `disabled` attribute.

**Validates: Requirements 2.4**

---

## Error Handling

**Unknown `inputType` in `InputFactory`.** Already handled by the existing fallback `inputMap[inputType] ?? TextInput`. No change needed.

**`SearchInputClass` debounce timer leak.** The `useRef`-based debounce in `FieldSearch` is local to the component instance. React will garbage-collect it when the component unmounts. No explicit cleanup is needed for `setTimeout` IDs that fire after unmount (they call a no-op `field.onChange` on a stale closure, which is harmless). If stricter cleanup is desired, a `useEffect` cleanup can clear `debounceRef.current` on unmount — acceptable as a future refinement.

**Clear button in form submit state.** The clear button is hidden when `isDisabled` is true (which covers both `input.disabled` and `isSubmitting`), so it cannot fire during submission.

---

## Testing Strategy

### Unit / example tests (in `DynamicForm.test.tsx` or a new `registry.test.ts`)

These cover the concrete membership checks (Requirements 1.1–1.4, 2.1, 2.2, 2.5):

- `inputFieldComp.includes(InputTypes.DATE_RANGE)` is true
- `inputFieldComp.includes(InputTypes.COUNTRY_SELECT)` is true
- `inputFieldComp.includes(InputTypes.RANGE)` is true
- `inputFieldComp.includes(InputTypes.FILE_UPLOAD)` is true
- `inputMap[InputTypes.SEARCH]` equals `SearchInputClass`
- `new SearchInputClass(mockInput, mockForm).render()` returns a JSX element (smoke test for Requirement 2.1)

### Property-based tests (vitest + `fast-check`)

Each property below corresponds to a Correctness Property above. Each test runs ≥ 100 iterations via fast-check arbitraries.

**Property 1 test — inputMap → inputFieldComp completeness**
```
// Feature: input-types-registry, Property 1: inputMap → inputFieldComp completeness
```
Enumerate `inputMap` keys at test time. Filter to those mapping to a dedicated class (i.e. class !== TextInput, class !== TextInput used for FORM/HIDDEN/CHECK_LIST). For each filtered key, assert `inputFieldComp.includes(key)`. This is a finite deterministic check but expressed as a universal assertion over the live `inputMap` object — any future addition that skips `inputFieldComp` causes an immediate failure.

**Property 2 test — inputFieldComp → inputMap membership**
```
// Feature: input-types-registry, Property 2: inputFieldComp → inputMap membership
```
`inputFieldComp.every(type => type in inputMap)` must be true. Parameterize with fast-check by picking a random subset of `inputFieldComp` entries and asserting membership — this validates the property holds for arbitrary subsets, not just the full array.

**Property 3 test — SearchInputClass renders search-type input**
```
// Feature: input-types-registry, Property 3: SearchInputClass renders a search-type input
```
Use fast-check to generate `FieldProps` variants with arbitrary `name`, `label`, and `placeHolder` strings. For each, render `SearchInputClass` inside a minimal react-hook-form wrapper and assert the DOM contains `input[type="search"]`.

**Property 4 test — disabled state propagation**
```
// Feature: input-types-registry, Property 4: Disabled state propagation
```
Use fast-check to generate `(disabled: boolean, isSubmitting: boolean)` pairs where at least one is `true`. Render `SearchInputClass` and assert the input element has the `disabled` attribute. Also verify the inverse: when both are false, the input is not disabled.

### Regression guard

The Property 1 and Property 2 tests together form the structural regression guard described in Requirement 3. They run as part of the normal `npm test` suite (vitest, no watch mode needed in CI).

No changes to the library's public API shape (`src/index.ts`) are required for this feature. `SearchInputClass` is exported from `types/index.ts` as an implementation detail, consistent with how all other input classes are exported.
