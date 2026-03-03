'use client';

import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps } from "../base";
import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

export class RatingInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldRating form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldRating = ({ input, form, isSubmitting }: Props): JSX.Element => {
  const max = input.max ?? 5;
  const size = input.size ?? 'md';
  const showValue = input.showValue ?? false;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <FormField
      key={input.name as string}
      control={form.control}
      name={input.name as string}
      render={({ field }) => (
        <FormItem className={input.className}>
          <FormLabel><b>{input.label}</b></FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: max }, (_, index) => {
                  const isFilled = index < (field.value || 0);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (!input.disabled && !isSubmitting) {
                          field.onChange(index + 1);
                          input.onChange?.([index + 1], form.getValues());
                        }
                      }}
                      disabled={input.disabled || isSubmitting}
                      className={cn(
                        "transition-all duration-150 hover:scale-110",
                        (input.disabled || isSubmitting) && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Star
                        className={cn(
                          sizeClasses[size as keyof typeof sizeClasses],
                          isFilled
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-none text-gray-300"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              {showValue && field.value > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {field.value} / {max}
                </span>
              )}
            </div>
          </FormControl>
          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

