# Guía para Publicar en Play Store

Esta guía te ayudará a preparar Matripuntos para publicarlo en Google Play Store usando **Trusted Web Activity (TWA)**.

## Requisitos Previos

- Cuenta de Google Play Developer ($25 USD único pago)
- Node.js y npm instalados
- Android Studio (opcional, para testing)
- Una URL pública donde esté desplegada tu PWA

## Paso 1: Desplegar tu PWA

Primero necesitas desplegar la PWA en una URL pública. Opciones recomendadas:

### Opción A: Vercel (Recomendado - Gratis)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Seguir las instrucciones en pantalla
```

### Opción B: Netlify

```bash
# Construir el proyecto
npm run build

# Subir la carpeta dist/ a Netlify
# https://app.netlify.com/drop
```

### Opción C: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Anota tu URL final**, la necesitarás para el siguiente paso.

## Paso 2: Generar Iconos

Necesitas convertir el `icon.svg` a PNG en todos los tamaños requeridos.

### Opción A: Usar una herramienta online

1. Ve a [Favicon Generator](https://realfavicongenerator.net/)
2. Sube `public/icon.svg`
3. Descarga todos los iconos generados
4. Colócalos en la carpeta `public/`

### Opción B: Usar ImageMagick (Línea de comandos)

```bash
# Instalar ImageMagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generar todos los tamaños
cd public
convert icon.svg -resize 72x72 icon-72.png
convert icon.svg -resize 96x96 icon-96.png
convert icon.svg -resize 128x128 icon-128.png
convert icon.svg -resize 144x144 icon-144.png
convert icon.svg -resize 152x152 icon-152.png
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 384x384 icon-384.png
convert icon.svg -resize 512x512 icon-512.png

# Maskable icons (con padding adicional)
convert icon.svg -resize 192x192 -gravity center -extent 230x230 icon-192-maskable.png
convert icon.svg -resize 512x512 -gravity center -extent 614x614 icon-512-maskable.png
```

### Opción C: Usar PWA Asset Generator

```bash
npm install -g pwa-asset-generator

pwa-asset-generator public/icon.svg public/ \
  --icon-only \
  --background "#f97316" \
  --padding "20%"
```

## Paso 3: Crear Screenshots

Necesitas capturas de pantalla de la app:

1. **Mobile (540x720px mínimo)**: Captura de la app en móvil
2. **Desktop (1280x720px mínimo)**: Captura de la app en desktop

Coloca estos archivos en `public/`:
- `screenshot-mobile-1.png`
- `screenshot-desktop-1.png`

## Paso 4: Usar Bubblewrap para crear APK

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) es la herramienta oficial de Google para convertir PWAs en Android apps.

### Instalar Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

### Inicializar el proyecto

```bash
bubblewrap init --manifest https://tu-dominio.com/manifest.json
```

Responde las preguntas:
- **Domain**: tu-dominio.com
- **Package Name**: com.tuempresa.matripuntos
- **App Name**: Matripuntos
- **Icon URL**: https://tu-dominio.com/icon-512.png
- **Theme Color**: #f97316
- **Background Color**: #ffffff

### Construir el APK

```bash
bubblewrap build
```

Esto generará un archivo `.apk` en la carpeta del proyecto.

## Paso 5: Firmar la App

Para publicar en Play Store, necesitas firmar el APK:

### Generar Keystore

```bash
keytool -genkey -v -keystore matripuntos-release-key.keystore \
  -alias matripuntos -keyalg RSA -keysize 2048 -validity 10000
```

**Guarda la contraseña en un lugar seguro.**

### Firmar el APK

```bash
bubblewrap build --signingKeyPath=matripuntos-release-key.keystore \
  --signingKeyAlias=matripuntos \
  --signingKeyPassword=TU_CONTRASEÑA
```

## Paso 6: Preparar para Play Store

### Información Necesaria

Prepara la siguiente información:

1. **Descripción Corta** (80 caracteres máx):
   ```
   Gamifica tu relación: gana puntos y canjéalos por momentos especiales
   ```

2. **Descripción Completa** (4000 caracteres máx):
   ```
   Matripuntos es una app para parejas que transforma las acciones del día a día en un juego divertido.

   ¿Cómo funciona?
   • Gana puntos por cuidar a tu pareja: hacer el desayuno, organizar una cita, dar un masaje, etc.
   • Canjea tus puntos por recompensas: desde una tarde libre hasta un fin de semana sin responsabilidades
   • Mantén un historial de todas tus acciones y recompensas
   • Sincronización en tiempo real entre ambas cuentas

   Características:
   ✨ 30 recompensas pre-cargadas listas para canjear
   💑 Sistema de vinculación de parejas con código único
   📊 Historial completo de transacciones
   🎯 Añade puntos por acciones personalizadas
   🔒 Datos seguros y privados entre la pareja

   Matripuntos ayuda a las parejas a:
   • Reconocer el esfuerzo del otro
   • Mantener viva la chispa de la relación
   • Crear momentos especiales juntos
   • Gamificar las tareas del hogar de forma divertida

   Descarga Matripuntos y comienza a ganar puntos con tu pareja hoy mismo.
   ```

3. **Categoría**: Estilo de vida

4. **Screenshots**: Mínimo 2 capturas de pantalla (ya preparadas)

5. **Gráfico de función** (1024x500px): Banner promocional

6. **Política de privacidad**: URL donde expliques cómo manejas los datos

### Crear Política de Privacidad

Crea un archivo `PRIVACY_POLICY.md` y publícalo en tu web. Ejemplo:

```markdown
# Política de Privacidad de Matripuntos

Última actualización: [Fecha]

## Información que recopilamos
- Email (para autenticación)
- Nombre de usuario
- Datos de parejas y transacciones

## Cómo usamos la información
Los datos se usan únicamente para proporcionar el servicio de Matripuntos.
No compartimos información con terceros.

## Seguridad
Usamos Supabase con cifrado para almacenar datos de forma segura.

## Contacto
Para preguntas: [tu-email]
```

## Paso 7: Subir a Play Store

1. Ve a [Google Play Console](https://play.google.com/console)
2. Crea una nueva aplicación
3. Completa toda la información requerida
4. Sube el APK firmado
5. Completa el cuestionario de contenido
6. Establece precio (gratis recomendado)
7. Configura países de distribución
8. Envía para revisión

**Tiempo de revisión**: Normalmente 1-7 días.

## Paso 8: Verificación de Sitio Web

Para que tu TWA funcione correctamente, debes verificar tu dominio:

1. En Play Console, ve a "App Integrity"
2. Copia el SHA-256 fingerprint
3. Crea un archivo `.well-known/assetlinks.json` en tu dominio raíz:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tuempresa.matripuntos",
    "sha256_cert_fingerprints": ["TU_SHA256_FINGERPRINT"]
  }
}]
```

4. Verifica que funcione visitando:
   `https://tu-dominio.com/.well-known/assetlinks.json`

## Actualizaciones

Para actualizar la app:

```bash
# Actualizar el código
git pull

# Reconstruir
npm run build

# Redesplegar
vercel --prod

# Incrementar versión en bubblewrap
bubblewrap update
bubblewrap build --signingKeyPath=matripuntos-release-key.keystore

# Subir nueva versión a Play Console
```

## Checklist Final

Antes de enviar a revisión:

- [ ] PWA desplegada y accesible públicamente
- [ ] Manifest.json válido y accesible
- [ ] Todos los iconos generados (72, 96, 128, 144, 152, 192, 384, 512)
- [ ] Screenshots de alta calidad
- [ ] APK firmado generado
- [ ] Política de privacidad publicada
- [ ] Asset links configurado
- [ ] Descripción completa y atractiva
- [ ] Información de contacto
- [ ] Precio establecido
- [ ] Países de distribución configurados
- [ ] Clasificación de contenido completada

## Recursos Útiles

- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [PWA Builder](https://www.pwabuilder.com/) - Alternativa a Bubblewrap
- [Play Store Guidelines](https://play.google.com/console/about/guides/releasewithconfidence/)
- [TWA Quick Start Guide](https://developers.google.com/web/android/trusted-web-activity/quick-start)

## Problemas Comunes

### "La app se abre en Chrome en lugar de pantalla completa"
- Verifica que `assetlinks.json` esté configurado correctamente
- Asegúrate de que el dominio en el manifest coincida con tu URL

### "No puedo firmar el APK"
- Verifica que Java JDK esté instalado
- Confirma que la ruta al keystore sea correcta

### "Manifest no válido"
- Usa un validador: https://manifest-validator.appspot.com/
- Verifica que todos los iconos existan

## Soporte

Si tienes problemas, puedes:
1. Consultar la documentación oficial de Bubblewrap
2. Preguntar en Stack Overflow con tag `trusted-web-activity`
3. Revisar los logs de Play Console para errores específicos

¡Buena suerte con tu publicación! 🚀
