# 1. Limpia Todo
rm -rf dist node_modules package-lock.json

# 2. Reinstala dependencias
npm i

# 3. Incrementa versión (patch = 0.0.1, minor = 0.1.0, major = 1.0.0)
npm version patch  # o minor / major según el cambio

# --- new: crear y subir tag automáticamente según versión actual ---
VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

echo "🔖 Creando tag $TAG..."

# Verifica si el tag ya existe en el repositorio remoto
if git ls-remote --tags origin | grep -q "$TAG$"; then
  echo "⚠️  El tag $TAG ya existe en remoto, no se creará de nuevo."
else
  git tag -a "$TAG" -m "Release $TAG"
  git push origin "$TAG"
  echo "✅ Tag $TAG creado y subido correctamente."
fi
# --- end new ---

# 4. Compila el proyecto
npm run build

# 5. Verifica los archivos generados
echo "📦 Archivos generados en dist/:"
ls dist/

# 6. Verifica que react-hook-form NO esté bundleado
echo "🔍 Verificando imports de react-hook-form..."
head -100 dist/index.js | grep -A 5 "react-hook-form"

# 7. Publica en npm
echo "🚀 Publicando paquete..."
npm publish --access public
