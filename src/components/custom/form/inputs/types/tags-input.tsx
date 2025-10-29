'use client'
import React, { JSX } from "react";
import { UseFormReturn } from "react-hook-form";
import { Badge, Card, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/src/components/ui";
import { BaseInput, FieldProps } from "../base";
import { X as RemoveIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";




export class TagInput extends BaseInput {
  render(): JSX.Element {
  const { input, form, isSubmitting } = this;
    return (
      <FieldTags input={input} form={form} isSubmitting={isSubmitting}/>
    )
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldTags = ({ input, form, isSubmitting }: Props): JSX.Element => {


  const formField = <FormField
    key={input.name}
    control={form.control}
    name={input.name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-between p-2 border-b">
          <FormLabel className="font-semibold">
            {input.label || input.name}
          </FormLabel>
        </div>

        <FormControl>
          <TagsInput
            value={field.value ?? []}
            onValueChange={field.onChange}
            placeholder="Enter for add tag"
          />
        </FormControl>

        <FormMessage />
      </FormItem>
    )} />;

  return <>{formField}</>;
  
}



/**
 * used for identifying the split char and use will pasting
 */
const SPLITTER_REGEX = /[\n#?=&\t,./-]+/;

/**
 * used for formatting the pasted element for the correct value format to be added
 */

const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g;

interface TagsInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
  /** Donde mostrar los tags: 'top' o 'bottom', default 'bottom' */
  tagsPosition?: 'top' | 'bottom';
}

const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      value,
      onValueChange,
      placeholder,
      maxItems,
      minItems,
      tagsPosition = 'bottom',
      className,
      dir,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const parseMinItems = minItems ?? 0;
    const parseMaxItems = maxItems ?? Infinity;

    const addTag = (val: string) => {
      if (!value.includes(val) && value.length < parseMaxItems) {
        onValueChange([...value, val]);
      }
    };

    const removeTag = (val: string) => {
      if (value.includes(val) && value.length > parseMinItems) {
        onValueChange(value.filter((v) => v !== val));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        e.preventDefault();
        addTag(inputValue.trim());
        setInputValue('');
      }
      if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
        removeTag(value[value.length - 1]);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const tags = e.clipboardData.getData('text').split(SPLITTER_REGEX)
        .map(t => t.replace(FORMATTING_REGEX, '').trim())
        .filter(t => t && !value.includes(t))
        .slice(0, parseMaxItems - value.length);
      if (tags.length) onValueChange([...value, ...tags]);
    };

    const renderTags = () => (
      <div className="flex flex-wrap gap-1 mb-1 mt-1">
        {value.map(tag => (
          <Badge
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-xs hover:text-destructive"
            >
              &times;
            </button>
          </Badge>
        ))}
      </div>
    );

    return (
      <div {...props} ref={ref} className={cn("w-full", className)}>
        {tagsPosition === 'top' && renderTags()}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:ring-primary"
        />
        {tagsPosition === 'bottom' && renderTags()}
      </div>
    );
  }
);

TagsInput.displayName = 'TagsInput';
