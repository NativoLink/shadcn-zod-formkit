# Implementation Plan: Complete InputTypes Registry

## Overview

This plan delivers four discrete changes: add four missing types to `inputFieldComp`, implement `SearchInputClass` as a proper `BaseInput` subclass, wire up the barrel export and factory entry, then add regression tests that enforce the `inputFieldComp` ↔ `inputMap` invariant going forward.

## Tasks

- [x] 1. Add missing types to `inputFieldComp`
  - Open `src/components/custom/form/inputs/base/input-types.ts`
  - Append `InputTypes.DATE_RANGE`, `InputTypes.COUNTRY_SELECT`, and `InputTypes.RANGE` inside the existing v1.36.0 comment block
  - Append `InputTypes.FILE_UPLOAD` inside the existing v1.37.0 comment block
  - Do not change any other line in the file
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement `SearchInputClass` in `search-input.tsx`
  - [x] 2.1 Replace commented content with `SearchInputClass` and `FieldSearch`
    - Delete all commented-out lines in `src/components/custom/form/inputs/types/search-input.tsx`
    - Add `'use client'` directive
    - Import `JSX`, `useRef` from `react`; `FormControl`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` from `@/src/components/ui/form`; `UseFormReturn` from `react-hook-form`; `BaseInput`, `FieldProps`, `handleOnChage` from `../base`; `InputGroup`, `InputGroupInput`, `InputGroupAddon` from `@/src/components/ui/input-group`; `X` from `lucide-react`
    - Implement `SearchInputClass extends BaseInput` with a `render()` method that delegates to `FieldSearch`
    - Implement `FieldSearch` functional component: renders `<FormField>` with `<InputGroupInput type="search">`, debounce logic via `useRef<ReturnType<typeof setTimeout>>`, and a conditional clear button (`<X size={16} />`) shown when `field.value` is non-empty and field is not disabled
    - Propagate `disabled` from both `input.disabled` and `isSubmitting`
    - Export only `SearchInputClass`; keep `FieldSearch` as a file-internal implementation detail
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.2 Write property test for `SearchInputClass` renders `type="search"` input
    - **Property 3: SearchInputClass renders a search-type input**
    - Use `fast-check` to generate arbitrary `FieldProps` variants (varying `name`, `label`, `placeHolder`)
    - Wrap in a minimal `react-hook-form` provider and call `renderSearchInput()`
    - Assert `screen.getByRole('searchbox')` or `document.querySelector('input[type="search"]')` is present
    - **Validates: Requirements 2.3**

  - [x] 2.3 Write property test for disabled state propagation
    - **Property 4: Disabled state propagation**
    - Use `fast-check` to generate `(disabled: boolean, isSubmitting: boolean)` pairs where at least one is `true`
    - Render `SearchInputClass` and assert `input[type="search"]` has the `disabled` attribute
    - Also verify the inverse: when both are `false`, the input is not disabled
    - **Validates: Requirements 2.4**

- [x] 3. Export `search-input` from the barrel
  - In `src/components/custom/form/inputs/types/index.ts`, uncomment the line `// export * from './search-input';`
  - No other changes to this file
  - _Requirements: 2.1_

- [ ] 4. Update `inputMap` in `input-factory.tsx` to use `SearchInputClass`
  - In `src/components/custom/form/inputs/input-factory.tsx`, add `SearchInputClass` to the v1.36.0 import block from `./types`
  - Replace `[InputTypes.SEARCH]: TextInput, // SearchInput component is currently a function component` with `[InputTypes.SEARCH]: SearchInputClass,`
  - Remove the now-obsolete comment
  - _Requirements: 2.2, 2.5_

- [~] 5. Checkpoint — ensure the build compiles cleanly
  - Run `npm run build` (or `npm run lint`) and confirm zero TypeScript / lint errors
  - Verify `SearchInputClass` is exported from the library via `dist/`
  - Ask the user if questions arise

- [ ] 6. Add registry membership tests and regression properties
  - [~] 6.1 Write concrete membership tests for the four added types
    - In `src/components/custom/form/inputs/DynamicForm.test.tsx` (or a new `src/components/custom/form/inputs/registry.test.ts`)
    - Assert `inputFieldComp.includes(InputTypes.DATE_RANGE)` is `true`
    - Assert `inputFieldComp.includes(InputTypes.COUNTRY_SELECT)` is `true`
    - Assert `inputFieldComp.includes(InputTypes.RANGE)` is `true`
    - Assert `inputFieldComp.includes(InputTypes.FILE_UPLOAD)` is `true`
    - Assert `inputMap[InputTypes.SEARCH]` equals `SearchInputClass`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2_

  - [~] 6.2 Write smoke test for `SearchInputClass` (renders without error)
    - Instantiate `new SearchInputClass(mockInput, mockForm)` and call `.render()`
    - Assert the return value is a valid JSX element (non-null, has `$$typeof`)
    - _Requirements: 2.1_

  - [~] 6.3 Write property test for `inputMap → inputFieldComp` completeness
    - **Property 1: inputMap → inputFieldComp completeness**
    - Enumerate all keys of `inputMap` at test time
    - Filter to keys whose mapped class is not `TextInput` (dedicated components only), excluding known placeholder entries (`FORM`, `HIDDEN`, `CHECK_LIST`)
    - For each filtered key assert `inputFieldComp.includes(key)`
    - This is a deterministic structural check that fails immediately if a future dedicated mapping skips `inputFieldComp`
    - **Validates: Requirements 1.5, 1.6, 3.2, 3.4**

  - [~] 6.4 Write property test for `inputFieldComp → inputMap` membership
    - **Property 2: inputFieldComp → inputMap membership**
    - Use `fast-check` to pick a random non-empty subset of `inputFieldComp` entries
    - Assert every entry in the subset is a key in `inputMap`
    - **Validates: Requirements 3.3**

- [~] 7. Final checkpoint — ensure all tests pass
  - Run `npm test` and confirm all tests (existing + new) are green
  - Ask the user if questions arise

## Notes

- Sub-tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests (6.3 and 6.4) form the structural regression guard described in Requirement 3 — they will catch any future registry divergence automatically
- `inputFieldComp` is the consumer-facing discovery surface; `inputMap` is internal — keeping them in sync is the core invariant this feature enforces

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "2.3", "3"] },
    { "id": 2, "tasks": ["4"] },
    { "id": 3, "tasks": ["6.1", "6.2"] },
    { "id": 4, "tasks": ["6.3", "6.4"] }
  ]
}
```
