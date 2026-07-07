#!/bin/bash
# Genera la documentacion del proyecto: ERD + Diccionario de datos
set -e

echo "=== Generando diagrama ER (Mermaid) ==="
cd backend
npx prisma generate

echo ""
echo "=== Generando diccionario de datos ==="
npm run docs:diccionario > ../docs/diccionario-datos.md
echo "Diccionario generado en docs/diccionario-datos.md"

echo ""
echo "=== Documentacion generada exitosamente ==="
echo "  - docs/ERD.md (diagrama entidad-relacion)"
echo "  - docs/diccionario-datos.md (diccionario de datos)"
