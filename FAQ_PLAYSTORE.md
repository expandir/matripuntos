# ❓ Preguntas Frecuentes - Publicación en Play Store

## General

### ¿Cuánto cuesta publicar en Play Store?
- **Registro único**: $25 USD (pago de una sola vez)
- **Mantenimiento de la app**: Gratis
- **Actualizaciones**: Gratis

### ¿Cuánto tarda Google en revisar mi app?
Típicamente **1-7 días**. En algunos casos puede ser:
- Rápido: 24-48 horas
- Normal: 3-5 días
- Lento: 7-14 días (si encuentran problemas)

### ¿Puedo publicar sin tener una empresa registrada?
Sí, puedes publicar como **desarrollador individual**. No necesitas ser una empresa.

## Técnicas

### ¿Por qué usar TWA (Trusted Web Activity) en lugar de una app nativa?
**Ventajas**:
- ✅ Una sola codebase (web + Android)
- ✅ Actualizaciones instantáneas (sin esperar revisión)
- ✅ Desarrollo más rápido
- ✅ Menor mantenimiento
- ✅ Funciona como app nativa

**Desventajas**:
- ❌ Solo Android (no iOS por ahora)
- ❌ Algunas APIs nativas limitadas
- ❌ Requiere conexión a internet

### ¿Qué es mejor: APK o AAB?
**AAB (Android App Bundle)** es el formato moderno recomendado por Google:
- Tamaño de descarga más pequeño
- Optimizado para cada dispositivo
- Requerido para apps nuevas (desde agosto 2021)

Bubblewrap genera **AAB por defecto**, así que estás cubierto.

### ¿Necesito Android Studio?
No es obligatorio para TWA. Bubblewrap hace todo desde la línea de comandos.

Pero es útil si quieres:
- Probar la app localmente
- Depurar problemas
- Ver logs detallados

### ¿Qué son los "maskable icons"?
Son iconos con un área segura que se ve bien en cualquier forma (círculo, cuadrado, redondeado).

**Safe zone**: El contenido importante debe estar en el 80% central del icono.

```
512x512 total
↓
410x410 safe zone (contenido visible siempre)
```

## Políticas y Legal

### ¿Necesito una política de privacidad?
**Sí, es obligatorio** si recopilas cualquier dato del usuario. Esto incluye:
- Email
- Nombre
- Datos de uso
- Información de la cuenta

Hemos incluido un template en `PRIVACY_POLICY.md`.

### ¿Dónde debo publicar la política de privacidad?
Debe estar **públicamente accesible en una URL**. Opciones:
- En tu propio sitio web: `https://tudominio.com/privacy-policy`
- En GitHub Pages: `https://usuario.github.io/matripuntos/privacy`
- En tu hosting actual

### ¿Necesito términos y condiciones?
**No es obligatorio**, pero es recomendable si:
- Hay interacción entre usuarios
- Ofreces servicios premium
- Quieres protegerte legalmente

### ¿Qué pasa si mi app es rechazada?
Google te dirá exactamente qué arreglar. Razones comunes:
- Política de privacidad no accesible
- Icons faltantes o incorrectos
- Información incompleta
- Violación de políticas (contenido inapropiado)

Puedes corregir y reenviar **sin penalización**.

## Iconos y Recursos

### ¿Cuáles son los tamaños de iconos requeridos?
**Mínimo obligatorio**:
- 512x512px (ícono de alta resolución)

**Recomendado** (incluido en nuestro manifest):
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### ¿Los iconos deben ser PNG o pueden ser JPG?
**Solo PNG** con fondo transparente (para icons regulares).

Para iconos maskable, puedes usar fondo sólido.

### ¿Necesito un banner/feature graphic?
**Sí**, es obligatorio. Tamaño: **1024x500px**

Debe incluir:
- Logo o ícono de la app
- Nombre de la app
- Breve descripción o tagline

### ¿Cuántas capturas de pantalla necesito?
**Mínimo**: 2 screenshots
**Máximo**: 8 screenshots

**Resoluciones aceptadas**:
- 16:9 (1920x1080, 1280x720)
- 9:16 (1080x1920, 540x720)

## Despliegue

### ¿Dónde debo desplegar mi PWA?
Necesitas un **hosting con HTTPS**. Opciones gratuitas:
- **Vercel** (recomendado, súper fácil)
- **Netlify** (también muy bueno)
- **Firebase Hosting**
- **GitHub Pages** (con dominio propio)
- **Cloudflare Pages**

### ¿Puedo usar un subdominio?
Sí, puedes usar subdominios:
- ✅ `app.tudominio.com`
- ✅ `matripuntos.tudominio.com`
- ✅ `tudominio.vercel.app`

### ¿Necesito un dominio personalizado?
**No es obligatorio**. Puedes usar:
- `tu-app.vercel.app`
- `tu-app.netlify.app`
- `tu-app.web.app` (Firebase)

Pero un dominio propio se ve más profesional.

### ¿Puedo cambiar la URL después de publicar?
Sí, pero necesitarás:
1. Actualizar el manifest.json
2. Actualizar el assetlinks.json
3. Reconstruir el APK
4. Subir una nueva versión a Play Store

## Digital Asset Links

### ¿Qué es assetlinks.json?
Es un archivo que **verifica que tu app Android pertenece a tu sitio web**.

Sin este archivo, tu TWA se abrirá en el navegador Chrome en lugar de fullscreen.

### ¿Dónde debo colocar assetlinks.json?
En la raíz de tu dominio:
```
https://tudominio.com/.well-known/assetlinks.json
```

**Importante**: Debe ser accesible sin autenticación.

### ¿Cómo obtengo mi SHA-256 fingerprint?
```bash
keytool -list -v -keystore matripuntos.keystore -alias matripuntos
```

Busca la línea que dice `SHA256:` y copia ese valor.

### ¿Cómo verifico que assetlinks funciona?
Usa la herramienta oficial de Google:
https://developers.google.com/digital-asset-links/tools/generator

## Actualizaciones

### ¿Cómo actualizo mi app después de publicarla?
**Para cambios en la web**:
1. Haz los cambios en tu código
2. `npm run build`
3. `vercel --prod` (o tu método de deploy)
4. ¡Listo! Los usuarios verán los cambios al abrir la app

**Para cambios en la app Android**:
1. Incrementa la versión en `package.json`
2. `bubblewrap update`
3. `bubblewrap build`
4. Sube el nuevo APK a Play Console

### ¿Con qué frecuencia debo actualizar?
**La PWA**: Cuando quieras, sin límite
**El APK de Android**: Solo cuando:
- Cambies el manifest.json
- Cambies iconos
- Cambies la URL base
- Agregues shortcuts nuevos

### ¿Los usuarios pierden datos al actualizar?
**No**, los datos están en Supabase (base de datos en la nube), no en el dispositivo.

## Monetización

### ¿Puedo cobrar por la app?
Sí, tienes dos opciones:
1. **App de pago**: Cobras una vez por la descarga
2. **Compras dentro de la app**: App gratis + features premium

Para ambas necesitas configurar **Google Play Billing**.

### ¿Puedo poner publicidad?
Sí, pero debes:
1. Declararlo en Play Console
2. Usar servicios compatibles (Google AdMob, etc.)
3. Cumplir con políticas de privacidad más estrictas

### ¿Puedo aceptar donaciones?
Sí, pero **fuera de Play Store**. Puedes:
- Agregar un link a Ko-fi, PayPal, etc.
- No usar el sistema de pagos de Google
- Ser transparente sobre las donaciones

## Problemas Comunes

### "Invalid package name"
El package name debe:
- Usar formato reverse domain: `com.empresa.app`
- Solo minúsculas
- Sin espacios ni caracteres especiales
- Ser único en Play Store

### "Manifest not found"
Verifica que:
- El manifest.json esté en la raíz de tu dominio
- Sea accesible: `https://tudominio.com/manifest.json`
- Tenga formato JSON válido

### "Icons not loading"
Asegúrate que:
- Los iconos existan en las rutas especificadas
- Sean accesibles públicamente
- Tengan los tamaños correctos
- Sean archivos PNG válidos

### "App opens in Chrome instead of standalone"
Esto significa que el Digital Asset Links no está configurado correctamente:
1. Verifica que `assetlinks.json` esté en `/.well-known/`
2. Confirma el SHA-256 fingerprint
3. Espera 24 horas para que Google lo indexe
4. Reinstala la app en tu teléfono

### "Build failed" en Bubblewrap
Problemas comunes:
- Java no instalado o versión incorrecta (necesitas JDK 8+)
- Android SDK no encontrado
- Keystore password incorrecta

Solución:
```bash
# Instalar dependencias
bubblewrap doctor

# Esto detecta y sugiere soluciones
```

## Seguridad

### ¿Es seguro guardar el keystore en git?
**¡NO!** El keystore debe:
- ❌ NO estar en git
- ❌ NO estar en repositorios públicos
- ✅ Estar en un lugar seguro
- ✅ Tener backup en múltiples lugares

Agrega al `.gitignore`:
```
*.keystore
*.jks
```

### ¿Qué pasa si pierdo mi keystore?
**No podrás actualizar tu app nunca más**. Tendrás que:
1. Crear una app completamente nueva
2. Usar un package name diferente
3. Perder todas las descargas/reseñas

Por eso es CRÍTICO hacer backups.

### ¿Debo compartir la contraseña del keystore?
Solo con personas de **máxima confianza** que necesiten:
- Subir actualizaciones
- Hacer builds de release

Usa un gestor de contraseñas (1Password, Bitwarden, etc.).

## Otros

### ¿Puedo publicar en iOS también?
No con TWA (es exclusivo de Android).

Para iOS necesitarías:
- Convertir a app nativa (React Native, Flutter)
- O esperar a que Apple soporte PWAs mejor
- O usar un servicio como Capacitor

### ¿Necesito permisos especiales?
Solo si usas:
- Cámara
- Micrófono
- Localización
- Notificaciones push
- Archivos del dispositivo

Matripuntos no usa nada de esto, así que no necesitas permisos.

### ¿Cuántas descargas necesito para monetizar?
Google AdMob normalmente requiere:
- Mínimo 1000 usuarios activos mensuales
- Pero puedes aplicar antes

Para compras dentro de la app: sin mínimo.

### ¿Puedo ver estadísticas de uso?
Sí, en Play Console verás:
- Descargas totales
- Usuarios activos
- Retención
- Crasheos
- Reseñas y calificaciones

Para análisis más profundos, agrega:
- Google Analytics
- Mixpanel
- PostHog

---

## 🆘 ¿Más Preguntas?

**Recursos oficiales**:
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [TWA Documentation](https://developers.google.com/web/android/trusted-web-activity)
- [Bubblewrap Issues](https://github.com/GoogleChromeLabs/bubblewrap/issues)

**Comunidades**:
- Stack Overflow: Tag `trusted-web-activity`
- Reddit: r/androiddev
- Discord: Web Dev communities

¡Buena suerte con tu publicación! 🚀
