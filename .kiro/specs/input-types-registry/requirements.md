# Requirements Document

## Introduction

The `InputTypes` enum defines all input types available in the `shadcn-zod-formkit` library. Two structures must stay in sync:

1. **`inputMap`** — internal object in `InputFactory` that maps each type to its component class. Currently complete.
2. **`inputFieldComp`** — publicly exported array that consumers use to discover available input types. Currently incomplete.

Types `DATE_RANGE`, `COUNTRY_SELECT`, `RANGE`, and `FILE_UPLOAD` exist in `InputTypes` and `inputMap` but are absent from `inputFieldComp`. Additionally, `InputTypes.SEARCH` is mapped in the factory to `TextInput` instead of its own component, because `SearchInput` is a React function component and not a class extending `BaseInput`. The `search-input.tsx` file exists but its content is commented out.

## Glossary

- **InputTypes**: TypeScript enum that enumerates all input types supported by the library.
- **inputFieldComp**: Publicly exported array from `input-types.ts` that lists available `InputTypes` for consumers.
- **inputMap**: Internal `Record<InputTypes, InputClassConstructor>` in `input-factory.tsx` that maps each type to its component class.
- **InputFactory**: Class that uses `inputMap` to instantiate the correct component for a given `InputTypes` value.
- **BaseInput**: Abstract class that all input components must extend to be compatible with `InputFactory`.
- **SearchInputClass**: TypeScript class that extends `BaseInput` and wraps the search component logic to make it compatible with `InputFactory`.
- **Registry**: The combined set of `inputFieldComp` and `inputMap` that collectively defines available input types.

## Requirements

### Requirement 1: Complete synchronization of `inputFieldComp` with `inputMap`

**User Story:** As a library consumer, I want `inputFieldComp` to list all available input types so that I can programmatically discover the full set of supported types without inspecting `InputFactory` internals.

#### Acceptance Criteria

1. THE `inputFieldComp` SHALL contain `InputTypes.DATE_RANGE`.
2. THE `inputFieldComp` SHALL contain `InputTypes.COUNTRY_SELECT`.
3. THE `inputFieldComp` SHALL contain `InputTypes.RANGE`.
4. THE `inputFieldComp` SHALL contain `InputTypes.FILE_UPLOAD`.
5. WHEN a new value is added to the `InputTypes` enum and to `inputMap`, THE `inputFieldComp` SHALL include that same value.
6. FOR ALL values of `InputTypes` present in `inputMap` with a dedicated component (not `TextInput` used as a placeholder), THE `inputFieldComp` SHALL contain that value.

### Requirement 2: `SearchInput` class compatible with `InputFactory`

**User Story:** As a form developer, I want `InputTypes.SEARCH` to be backed by its own class component so that the mapping in `inputMap` is semantically correct and does not depend on `TextInput` as a substitute.

#### Acceptance Criteria

1. THE `SearchInputClass` SHALL extend `BaseInput` and implement the `render(): JSX.Element` method.
2. WHEN `InputFactory` receives `InputTypes.SEARCH`, THE `InputFactory` SHALL instantiate `SearchInputClass` instead of `TextInput`.
3. THE `SearchInputClass` SHALL render a field of type `search` (HTML attribute `type="search"`) integrated with react-hook-form using `FormField`, `FormControl`, `FormLabel`, and `FormMessage`.
4. IF the `SearchInputClass` field is disabled or the form is in `isSubmitting` state, THEN THE `SearchInputClass` SHALL disable the underlying input.
5. THE `inputMap` SHALL reference `SearchInputClass` in the `[InputTypes.SEARCH]` entry, removing the comment indicating the component was a function.

### Requirement 3: Future Registry consistency guarantee

**User Story:** As a library maintainer, I want a structural guarantee that `inputFieldComp` and `inputMap` cannot silently diverge, so that incomplete registration bugs are detectable at development time.

#### Acceptance Criteria

1. THE `inputFieldComp` SHALL be declared with an explicit annotation or comment indicating it must contain all `InputTypes` values that have a dedicated component in `inputMap`.
2. WHEN the length of `inputFieldComp` differs from the number of entries in `inputMap` that reference a dedicated component (not a placeholder like `TextInput` for non-text types), THE developer SHALL be notified via a failing regression test.
3. THE regression test SHALL verify that every value in `inputFieldComp` also exists as a key in `inputMap`.
4. THE regression test SHALL verify that every key in `inputMap` with a dedicated component is present in `inputFieldComp`.
