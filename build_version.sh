# 1. Limpia Todo
rm -rf dist node_modules package-lock.json

# 2. Actualiza package.json con la primera solución (recomendada)
npm i 

# 3. Incrementa versión
npm version patch  # 1.0.0 -> 1.0.1

# --- new: crear tag con la versión actual en package.json ---
VERSION=$(node -p "require('./package.json').version")
echo "Creando tag v$VERSION..."
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Tag v$VERSION ya existe, no se crea"
else
  git tag -a "v$VERSION" -m "Release v$VERSION"
#   git push origin "v$VERSION"
fi
# --- end new ---

# 4. Build
npm run build

# 5. Verifica que los archivos coincidan
ls dist/
# Debe mostrar: index.cjs, index.js, index.d.ts

# 6. Verifica que NO esté bundleado react-hook-form
head -100 dist/index.js | grep -A 5 "react-hook-form"
# Solo debe mostrar el import, NO código interno

# 7. Publica
npm publish --access public