# Design Document: Number Input Properties

## Overview

This design document specifies the technical implementation of enhanced number formatting and validation capabilities for the `NUMBER` input type in the shadcn-zod-formkit form builder. The feature introduces three new configuration properties (`numberFormat`, `allowNegative`, `allowDecimals`) that enable flexible numeric input handling without requiring the `CURRENCY` input type.

### Key Objectives

1. **Flexible Formatting**: Support customizable thousands separators, decimal separators, decimal places, prefixes, and suffixes
2. **Input Validation**: Control whether negative values and decimal values are accepted
3. **Backward Compatibility**: Ensure existing forms continue to work without modification
4. **Zod Integration**: Maintain seamless integration with existing Zod validation schemas
5. **User Experience**: Display formatted values when unfocused, raw values when focused for easy editing

### Scope

- Modify `FieldProps` interface to include new properties
- Enhance `FieldTextGroup` component to handle number formatting and validation
- Update `NumberInput` class to leverage new formatting capabilities
- Export `NumberFormatConfig` type for developer use
- Maintain full backward compatibility with existing implementations

---

## Architecture

### Data Flow: RawValue vs DisplayValue

The design implements a dual-value system to balance user experience with data integrity:

```
User Input
    ↓
[Input Validation Layer]
  - Check allowNegative
  - Check allowDecimals
  - Apply min/max constraints
    ↓
[RawValue Storage]
  - Numeric value stored in React Hook Form
  - Passed to Zod validation
  - Sent to onChange callbacks
    ↓
[Display Formatting Layer]
  - Applied on blur (field loses focus)
  - Includes thousands separator
  - Includes decimal separator
  - Includes prefix/suffix
    ↓
[DisplayValue Rendering]
  - Shown to user when unfocused
  - Cleared on focus to show RawValue
```

### Component Hierarchy

```
NumberInput (BaseInput subclass)
    ↓
FieldNumber (wrapper component)
    ↓
FieldTextGroup (main implementation)
    ↓
CustomInputGroup (rendering logic)
    ↓
InputGroupInput (UI component)
```

### State Management

- **Form State**: React Hook Form stores the RawValue (numeric)
- **Display State**: Local component state manages DisplayValue formatting
- **Validation State**: Zod schema validates RawValue, not DisplayValue
- **UI State**: Focus/blur events trigger formatting/unformatting

---

## Components and Interfaces

### 1. NumberFormatConfig Type

```typescript
interface NumberFormatConfig {
  decimalPlaces?: number;           // Number of decimal places to display (0-20)
  thousandsSeparator?: string;      // Character for thousands (e.g., ',', '.')
  decimalSeparator?: string;        // Character for decimals (e.g., '.', ',')
  prefix?: string;                  // Text/symbol before value (e.g., '$', '€')
  suffix?: string;                  // Text/symbol after value (e.g., 'USD', '%')
}
```

**Validation Rules**:
- `decimalPlaces` must be between 0 and 20
- `thousandsSeparator` and `decimalSeparator` must be different
- If separators are identical, log console error and use defaults (',' and '.')

### 2. Enhanced FieldProps Interface

Add to existing `FieldProps`:

```typescript
interface FieldProps<T = Record<string,any>, RT = Record<string,any>> {
  // ... existing properties ...
  
  // Number formatting configuration
  inputNumberConfig?: {
    allowDecimals?: boolean;           // Default: true
    decimalPlaces?: number;            // Default: 2
    thousandsSeparator?: string;       // Default: ','
    decimalSeparator?: string;         // Default: '.'
    prefix?: string;                   // Default: undefined
    suffix?: string;                   // Default: undefined
    allowNegative?: boolean;           // Default: true
    min?: number;                      // Existing property
    max?: number;                      // Existing property
    step?: number;                     // Existing property
    formatOnInput?: boolean;            // Default: false (format on blur)
  }
}
```

### 3. FieldTextGroup Component Enhancements

**New Internal State**:
```typescript
const [displayValue, setDisplayValue] = useState<string>('');
const [isFocused, setIsFocused] = useState<boolean>(false);
```

**New Methods**:

#### parseRawValue(value: string, config: inputNumberConfig): number | null
- Removes all formatting characters
- Validates against allowNegative and allowDecimals
- Returns parsed numeric value or null if invalid

#### formatDisplayValue(rawValue: number, config: inputNumberConfig): string
- Applies thousands separator
- Applies decimal separator
- Rounds to decimalPlaces
- Adds prefix and suffix
- Returns formatted string

#### validateNumberInput(value: string, config: inputNumberConfig): boolean
- Checks if minus sign is allowed (allowNegative)
- Checks if decimal separator is allowed (allowDecimals)
- Validates against min/max constraints
- Returns true if valid, false otherwise

#### handleNumberChange(event: ChangeEvent, config: inputNumberConfig): void
- Parses input value
- Validates against constraints
- Updates RawValue in form
- Triggers onChange callback with RawValue
- Does NOT update DisplayValue (only on blur)

#### handleNumberBlur(event: FocusEvent, config: inputNumberConfig): void
- Formats RawValue to DisplayValue
- Updates display state
- Triggers field blur event

#### handleNumberFocus(event: FocusEvent): void
- Clears DisplayValue to show RawValue
- Allows user to edit raw number

---

## Data Models

### NumberFormatConfig (Type Definition)

```typescript
type NumberFormatConfig = {
  decimalPlaces?: number;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
};
```

### Input Processing Pipeline

```
Raw Input String
    ↓
[Validation Check]
  - allowNegative check
  - allowDecimals check
  - Character filtering
    ↓
Numeric Value (RawValue)
    ↓
[Constraint Application]
  - min/max clamping
  - Decimal truncation if needed
    ↓
Form Storage (React Hook Form)
    ↓
[On Blur: Formatting]
  - Thousands separator insertion
  - Decimal separator replacement
  - Prefix/suffix addition
    ↓
Display String (DisplayValue)
```

### Zod Integration

The RawValue (numeric) is passed to Zod validation, not the DisplayValue:

```typescript
// Example schema
const schema = z.object({
  price: z.number()
    .min(0, "Price must be positive")
    .max(999999, "Price too high")
});

// Field configuration
const field: FieldProps = {
  name: 'price',
  label: 'Price',
  inputNumberConfig: {
    allowNegative: false,
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    prefix: '$',
    suffix: ' USD'
  }
};

// Form receives RawValue (e.g., 1234.56)
// Zod validates RawValue (e.g., 1234.56)
// User sees DisplayValue (e.g., "$1,234.56 USD")
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Thousands Separator Display

*For any* number with a thousands separator configured, when the field loses focus, the displayed value should contain the thousands separator at the correct positions (every 3 digits from the right in the integer part).

**Validates: Requirements 1.2**

### Property 2: Decimal Separator Replacement

*For any* number with a custom decimal separator configured, when the field loses focus, the displayed value should use the configured decimal separator instead of the default.

**Validates: Requirements 1.3**

### Property 3: Decimal Places Rounding

*For any* number and a configured decimal places value, when the field loses focus, the displayed value should show exactly that many decimal places (rounded appropriately).

**Validates: Requirements 1.4**

### Property 4: Prefix Display

*For any* number with a prefix configured, when the field loses focus, the displayed value should start with the prefix string.

**Validates: Requirements 1.5**

### Property 5: Suffix Display

*For any* number with a suffix configured, when the field loses focus, the displayed value should end with the suffix string.

**Validates: Requirements 1.6**

### Property 6: RawValue Storage

*For any* formatted number input, the value stored in React Hook Form should be the numeric RawValue, not the formatted DisplayValue string.

**Validates: Requirements 1.7**

### Property 7: Focus Shows RawValue

*For any* number field with formatting configured, when the field receives focus, the displayed input value should be the raw numeric value without formatting.

**Validates: Requirements 1.8**

### Property 8: Blur Applies Formatting

*For any* number field with formatting configured, when the field loses focus, the displayed value should have the configured formatting applied.

**Validates: Requirements 1.9**

### Property 9: Negative Input Rejection

*For any* number field with `allowNegative: false`, when the user attempts to enter a minus sign, the field value should remain unchanged.

**Validates: Requirements 2.2**

### Property 10: Negative Value Clamping

*For any* number field with `allowNegative: false`, if the RawValue becomes negative through any operation, it should be replaced with 0.

**Validates: Requirements 2.3**

### Property 11: Negative Values Allowed

*For any* number field with `allowNegative: true` (or undefined), the user should be able to enter and store negative values.

**Validates: Requirements 2.4**

### Property 12: Decimal Separator Rejection

*For any* number field with `allowDecimals: false`, when the user attempts to enter the decimal separator, the field value should remain unchanged.

**Validates: Requirements 3.2**

### Property 13: Decimal Truncation

*For any* number field with `allowDecimals: false`, if a decimal number is entered, only the integer part should be stored and displayed.

**Validates: Requirements 3.3**

### Property 14: Decimal Values Allowed

*For any* number field with `allowDecimals: true` (or undefined), the user should be able to enter and store decimal values.

**Validates: Requirements 3.4**

### Property 15: DecimalPlaces Ignored When Decimals Disabled

*For any* number field with `allowDecimals: false` and `decimalPlaces` configured, the `decimalPlaces` setting should be ignored and the value treated as an integer.

**Validates: Requirements 3.5**

### Property 16: RawValue Passed to Zod

*For any* number field with Zod validation, the value passed to the Zod schema should be the numeric RawValue, not the formatted DisplayValue.

**Validates: Requirements 4.1**

### Property 17: onChange Receives RawValue

*For any* number field with an onChange callback, the callback should be invoked with the numeric RawValue, not the formatted DisplayValue.

**Validates: Requirements 4.4**

### Property 18: Invalid Separator Configuration

*For any* number field where `decimalSeparator` and `thousandsSeparator` are identical, a console error should be logged and default separators should be used.

**Validates: Requirements 5.3**

### Property 19: Backward Compatibility Without numberFormat

*For any* number field without `inputNumberConfig` defined, the field should behave exactly as it did before this feature (no special formatting).

**Validates: Requirements 6.1**

### Property 20: Default allowNegative Behavior

*For any* number field without `allowNegative` defined, negative values should be allowed (default behavior).

**Validates: Requirements 6.2**

### Property 21: Default allowDecimals Behavior

*For any* number field without `allowDecimals` defined, decimal values should be allowed (default behavior).

**Validates: Requirements 6.3**

### Property 22: Min/Max Compatibility

*For any* number field with `min` and `max` properties defined, those constraints should continue to work correctly with the new formatting features.

**Validates: Requirements 6.4**

---

## Error Handling

### Input Validation Errors

1. **Invalid Separator Configuration**
   - **Trigger**: `decimalSeparator === thousandsSeparator`
   - **Action**: Log console error, use defaults ('.' and ',')
   - **User Impact**: Field continues to work with default separators

2. **Invalid Decimal Places**
   - **Trigger**: `decimalPlaces < 0` or `decimalPlaces > 20`
   - **Action**: Clamp to valid range (0-20)
   - **User Impact**: Field uses clamped value

3. **Conflicting Constraints**
   - **Trigger**: `allowNegative: false` with `min < 0`
   - **Action**: Log warning, use `allowNegative: false` as primary constraint
   - **User Impact**: Negative values are prevented

4. **Zod Validation Errors**
   - **Trigger**: RawValue fails Zod schema validation
   - **Action**: Display Zod error message
   - **User Impact**: User sees validation error, can correct input

### Edge Cases

1. **Empty Input**
   - RawValue: `null` or `undefined`
   - DisplayValue: Empty string
   - Zod: Validates as per schema (may require `.optional()` or `.nullable()`)

2. **Zero Value**
   - RawValue: `0`
   - DisplayValue: Formatted as "0" or "0.00" depending on config
   - Behavior: Treated as valid number

3. **Very Large Numbers**
   - RawValue: Stored as JavaScript number (up to 2^53 - 1)
   - DisplayValue: Formatted with thousands separators
   - Behavior: May lose precision for numbers > 15 significant digits

4. **Rapid Input Changes**
   - Behavior: Each keystroke updates RawValue immediately
   - DisplayValue: Only updated on blur
   - Benefit: Smooth editing experience

---

## Testing Strategy

### Unit Testing Approach

Unit tests verify specific examples, edge cases, and error conditions:

1. **Formatting Tests**
   - Test thousands separator insertion at correct positions
   - Test decimal separator replacement
   - Test decimal place rounding
   - Test prefix/suffix addition
   - Test combination of all formatting options

2. **Validation Tests**
   - Test negative number rejection when `allowNegative: false`
   - Test decimal rejection when `allowDecimals: false`
   - Test min/max constraint enforcement
   - Test invalid separator configuration handling

3. **Integration Tests**
   - Test Zod validation with formatted inputs
   - Test onChange callback receives RawValue
   - Test focus/blur formatting toggle
   - Test backward compatibility without config

4. **Edge Case Tests**
   - Test empty input handling
   - Test zero value handling
   - Test very large numbers
   - Test rapid input changes
   - Test conflicting constraints

### Property-Based Testing Approach

Property-based tests verify universal properties across many generated inputs:

#### Property Test 1: Thousands Separator Formatting
```
Feature: number-input-properties, Property 1: Thousands Separator Display

For any number with thousands separator configured:
- Generate random numbers (1000-999999999)
- Set thousands separator to ','
- Blur field
- Verify displayed value contains ',' at correct positions
- Run minimum 100 iterations
```

#### Property Test 2: Decimal Separator Replacement
```
Feature: number-input-properties, Property 2: Decimal Separator Replacement

For any number with custom decimal separator:
- Generate random decimal numbers
- Set decimal separator to ','
- Blur field
- Verify displayed value uses ',' not '.'
- Run minimum 100 iterations
```

#### Property Test 3: Decimal Places Rounding
```
Feature: number-input-properties, Property 3: Decimal Places Rounding

For any number and decimal places setting:
- Generate random decimal numbers
- Set decimalPlaces to 2
- Blur field
- Verify displayed value has exactly 2 decimal places
- Run minimum 100 iterations
```

#### Property Test 4: RawValue Storage
```
Feature: number-input-properties, Property 6: RawValue Storage

For any formatted number:
- Generate random numbers
- Apply formatting configuration
- Verify form stores numeric RawValue, not formatted string
- Run minimum 100 iterations
```

#### Property Test 5: Negative Input Rejection
```
Feature: number-input-properties, Property 9: Negative Input Rejection

For any field with allowNegative: false:
- Generate random positive numbers
- Attempt to prepend minus sign
- Verify value remains unchanged
- Run minimum 100 iterations
```

#### Property Test 6: Decimal Rejection
```
Feature: number-input-properties, Property 12: Decimal Separator Rejection

For any field with allowDecimals: false:
- Generate random integers
- Attempt to insert decimal separator
- Verify value remains unchanged
- Run minimum 100 iterations
```

#### Property Test 7: Backward Compatibility
```
Feature: number-input-properties, Property 19: Backward Compatibility

For any field without inputNumberConfig:
- Generate random numbers
- Verify field behaves like unformatted number input
- Verify no formatting is applied
- Run minimum 100 iterations
```

#### Property Test 8: Min/Max Compatibility
```
Feature: number-input-properties, Property 22: Min/Max Compatibility

For any field with min/max and formatting:
- Generate random numbers
- Apply min/max constraints
- Apply formatting
- Verify constraints are still enforced
- Run minimum 100 iterations
```

### Testing Library Selection

- **Unit Tests**: Jest with React Testing Library
- **Property-Based Tests**: fast-check (JavaScript/TypeScript)
- **Integration Tests**: Jest with React Hook Form test utilities

### Test Configuration

- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Tests run on every commit (pre-commit hook)
- Coverage target: >90% for number formatting logic

---

## Implementation Considerations

### Performance

1. **Formatting on Blur Only**: DisplayValue formatting only occurs on blur to avoid performance overhead during rapid typing
2. **Memoization**: Format functions should be memoized to prevent unnecessary recalculations
3. **Lazy Validation**: Input validation happens synchronously but doesn't block rendering

### Accessibility

1. **ARIA Labels**: Number fields should have appropriate `aria-label` or `aria-describedby`
2. **Error Messages**: Validation errors should be announced to screen readers
3. **Keyboard Navigation**: All formatting should work with keyboard-only input
4. **Focus Management**: Focus/blur events should properly manage display state

### Browser Compatibility

1. **Intl.NumberFormat**: Used for locale-aware formatting (supported in all modern browsers)
2. **Number Parsing**: Uses standard JavaScript `parseFloat()` and `Number()` (universal support)
3. **Event Handling**: Standard DOM events (focus, blur, change) used throughout

### Security

1. **Input Sanitization**: All user input is parsed as numbers, preventing injection attacks
2. **No HTML Rendering**: Prefix/suffix are rendered as text, not HTML
3. **Zod Validation**: Server-side validation should still validate RawValue

---

## Integration Points

### React Hook Form Integration

```typescript
// Form stores RawValue
const form = useForm({
  defaultValues: {
    price: 1234.56  // Numeric RawValue
  }
});

// Field configuration
const field: FieldProps = {
  name: 'price',
  inputNumberConfig: {
    thousandsSeparator: ',',
    decimalSeparator: '.',
    prefix: '$'
  }
};

// User sees: "$1,234.56"
// Form stores: 1234.56
// onChange receives: 1234.56
```

### Zod Validation Integration

```typescript
// Zod schema validates RawValue
const schema = z.object({
  price: z.number()
    .min(0)
    .max(999999)
});

// Validation receives RawValue (1234.56), not DisplayValue ("$1,234.56")
// Validation works correctly
```

### Existing min/max Properties

```typescript
// Existing min/max properties continue to work
const field: FieldProps = {
  name: 'quantity',
  min: 1,
  max: 100,
  inputNumberConfig: {
    allowDecimals: false,
    allowNegative: false
  }
};

// All constraints are enforced together
```

---

## Use Cases and Examples

### Use Case 1: Currency Input

```typescript
const priceField: FieldProps = {
  name: 'price',
  label: 'Price',
  inputNumberConfig: {
    allowDecimals: true,
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    prefix: '$',
    suffix: ' USD',
    allowNegative: false,
    min: 0
  }
};

// User sees: "$1,234.56 USD"
// Form stores: 1234.56
```

### Use Case 2: Percentage Input

```typescript
const percentField: FieldProps = {
  name: 'discount',
  label: 'Discount Percentage',
  inputNumberConfig: {
    allowDecimals: true,
    decimalPlaces: 2,
    thousandsSeparator: '',
    decimalSeparator: '.',
    suffix: '%',
    allowNegative: false,
    min: 0,
    max: 100
  }
};

// User sees: "25.50%"
// Form stores: 25.50
```

### Use Case 3: Quantity Input

```typescript
const quantityField: FieldProps = {
  name: 'quantity',
  label: 'Quantity',
  inputNumberConfig: {
    allowDecimals: false,
    thousandsSeparator: ',',
    allowNegative: false,
    min: 1
  }
};

// User sees: "1,000"
// Form stores: 1000
```

### Use Case 4: European Format

```typescript
const europeanField: FieldProps = {
  name: 'amount',
  label: 'Amount',
  inputNumberConfig: {
    allowDecimals: true,
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
    prefix: '€ ',
    allowNegative: true
  }
};

// User sees: "€ 1.234,56"
// Form stores: 1234.56
```

### Use Case 5: Backward Compatibility (No Config)

```typescript
const simpleField: FieldProps = {
  name: 'count',
  label: 'Count'
  // No inputNumberConfig - behaves like before
};

// User sees: "1234" (no formatting)
// Form stores: 1234
```

---

## Migration Path

### For Existing Users

No migration required. Existing number fields continue to work without modification:

```typescript
// Old code - still works
const field: FieldProps = {
  name: 'value',
  label: 'Value'
};

// New code - with formatting
const field: FieldProps = {
  name: 'value',
  label: 'Value',
  inputNumberConfig: {
    thousandsSeparator: ',',
    decimalPlaces: 2
  }
};
```

### Adoption Path

1. **Phase 1**: Deploy feature with default behavior (no formatting)
2. **Phase 2**: Update documentation with examples
3. **Phase 3**: Gradually adopt in new forms
4. **Phase 4**: Optionally refactor existing forms to use formatting

---

## Future Enhancements

1. **Locale-Aware Formatting**: Use `Intl.NumberFormat` for automatic locale detection
2. **Custom Validation Rules**: Allow custom validation functions beyond min/max
3. **Currency Conversion**: Automatic conversion between currencies
4. **Scientific Notation**: Support for scientific notation input/display
5. **Accounting Format**: Support for accounting format (negative numbers in parentheses)

