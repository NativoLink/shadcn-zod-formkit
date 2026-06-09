/**
 * registry.test.tsx
 *
 * Tests for the input-types-registry feature.
 *
 * Covers:
 *   Task 2.2 — Property 3: SearchInputClass renders a search-type input (Requirements 2.3)
 *   Task 2.3 — Property 4: Disabled state propagation (Requirements 2.4)
 *   Task 6.1 — Concrete membership tests for the four added types (Requirements 1.1–1.4, 2.2, 2.5)
 *   Task 6.2 — Smoke test: SearchInputClass renders without error (Requirements 2.1)
 *   Task 6.3 — Property 1: inputMap → inputFieldComp completeness (Requirements 1.5, 1.6, 3.2, 3.4)
 *   Task 6.4 — Property 2: inputFieldComp → inputMap membership (Requirements 3.3)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormProvider, useForm } from 'react-hook-form';
import fc from 'fast-check';
import { SearchInputClass } from './types/search-input';
import { TextInput } from './types/text-input';
import { inputMap } from './input-factory';
import { inputFieldComp, InputTypes } from './base/input-types';
import type { FieldProps } from './base/definitions';

// ---------------------------------------------------------------------------
// Shared wrappers
// ---------------------------------------------------------------------------

const SearchInputWrapper = ({ fieldProps }: { fieldProps: FieldProps }) => {
  const form = useForm();
  return (
    <FormProvider {...form}>
      {new SearchInputClass(fieldProps, form, false).render()}
    </FormProvider>
  );
};

const DisabledSearchInputWrapper = ({
  fieldProps,
  isSubmitting,
}: {
  fieldProps: FieldProps;
  isSubmitting: boolean;
}) => {
  const form = useForm();
  return (
    <FormProvider {...form}>
      {new SearchInputClass(fieldProps, form, isSubmitting).render()}
    </FormProvider>
  );
};

// ---------------------------------------------------------------------------
// Property 3: SearchInputClass renders a search-type input
// Task 2.2 — Validates: Requirements 2.3
// ---------------------------------------------------------------------------

describe('Property 3: SearchInputClass renders a search-type input', () => {
  it('renders input[type="search"] for arbitrary FieldProps (name, label, placeHolder)', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,19}$/),
          label: fc.string({ minLength: 0, maxLength: 50 }),
          placeHolder: fc.string({ minLength: 0, maxLength: 50 }),
        }),
        (props) => {
          const fieldProps: FieldProps = {
            name: props.name as keyof Record<string, any>,
            label: props.label,
            placeHolder: props.placeHolder,
          };

          const { unmount } = render(<SearchInputWrapper fieldProps={fieldProps} />);

          const input = document.querySelector('input[type="search"]');
          if (!input) {
            unmount();
            throw new Error(
              `Expected input[type="search"] to be present for name="${props.name}", label="${props.label}"`,
            );
          }

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders with getByRole("searchbox") accessible role for arbitrary FieldProps', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,19}$/),
          label: fc.string({ minLength: 1, maxLength: 50 }),
          placeHolder: fc.string({ minLength: 0, maxLength: 50 }),
        }),
        (props) => {
          const fieldProps: FieldProps = {
            name: props.name as keyof Record<string, any>,
            label: props.label,
            placeHolder: props.placeHolder,
          };

          const { unmount } = render(<SearchInputWrapper fieldProps={fieldProps} />);

          const searchbox = screen.queryByRole('searchbox');
          if (!searchbox) {
            unmount();
            throw new Error(
              `Expected role="searchbox" for name="${props.name}"`,
            );
          }

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Disabled state propagation
// Task 2.3 — Validates: Requirements 2.4
// ---------------------------------------------------------------------------

describe('Property 4: Disabled state propagation', () => {
  it('input[type="search"] is disabled when disabled=true OR isSubmitting=true', () => {
    fc.assert(
      fc.property(
        fc
          .record({ disabled: fc.boolean(), isSubmitting: fc.boolean() })
          .filter(({ disabled, isSubmitting }) => disabled || isSubmitting),
        ({ disabled, isSubmitting }) => {
          const fieldProps: FieldProps = {
            name: 'searchField' as keyof Record<string, any>,
            label: 'Search',
            disabled,
          };

          const { unmount } = render(
            <DisabledSearchInputWrapper fieldProps={fieldProps} isSubmitting={isSubmitting} />,
          );

          const input = document.querySelector('input[type="search"]');
          if (!input) {
            unmount();
            throw new Error('Expected input[type="search"] to be present');
          }
          if (!(input as HTMLInputElement).disabled) {
            unmount();
            throw new Error(
              `Expected disabled when disabled=${disabled}, isSubmitting=${isSubmitting}`,
            );
          }

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('input[type="search"] is NOT disabled when both disabled=false and isSubmitting=false', () => {
    const fieldProps: FieldProps = {
      name: 'searchField' as keyof Record<string, any>,
      label: 'Search',
      disabled: false,
    };

    const { unmount } = render(
      <DisabledSearchInputWrapper fieldProps={fieldProps} isSubmitting={false} />,
    );

    const input = document.querySelector('input[type="search"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    expect(input!.disabled).toBe(false);

    unmount();
  });
});

// ---------------------------------------------------------------------------
// Task 6.1 — Concrete membership tests for the four added types
// Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.5
// ---------------------------------------------------------------------------

describe('Registry membership — concrete checks (Task 6.1)', () => {
  it('inputFieldComp includes InputTypes.DATE_RANGE', () => {
    expect(inputFieldComp.includes(InputTypes.DATE_RANGE)).toBe(true);
  });

  it('inputFieldComp includes InputTypes.COUNTRY_SELECT', () => {
    expect(inputFieldComp.includes(InputTypes.COUNTRY_SELECT)).toBe(true);
  });

  it('inputFieldComp includes InputTypes.RANGE', () => {
    expect(inputFieldComp.includes(InputTypes.RANGE)).toBe(true);
  });

  it('inputFieldComp includes InputTypes.FILE_UPLOAD', () => {
    expect(inputFieldComp.includes(InputTypes.FILE_UPLOAD)).toBe(true);
  });

  it('inputMap[InputTypes.SEARCH] is SearchInputClass', () => {
    expect(inputMap[InputTypes.SEARCH]).toBe(SearchInputClass);
  });
});

// ---------------------------------------------------------------------------
// Task 6.2 — Smoke test: SearchInputClass renders without error
// Validates: Requirements 2.1
// ---------------------------------------------------------------------------

describe('Task 6.2 — SearchInputClass smoke test', () => {
  it('render() returns a valid JSX element (non-null, has $$typeof)', () => {
    // Use a real form to satisfy BaseInput constructor — no actual render needed
    const fieldProps: FieldProps = { name: 'q' as keyof Record<string, any>, label: '' };
    // We need a real form object with a control property; use renderHook pattern
    // by mounting a wrapper and inspecting the return value
    let element: ReturnType<SearchInputClass['render']> | null = null;

    const Probe = () => {
      const form = useForm();
      element = new SearchInputClass(fieldProps, form, false).render();
      return null;
    };

    render(
      <FormProvider {...({} as any)}>
        <Probe />
      </FormProvider>,
    );

    expect(element).not.toBeNull();
    expect((element as any).$$typeof).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Task 6.3 — Property 1: inputMap → inputFieldComp completeness
// Validates: Requirements 1.5, 1.6, 3.2, 3.4
// ---------------------------------------------------------------------------

describe('Property 1: inputMap → inputFieldComp completeness (Task 6.3)', () => {
  it('every dedicated inputMap entry is present in inputFieldComp', () => {
    // These keys intentionally use TextInput as a placeholder (not a dedicated component)
    const placeholderKeys = new Set<InputTypes>([
      InputTypes.FORM,
      InputTypes.HIDDEN,
      InputTypes.CHECK_LIST,
    ]);

    const dedicatedEntries = (Object.keys(inputMap) as InputTypes[]).filter(
      (key) => inputMap[key] !== TextInput && !placeholderKeys.has(key),
    );

    for (const key of dedicatedEntries) {
      expect(
        inputFieldComp.includes(key),
        `inputFieldComp is missing "${key}" which has a dedicated class in inputMap`,
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Task 6.4 — Property 2: inputFieldComp → inputMap membership
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

describe('Property 2: inputFieldComp → inputMap membership (Task 6.4)', () => {
  it('every value in inputFieldComp is a key in inputMap (full array)', () => {
    for (const type of inputFieldComp) {
      expect(
        type in inputMap,
        `inputFieldComp contains "${type}" but it is not a key in inputMap`,
      ).toBe(true);
    }
  });

  it('random subsets of inputFieldComp are all keys in inputMap (property test)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...inputFieldComp), {
          minLength: 1,
          maxLength: inputFieldComp.length,
        }),
        (subset) => {
          for (const type of subset) {
            if (!(type in inputMap)) {
              throw new Error(`"${type}" is in inputFieldComp but not in inputMap`);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
