import { z } from "zod";

/**
 * Common validation utilities for forms
 */

// Phone number validation
export const phoneValidation = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  "Invalid phone number format"
);

// URL validation
export const urlValidation = z.string().url("Invalid URL format");

// Strong password validation
export const strongPasswordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

// Email validation with custom message
export const emailValidation = z
  .string()
  .email("Please enter a valid email address");

// Credit card validation (basic Luhn algorithm)
export const creditCardValidation = z.string().refine(
  (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },
  { message: "Invalid credit card number" }
);

// Date range validation
export const dateRangeValidation = (
  startDate: Date,
  endDate: Date,
  message = "End date must be after start date"
) => {
  return z.object({
    startDate: z.date(),
    endDate: z.date(),
  }).refine((data) => data.endDate > data.startDate, {
    message,
    path: ["endDate"],
  });
};

// File size validation
export const fileSizeValidation = (maxSizeMB: number) => {
  return z
    .any()
    .refine(
      (file) => !file || file.size <= maxSizeMB * 1024 * 1024,
      `File size must be less than ${maxSizeMB}MB`
    );
};

// File type validation
export const fileTypeValidation = (allowedTypes: string[]) => {
  return z
    .any()
    .refine(
      (file) => !file || allowedTypes.includes(file.type),
      `File type must be one of: ${allowedTypes.join(", ")}`
    );
};

// Username validation (alphanumeric, underscore, hyphen)
export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens");

// Postal code validation (US)
export const usPostalCodeValidation = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, "Invalid US postal code");

// Hex color validation
export const hexColorValidation = z
  .string()
  .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Invalid hex color format");

// IP address validation
export const ipAddressValidation = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    "Invalid IP address"
  );

// Slug validation (URL-friendly string)
export const slugValidation = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (use lowercase letters, numbers, and hyphens)");

// Custom async validation helper
export const createAsyncValidation = <T>(
  validator: (value: T) => Promise<boolean>,
  errorMessage: string
) => {
  return z.any().refine(
    async (value) => {
      try {
        return await validator(value);
      } catch {
        return false;
      }
    },
    { message: errorMessage }
  );
};
