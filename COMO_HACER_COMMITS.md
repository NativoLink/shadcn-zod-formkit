# 📝 Cómo Hacer los Commits

## 🚀 Opción 1: Script Automático (Recomendado)

Ejecuta un solo comando para crear todos los commits:

```bash
./make-commits.sh
```

Este script:
- ✅ Crea 10 commits organizados
- ✅ Sigue el estándar Conventional Commits
- ✅ Agrupa cambios lógicamente
- ✅ Incluye mensajes descriptivos
- ✅ Muestra resumen al final

---

## 📋 Opción 2: Manual (Paso a Paso)

Si prefieres hacerlo manualmente, sigue estos pasos:

### Commit 1: Nuevos Inputs
```bash
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
```

### Commit 2: Tipos y Definiciones
```bash
git add src/components/custom/form/inputs/base/input-types.ts \
        src/components/custom/form/inputs/base/definitions.ts

git commit -m "feat(types): extend FieldProps with new input properties

- Add InputTypes enum entries: RATING, PHONE, URL, PASSWORD, AUTOCOMPLETE
- Add 20+ new optional props to FieldProps interface
- All new properties are optional and backward compatible"
```

### Commit 3: Factory
```bash
git add src/components/custom/form/inputs/input-factory.tsx

git commit -m "feat(factory): integrate new input types into InputFactory

- Import and register 5 new input components
- Add mapping in inputMap for new InputTypes
- Maintain backward compatibility with existing inputs"
```

### Commit 4: Hooks
```bash
git add src/hooks/

git commit -m "feat(hooks): add custom hooks for form management

- Add useDynamicForm hook for simplified form state management
- Add useFormPersist hook for auto-save to localStorage/sessionStorage"
```

### Commit 5: Validaciones
```bash
git add src/lib/validation-utils.ts src/lib/index.ts

git commit -m "feat(validation): add pre-built validation utilities

Add 12+ reusable Zod validation schemas for common use cases"
```

### Commit 6: Temas
```bash
git add src/components/custom/form/theme/

git commit -m "feat(theme): add theme configuration system

- Add FormTheme interface for customizable styling
- Support for colors, spacing, borders, and typography"
```

### Commit 7: Exports
```bash
git add src/components/custom/form/index.ts src/index.ts package.json

git commit -m "feat(exports): add modular exports for tree-shaking

- Add modular exports in package.json
- Add sideEffects: false for better optimization"
```

### Commit 8: Ejemplo
```bash
git add example/app/examples/advanced/NewFeaturesForm.tsx \
        example/app/examples/advanced/index.ts \
        example/app/page.tsx

git commit -m "feat(example): add demo for new input types

- Create NewFeaturesForm component showcasing all 5 new inputs
- Add new tab '✨ New Features' to example app"
```

### Commit 9: Documentación
```bash
git add README.md NEW_FEATURES.md IMPROVEMENTS.md TESTING_GUIDE.md \
        QUICK_START.md COMO_PROBAR.md RESUMEN_CAMBIOS.md \
        LISTO_PARA_PROBAR.md PRUEBA_RAPIDA.txt INSTRUCCIONES_FINALES.txt

git commit -m "docs: add comprehensive documentation for v1.35.0

- Update README.md with complete API documentation
- Add multiple guides in English and Spanish
- Include testing procedures and examples"
```

### Commit 10: Scripts
```bash
git add test-new-features.sh COMMITS.md make-commits.sh

git commit -m "chore(scripts): add automated testing and commit scripts

- Add test-new-features.sh for one-command testing
- Add documentation for commit process"
```

---

## ✅ Verificar Commits

Después de hacer los commits, verifica:

```bash
git log --oneline -10
```

Deberías ver:

```
abc1234 chore(scripts): add automated testing and commit scripts
def5678 docs: add comprehensive documentation for v1.35.0
ghi9012 feat(example): add demo for new input types
jkl3456 feat(exports): add modular exports for tree-shaking
mno7890 feat(theme): add theme configuration system
pqr1234 feat(validation): add pre-built validation utilities
stu5678 feat(hooks): add custom hooks for form management
vwx9012 feat(factory): integrate new input types into InputFactory
yza3456 feat(types): extend FieldProps with new input properties
bcd7890 feat(inputs): add 5 new input types
```

---

## 🔍 Formato de Commits

Todos los commits siguen el formato:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos usados:
- `feat`: Nueva funcionalidad
- `docs`: Cambios en documentación
- `chore`: Tareas de mantenimiento

### Scopes usados:
- `inputs`: Componentes de input
- `types`: Tipos TypeScript
- `factory`: Input factory
- `hooks`: Custom hooks
- `validation`: Utilidades de validación
- `theme`: Sistema de temas
- `exports`: Exports del paquete
- `example`: Aplicación de ejemplo
- `scripts`: Scripts de automatización

---

## 📊 Resumen de Commits

- **Total**: 10 commits
- **feat**: 8 commits (nuevas características)
- **docs**: 1 commit (documentación)
- **chore**: 1 commit (scripts)

---

## 🚀 Push a GitHub

Después de hacer los commits:

```bash
# Ver el estado
git status

# Ver los commits
git log --oneline -10

# Push a la rama principal
git push origin main

# O si usas master
git push origin master
```

---

## 💡 Tips

1. **Revisa antes de hacer push**: `git log --oneline -10`
2. **Si te equivocas**: `git reset --soft HEAD~1` (deshace el último commit)
3. **Para ver cambios**: `git show <commit-hash>`
4. **Para ver todos los archivos**: `git diff --name-only HEAD~10 HEAD`

---

## 🎯 Siguiente Paso

Después de hacer los commits:

```bash
# 1. Verificar
git log --oneline -10

# 2. Push
git push origin main

# 3. Crear release (opcional)
# En GitHub: Releases → New Release → v1.35.0
```

---

## 📖 Referencias

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Semantic Versioning](https://semver.org/)

---

¡Listo para hacer commits! 🎉
