'use client';

import { useState, useMemo, useCallback, JSX } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { BaseInput, FieldProps } from '../base';
import { Input } from '@/src/components/ui/input';
import { Mail, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export class EmailInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldEmail form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

// Common email domains for suggestions
const COMMON_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'aol.com',
  'mail.com',
];

// Common typos mapping
const TYPO_CORRECTIONS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'outloo.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
};

// RFC 5322 compliant email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const FieldEmail = ({ input, form, isSubmitting }: Props): JSX.Element => {
  return (
    <FormField
      key={input.name as string}
      control={form.control}
      name={input.name as string}
      render={({ field }) => (
        <FormItem className={input.className}>
          {input.label && <FormLabel><b>{input.label}</b></FormLabel>}
          <FormControl>
            <EmailInputComponent
              value={field.value || ''}
              onChange={(value) => {
                field.onChange(value);
                input.onChange?.([value], form.getValues());
              }}
              onBlur={field.onBlur}
              placeholder={input.placeHolder}
              disabled={input.disabled || isSubmitting}
              showSuggestions={input.showSuggestions !== false}
              showValidIcon={input.showValidIcon !== false}
              clearable={input.clearable !== false}
            />
          </FormControl>
          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface EmailComponentProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  showSuggestions?: boolean;
  showValidIcon?: boolean;
  clearable?: boolean;
}

function EmailInputComponent({
  value,
  onChange,
  onBlur,
  placeholder = 'ejemplo@email.com',
  disabled = false,
  showSuggestions = true,
  showValidIcon = true,
  clearable = true,
}: EmailComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Validate email
  const isValid = useMemo(() => {
    if (!value) return null;
    return isValidEmail(value);
  }, [value]);

  // Extract domain from email
  const currentDomain = useMemo(() => {
    const atIndex = value.indexOf('@');
    if (atIndex === -1) return '';
    return value.slice(atIndex + 1);
  }, [value]);

  // Check for typos
  const typoSuggestion = useMemo(() => {
    if (!currentDomain) return null;
    return TYPO_CORRECTIONS[currentDomain.toLowerCase()] || null;
  }, [currentDomain]);

  // Generate domain suggestions
  const suggestions = useMemo(() => {
    if (!value || !value.includes('@') || !showSuggestions) return [];
    
    const [localPart] = value.split('@');
    const domain = currentDomain.toLowerCase();
    
    if (!domain) {
      return COMMON_DOMAINS.map(d => `${localPart}@${d}`);
    }
    
    return COMMON_DOMAINS
      .filter(d => d.startsWith(domain) && d !== domain)
      .map(d => `${localPart}@${d}`)
      .slice(0, 5);
  }, [value, currentDomain, showSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    setIsFocused(false);
    setSelectedSuggestionIndex(-1);
  }, [onChange]);

  // Handle typo correction
  const handleTypoCorrection = useCallback(() => {
    if (!typoSuggestion) return;
    const [localPart] = value.split('@');
    onChange(`${localPart}@${typoSuggestion}`);
  }, [value, typoSuggestion, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [suggestions, selectedSuggestionIndex, handleSuggestionClick]);

  // Handle clear
  const handleClear = useCallback(() => {
    onChange('');
    setSelectedSuggestionIndex(-1);
  }, [onChange]);

  const showSuggestionsList = isFocused && suggestions.length > 0;
  const showTypoWarning = typoSuggestion && !isFocused && value.includes('@');

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Input with icons */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          
          <Input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
              onBlur?.();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'pl-10',
              (clearable || showValidIcon) && 'pr-10'
            )}
          />

          {/* Right icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {showValidIcon && isValid === true && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            
            {showValidIcon && isValid === false && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestionsList && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors',
                  index === selectedSuggestionIndex && 'bg-gray-100'
                )}
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Typo warning */}
        {showTypoWarning && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-xs">
                <p className="text-yellow-800">
                  ¿Quisiste decir{' '}
                  <button
                    type="button"
                    onClick={handleTypoCorrection}
                    className="font-semibold underline hover:no-underline"
                  >
                    {value.split('@')[0]}@{typoSuggestion}
                  </button>
                  ?
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
