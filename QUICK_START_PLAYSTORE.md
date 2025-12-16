# 🚀 Inicio Rápido - Publicar en Play Store

## 📦 Lo que ya está listo

✅ **Manifest.json válido** - Configurado para Play Store
✅ **Icono SVG base** - Listo para convertir a PNG
✅ **Política de Privacidad** - Template completo
✅ **Guía detallada** - Ver `PLAYSTORE_GUIDE.md`
✅ **Checklist completo** - Ver `PUBLICACION_CHECKLIST.md`

## ⚡ Pasos Rápidos (15-30 minutos)

### 1. Generar Iconos (5 min)

**Opción Fácil - Online** (Recomendado):
1. Ve a https://realfavicongenerator.net/
2. Sube `public/icon.svg`
3. Descarga todos los iconos
4. Colócalos en `public/`

**Opción Comando**:
```bash
# Si tienes ImageMagick instalado
npm run generate-icons
```

### 2. Desplegar la Web (5 min)

**Opción Vercel** (Recomendado - Más fácil):
```bash
npm install -g vercel
vercel login
vercel
```

Copia la URL que te da (ej: `https://matripuntos.vercel.app`)

### 3. Crear APK con Bubblewrap (10 min)

```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Crear proyecto TWA
bubblewrap init --manifest https://TU-URL-AQUI.com/manifest.json

# Responder preguntas:
# - Package: com.tuempresa.matripuntos
# - Name: Matripuntos
# - Theme: #f97316

# Generar keystore (GUARDA LA CONTRASEÑA)
keytool -genkey -v -keystore matripuntos.keystore \
  -alias matripuntos -keyalg RSA -keysize 2048 -validity 10000

# Construir APK
bubblewrap build --signingKeyPath=./matripuntos.keystore
```

### 4. Tomar Screenshots (5 min)

Desde tu teléfono o usando dev tools:
1. Captura pantalla del login
2. Captura pantalla del dashboard
3. Captura pantalla de recompensas
4. Guarda como `screenshot-mobile-1.png`, etc.

### 5. Subir a Play Console (10 min)

1. Ve a https://play.google.com/console
2. Crea nueva aplicación
3. Completa información básica
4. Sube el APK
5. Sube screenshots
6. Completa política de privacidad URL
7. Enviar para revisión

---

## 🆘 ¿Problemas?

### "No tengo ImageMagick"
👉 Usa https://realfavicongenerator.net/ (más fácil)

### "Bubblewrap no funciona"
👉 Prueba PWA Builder: https://www.pwabuilder.com/

### "No tengo cuenta de Play Developer"
👉 Cuesta $25 USD (pago único): https://play.google.com/console/signup

### "¿Dónde está el SHA-256?"
```bash
keytool -list -v -keystore matripuntos.keystore
```

---

## 📚 Documentos Adicionales

- **Guía Completa**: `PLAYSTORE_GUIDE.md`
- **Checklist Detallado**: `PUBLICACION_CHECKLIST.md`
- **Política de Privacidad**: `PRIVACY_POLICY.md`

---

## 🎯 Objetivo: 30 minutos de trabajo activo

La mayoría del tiempo será esperar que Google revise tu app (1-7 días).

**¡Mucha suerte con tu publicación!** 🚀
