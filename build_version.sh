# 1. Limpia
# rm -rf dist node_modules package-lock.json

# 2. Reinstala dependencias
# npm i

# 3. Incrementa versión y crea tag
echo "🔼 Incrementando versión..."
npm version patch --no-git-tag-version
git add package.json package-lock.json
git commit -m "🔼 Bump version"

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

echo "🔖 Creando tag $TAG..."
if git ls-remote --tags origin | grep -q "$TAG$"; then
  echo "⚠️  El tag $TAG ya existe en remoto, no se creará de nuevo."
else
  git tag -a "$TAG" -m "Release $TAG"
  git push origin "$TAG"
  echo "✅ Tag $TAG creado y subido correctamente."
fi

# 4. Compila
npm run build

# 5. Verifica
ls dist/
head -100 dist/index.js | grep -A 5 "react-hook-form"

# 6. Publica
npm publish --access public
