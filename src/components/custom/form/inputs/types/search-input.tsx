'use client';

import { JSX, useRef } from 'react';
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
  const debounceRef = useRef<number | undefined>(undefined);

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
