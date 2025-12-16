#!/bin/bash

# Script para generar todos los iconos necesarios para la PWA
# Requiere ImageMagick instalado

echo "🎨 Generando iconos para Matripuntos PWA..."

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick no está instalado"
    echo "Instala con:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: Descarga desde https://imagemagick.org/script/download.php"
    exit 1
fi

cd public

# Usar la imagen base de Gemini
SOURCE_IMAGE="Gemini_Generated_Image_g9siycg9siycg9si copy.png"

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ Error: No se encuentra la imagen fuente '$SOURCE_IMAGE'"
    echo "Asegúrate de que el archivo existe en la carpeta public/"
    exit 1
fi

echo "📦 Generando iconos standard..."
convert "$SOURCE_IMAGE" -resize 72x72 icon-72.png
convert "$SOURCE_IMAGE" -resize 96x96 icon-96.png
convert "$SOURCE_IMAGE" -resize 128x128 icon-128.png
convert "$SOURCE_IMAGE" -resize 144x144 icon-144.png
convert "$SOURCE_IMAGE" -resize 152x152 icon-152.png
convert "$SOURCE_IMAGE" -resize 192x192 icon-192.png
convert "$SOURCE_IMAGE" -resize 384x384 icon-384.png
convert "$SOURCE_IMAGE" -resize 512x512 icon-512.png

echo "🎭 Generando iconos maskable..."
# Maskable icons con la imagen completa (ya tiene safe zone)
convert "$SOURCE_IMAGE" -resize 192x192 -gravity center -background transparent -extent 192x192 icon-192-maskable.png
convert "$SOURCE_IMAGE" -resize 512x512 -gravity center -background transparent -extent 512x512 icon-512-maskable.png

echo "✅ ¡Iconos generados exitosamente!"
echo ""
echo "📋 Iconos creados:"
ls -lh icon-*.png | awk '{print "  " $9 " (" $5 ")"}'

cd ..

echo ""
echo "🎉 ¡Listo! Ahora puedes construir tu proyecto con: npm run build"
