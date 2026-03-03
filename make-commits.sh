#!/bin/bash

echo "🚀 Creating commits following Conventional Commits standard..."
echo ""

# Commit 1: Nuevos inputs
echo "📝 Commit 1/10: New input types..."
git add src/components/custom/form/inputs/types/rating-input.tsx \
        src/components/custom/form/inputs/types/phone-input.tsx \
        src/components/custom/form/inputs/types/url-input.tsx \
        src/components/custom/form/inputs/types/password-input.tsx \
        src/components/custom/form/inputs/types/autocomplete-input.tsx \
        src/components/custom/form/inputs/types/index.ts

git commit -m "feat(inputs): add 5 new input types

- Add RatingInput component with star rating functionality
- Add PhoneInput component with country code selector (13 countries)
- Add UrlInput component with auto-protocol and preview button
- Add PasswordInput component with strength meter and requirements
- Add AutocompleteInput component with async search support

BREAKING CHANGE: None - all new features are opt-in"

# Commit 2: Tipos y definiciones
echo "📝 Commit 2/10: Types and definitions..."
git add src/components/custom/form/inputs/base/input-types.ts \
        src/components/custom/form/inputs/base/definitions.ts

git commit -m "feat(types): extend FieldProps with new input properties

- Add InputTypes enum entries: RATING, PHONE, URL, PASSWORD, AUTOCOMPLETE
- Add 20+ new optional props to FieldProps interface:
  * UX improvements: helpText, helpLink, prefix, suffix, loading, skeleton
  * Input behavior: debounce, maxLength, showCharCount, copyable, clearable
  * Validation: validateOnBlur, validateOnChange, showValidIcon, asyncValidation
  * Accessibility: ariaLabel, ariaDescribedBy, ariaRequired
  * Input-specific: showValue, size, defaultCountryCode, showPreview, etc.

All new properties are optional and backward compatible"

# Commit 3: Factory
echo "📝 Commit 3/10: Input factory integration..."
git add src/components/custom/form/inputs/input-factory.tsx

git commit -m "feat(factory): integrate new input types into InputFactory

- Import and register 5 new input components
- Add mapping in inputMap for new InputTypes
- Update inputFieldComp array with new types
- Maintain backward compatibility with existing inputs"

# Commit 4: Hooks
echo "📝 Commit 4/10: Custom hooks..."
git add src/hooks/

git commit -m "feat(hooks): add custom hooks for form management

- Add useDynamicForm hook for simplified form state management
- Add useFormPersist hook for auto-save to localStorage/sessionStorage
- Export hooks from centralized index file

Features:
- useDynamicForm: handles form initialization, validation, and submission
- useFormPersist: auto-saves form data with debounce and field exclusion"

# Commit 5: Validaciones
echo "📝 Commit 5/10: Validation utilities..."
git add src/lib/validation-utils.ts src/lib/index.ts

git commit -m "feat(validation): add pre-built validation utilities

Add 12+ reusable Zod validation schemas:
- phoneValidation: international phone number format
- urlValidation: URL format validation
- strongPasswordValidation: password strength requirements
- emailValidation: email format with custom messages
- creditCardValidation: Luhn algorithm validation
- usernameValidation: alphanumeric with constraints
- hexColorValidation: hex color format
- ipAddressValidation: IPv4 address format
- slugValidation: URL-friendly string format
- fileSizeValidation: file size constraints
- fileTypeValidation: allowed file types
- createAsyncValidation: helper for custom async validators"

# Commit 6: Temas
echo "📝 Commit 6/10: Theme system..."
git add src/components/custom/form/theme/

git commit -m "feat(theme): add theme configuration system

- Add FormTheme interface for customizable styling
- Define default theme with sensible defaults
- Add utility classes for spacing, border radius, font size, label position
- Support for custom colors (primary, error, success, warning)
- Support for spacing modes (compact, normal, comfortable)
- Support for border radius options (none, sm, md, lg, full)
- Support for label positions (top, left, floating)
- Support for font sizes (sm, base, lg)"

# Commit 7: Exports
echo "📝 Commit 7/10: Package exports..."
git add src/components/custom/form/index.ts src/index.ts package.json

git commit -m "feat(exports): add modular exports for tree-shaking

- Export new input types from form/index.ts
- Export hooks from main index
- Export theme configuration
- Add modular exports in package.json:
  * shadcn-zod-formkit/hooks
  * shadcn-zod-formkit/validation
  * shadcn-zod-formkit/theme
- Add sideEffects: false for better tree-shaking
- Update files array to include new documentation"

# Commit 8: Ejemplo
echo "📝 Commit 8/10: Example application..."
git add example/app/examples/advanced/NewFeaturesForm.tsx \
        example/app/examples/advanced/index.ts \
        example/app/page.tsx

git commit -m "feat(example): add demo for new input types

- Create NewFeaturesForm component showcasing all 5 new inputs
- Add new tab '✨ New Features' to example app
- Include live data preview panel
- Demonstrate validation for each input type
- Export from advanced examples index"

# Commit 9: Documentación
echo "📝 Commit 9/10: Documentation..."
git add README.md NEW_FEATURES.md IMPROVEMENTS.md TESTING_GUIDE.md \
        QUICK_START.md COMO_PROBAR.md RESUMEN_CAMBIOS.md \
        LISTO_PARA_PROBAR.md PRUEBA_RAPIDA.txt INSTRUCCIONES_FINALES.txt

git commit -m "docs: add comprehensive documentation for v1.35.0

- Update README.md with complete API documentation
- Add NEW_FEATURES.md with usage examples for new inputs
- Add IMPROVEMENTS.md with roadmap and changelog
- Add TESTING_GUIDE.md with detailed testing instructions
- Add QUICK_START.md for quick setup
- Add COMO_PROBAR.md (Spanish testing guide)
- Add RESUMEN_CAMBIOS.md (Spanish technical summary)
- Add LISTO_PARA_PROBAR.md (ready to test guide)
- Add PRUEBA_RAPIDA.txt (quick test instructions)
- Add INSTRUCCIONES_FINALES.txt (final instructions)

Documentation includes:
- Complete API reference for all new features
- 15+ practical usage examples
- Migration guide from v1.34.0
- Testing procedures and checklists
- Troubleshooting section
- Multi-language support (English/Spanish)"

# Commit 10: Scripts
echo "📝 Commit 10/10: Testing scripts..."
git add test-new-features.sh COMMITS.md make-commits.sh

git commit -m "chore(scripts): add automated testing and commit scripts

- Add test-new-features.sh for one-command testing
- Add COMMITS.md with detailed commit documentation
- Add make-commits.sh for automated commit creation
- Scripts include colored output and error handling
- Make scripts executable with proper permissions"

echo ""
echo "✅ All 10 commits created successfully!"
echo ""
echo "📊 Summary:"
git log --oneline -10
echo ""
echo "🎉 Done! You can now push with: git push origin main"
