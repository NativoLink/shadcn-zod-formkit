'use client';

import { JSX } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { BaseInput, FieldProps } from "../base";
import { ExternalLink, Link } from "lucide-react";

export class UrlInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldUrl form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

const FieldUrl = ({ input, form, isSubmitting }: Props): JSX.Element => {
  const showPreview = input.showPreview ?? true;
  const autoProtocol = input.autoProtocol ?? true;

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  {...field}
                  onBlur={(e) => {
                    let value = e.target.value;
                    if (autoProtocol && value && !value.match(/^https?:\/\//)) {
                      value = `https://${value}`;
                      field.onChange(value);
                    }
                    field.onBlur();
                  }}
                  disabled={input.disabled || isSubmitting}
                  placeholder={input.placeHolder || "https://example.com"}
                  className="pl-10"
                />
              </div>
              {showPreview && field.value && isValidUrl(field.value) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(field.value, "_blank", "noopener,noreferrer")}
                  disabled={input.disabled || isSubmitting}
                  title="Open URL in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
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
