# Implementation Plan: Number Input Properties

## Overview

This implementation plan breaks down the feature into discrete, incremental coding tasks. The feature adds number formatting, negative value control, and decimal control to the NUMBER input type through a new `inputNumberConfig` property. Tasks are organized to build core functionality first, then add validation, formatting, and integration layers.

## Tasks

- [ ] 1. Define types and interfaces for number formatting
  - Create `NumberFormatConfig` type with all formatting properties
  - Extend `FieldProps` interface with `inputNumberConfig` property
  - Export types from main library entry point
  - _Requirements: 1.1, 5.1, 5.2_

- [ ] 2. Create number formatting utility functions
  - [ ] 2.1 Implement `formatDisplayValue()` function
    - Apply thousands separator at correct positions
    - Replace decimal separator
    - Round to specified decimal places
    - Add prefix and suffix
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ] 2.2 Write property test for thousands separator formatting
    - **Property 1: Thousands Separator Display**
    - **Validates: Requirements 1.2**
  
  - [ ] 2.3 Write property test for decimal separator replacement
    - **Property 2: Decimal Separator Replacement**
    - **Validates: Requirements 1.3**
  
  - [ ] 2.4 Write property test for decimal places rounding
    - **Property 3: Decimal Places Rounding**
    - **Validates: Requirements 1.4**
  
  - [ ] 2.5 Write property test for prefix/suffix display
    - **Property 4: Prefix Display**
    - **Property 5: Suffix Display**
    - **Validates: Requirements 1.5, 1.6**

- [ ] 3. Create number parsing and validation utility functions
  - [ ] 3.1 Implement `parseRawValue()` function
    - Remove all formatting characters
    - Parse string to numeric value
    - Return null if invalid
    - _Requirements: 1.7_
  
  - [ ] 3.2 Implement `validateNumberInput()` function
    - Check if minus sign is allowed (allowNegative)
    - Check if decimal separator is allowed (allowDecimals)
    - Validate against min/max constraints
    - Return validation result
    - _Requirements: 2.1, 2.2, 3.1, 3.2_
  
  - [ ] 3.3 Write unit tests for parseRawValue()
    - Test parsing formatted strings
    - Test parsing invalid inputs
    - Test edge cases (empty, zero, negative)
    - _Requirements: 1.7_
  
  - [ ] 3.4 Write unit tests for validateNumberInput()
    - Test negative rejection when allowNegative is false
    - Test decimal rejection when allowDecimals is false
    - Test min/max constraint validation
    - _Requirements: 2.2, 3.2_

- [ ] 4. Implement separator configuration validation
  - [ ] 4.1 Create `validateSeparatorConfig()` function
    - Check if decimalSeparator and thousandsSeparator are different
    - Log console error if identical
    - Return corrected config with defaults if needed
    - _Requirements: 5.3_
  
  - [ ] 4.2 Write unit tests for separator validation
    - Test identical separators error handling
    - Test default separator application
    - _Requirements: 5.3_

- [ ] 5. Enhance FieldTextGroup component with number formatting
  - [ ] 5.1 Add internal state for display value and focus state
    - Add `displayValue` state
    - Add `isFocused` state
    - Initialize from form value on mount
    - _Requirements: 1.8, 1.9_
  
  - [ ] 5.2 Implement `handleNumberChange()` handler
    - Parse input value
    - Validate against constraints
    - Update form value with RawValue
    - Trigger onChange callback with RawValue
    - Do NOT update DisplayValue (only on blur)
    - _Requirements: 1.7, 4.4_
  
  - [ ] 5.3 Implement `handleNumberBlur()` handler
    - Format RawValue to DisplayValue
    - Update display state
    - Trigger field blur event
    - _Requirements: 1.9, 1.8_
  
  - [ ] 5.4 Implement `handleNumberFocus()` handler
    - Clear DisplayValue to show RawValue
    - Allow user to edit raw number
    - _Requirements: 1.8_
  
  - [ ] 5.5 Write unit tests for FieldTextGroup handlers
    - Test onChange receives RawValue
    - Test blur applies formatting
    - Test focus shows RawValue
    - Test rapid input changes
    - _Requirements: 1.7, 1.8, 1.9, 4.4_

- [ ] 6. Implement negative value control
  - [ ] 6.1 Add negative value rejection logic to input handler
    - Prevent minus sign input when allowNegative is false
    - Clamp negative values to 0 when allowNegative is false
    - _Requirements: 2.2, 2.3_
  
  - [ ] 6.2 Write property test for negative input rejection
    - **Property 9: Negative Input Rejection**
    - **Validates: Requirements 2.2**
  
  - [ ] 6.3 Write property test for negative value clamping
    - **Property 10: Negative Value Clamping**
    - **Validates: Requirements 2.3**
  
  - [ ] 6.4 Write property test for negative values allowed
    - **Property 11: Negative Values Allowed**
    - **Validates: Requirements 2.4**

- [ ] 7. Implement decimal value control
  - [ ] 7.1 Add decimal separator rejection logic to input handler
    - Prevent decimal separator input when allowDecimals is false
    - Truncate decimal part when allowDecimals is false
    - _Requirements: 3.2, 3.3_
  
  - [ ] 7.2 Implement decimal truncation when allowDecimals is false
    - Remove decimal part from parsed value
    - Ignore decimalPlaces setting when allowDecimals is false
    - _Requirements: 3.3, 3.5_
  
  - [ ] 7.3 Write property test for decimal separator rejection
    - **Property 12: Decimal Separator Rejection**
    - **Validates: Requirements 3.2**
  
  - [ ] 7.4 Write property test for decimal truncation
    - **Property 13: Decimal Truncation**
    - **Validates: Requirements 3.3**
  
  - [ ] 7.5 Write property test for decimal values allowed
    - **Property 14: Decimal Values Allowed**
    - **Validates: Requirements 3.4**
  
  - [ ] 7.6 Write property test for decimalPlaces ignored when decimals disabled
    - **Property 15: DecimalPlaces Ignored When Decimals Disabled**
    - **Validates: Requirements 3.5**

- [ ] 8. Integrate with Zod validation system
  - [ ] 8.1 Ensure RawValue is passed to Zod validation
    - Verify form passes numeric RawValue to schema
    - Test with z.number() validators
    - _Requirements: 4.1_
  
  - [ ] 8.2 Test Zod validation with allowNegative constraint
    - Verify z.number().min(0) works with allowNegative: false
    - Ensure no conflicts between constraints
    - _Requirements: 4.2_
  
  - [ ] 8.3 Test Zod validation with allowDecimals constraint
    - Verify z.number().int() works with allowDecimals: false
    - Ensure consistent behavior
    - _Requirements: 4.3_
  
  - [ ] 8.4 Write property test for RawValue passed to Zod
    - **Property 16: RawValue Passed to Zod**
    - **Validates: Requirements 4.1**

- [ ] 9. Implement backward compatibility
  - [ ] 9.1 Verify default behavior without inputNumberConfig
    - Field behaves like unformatted number input
    - No formatting applied
    - _Requirements: 6.1_
  
  - [ ] 9.2 Verify default allowNegative behavior
    - Negative values allowed when allowNegative undefined
    - _Requirements: 6.2_
  
  - [ ] 9.3 Verify default allowDecimals behavior
    - Decimal values allowed when allowDecimals undefined
    - _Requirements: 6.3_
  
  - [ ] 9.4 Verify min/max compatibility
    - Existing min/max properties work with new formatting
    - Constraints enforced correctly
    - _Requirements: 6.4_
  
  - [ ] 9.5 Write property test for backward compatibility
    - **Property 19: Backward Compatibility Without numberFormat**
    - **Validates: Requirements 6.1**
  
  - [ ] 9.6 Write property test for default allowNegative
    - **Property 20: Default allowNegative Behavior**
    - **Validates: Requirements 6.2**
  
  - [ ] 9.7 Write property test for default allowDecimals
    - **Property 21: Default allowDecimals Behavior**
    - **Validates: Requirements 6.3**
  
  - [ ] 9.8 Write property test for min/max compatibility
    - **Property 22: Min/Max Compatibility**
    - **Validates: Requirements 6.4**

- [ ] 10. Implement error handling and edge cases
  - [ ] 10.1 Handle invalid separator configuration
    - Log console error when separators are identical
    - Use default separators
    - _Requirements: 5.3_
  
  - [ ] 10.2 Handle empty input
    - Store null or undefined in form
    - Display empty string
    - _Requirements: 4.1_
  
  - [ ] 10.3 Handle zero value
    - Format zero correctly with configured format
    - Treat as valid number
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [ ] 10.4 Handle very large numbers
    - Format with thousands separators
    - Maintain precision within JavaScript limits
    - _Requirements: 1.2_
  
  - [ ] 10.5 Write unit tests for edge cases
    - Test empty input handling
    - Test zero value handling
    - Test very large numbers
    - Test rapid input changes
    - _Requirements: 1.2, 1.3, 1.4_

- [ ] 11. Create integration tests
  - [ ] 11.1 Write integration test for currency input use case
    - Configure field with prefix, suffix, thousands separator, decimal places
    - Test user input flow
    - Verify formatting and storage
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_
  
  - [ ] 11.2 Write integration test for percentage input use case
    - Configure field with suffix, no thousands separator
    - Test user input flow
    - Verify formatting and storage
    - _Requirements: 1.1, 1.5, 1.6, 1.7, 1.8, 1.9_
  
  - [ ] 11.3 Write integration test for quantity input use case
    - Configure field with allowDecimals: false
    - Test user input flow
    - Verify decimal rejection
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 11.4 Write integration test for European format use case
    - Configure field with European separators
    - Test user input flow
    - Verify formatting with custom separators
    - _Requirements: 1.2, 1.3, 1.4_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all unit tests pass
  - Ensure all property-based tests pass
  - Ensure all integration tests pass
  - Ask the user if questions arise

- [ ] 13. Create example implementations
  - [ ] 13.1 Create currency input example
    - Show configuration for USD currency
    - Demonstrate formatting and validation
    - _Requirements: 1.1, 1.5, 1.6, 2.1, 3.1_
  
  - [ ] 13.2 Create percentage input example
    - Show configuration for percentage values
    - Demonstrate min/max constraints
    - _Requirements: 1.1, 1.5, 1.6, 2.1, 3.1_
  
  - [ ] 13.3 Create quantity input example
    - Show configuration for integer-only values
    - Demonstrate allowDecimals: false
    - _Requirements: 1.1, 3.1, 3.2_
  
  - [ ] 13.4 Create European format example
    - Show configuration with European separators
    - Demonstrate custom decimal and thousands separators
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 14. Final checkpoint - Ensure all tests pass and examples work
  - Ensure all tests pass
  - Ensure all examples render correctly
  - Verify backward compatibility with existing forms
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties across many inputs
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end workflows
- Checkpoints ensure incremental validation
- All code should follow existing project conventions and patterns
