# 1. Limpia Todo
rm -rf dist node_modules package-lock.json

# 2. Actualiza package.json con la primera solución (recomendada)
npm i 

# 3. Incrementa versión
npm version patch  # 1.0.0 -> 1.0.1

# 4. Build
npm run build

# 5. Verifica que los archivos coincidan
ls dist/
# Debe mostrar: index.cjs, index.js, index.d.ts

# 6. Verifica que NO esté bundleado react-hook-form
head -100 dist/index.js | grep -A 5 "react-hook-form"
# Solo debe mostrar el import, NO código interno

# 7. Publica
npm publish