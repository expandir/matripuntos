# ✅ Checklist de Publicación en Play Store

## 📋 Pre-requisitos

- [ ] Cuenta de Google Play Developer creada ($25 USD)
- [ ] Dominio propio o URL de hosting configurada
- [ ] ImageMagick instalado (para generar iconos)
- [ ] Node.js v18+ y npm instalados

## 🔧 Preparación Técnica

### 1. Generar Iconos
```bash
# Opción 1: Usar el script automático
npm run generate-icons

# Opción 2: Usar herramienta online
# Ve a https://realfavicongenerator.net/
```

- [ ] icon-72.png generado
- [ ] icon-96.png generado
- [ ] icon-128.png generado
- [ ] icon-144.png generado
- [ ] icon-152.png generado
- [ ] icon-192.png generado
- [ ] icon-384.png generado
- [ ] icon-512.png generado
- [ ] icon-192-maskable.png generado
- [ ] icon-512-maskable.png generado

### 2. Validar Manifest
```bash
npm run validate-manifest
```

- [ ] Manifest.json válido
- [ ] Todos los campos requeridos presentes
- [ ] URLs de iconos correctas

### 3. Crear Screenshots

#### Screenshots Mobile (mínimo 2, máximo 8)
**Tamaño recomendado**: 1080x1920px o 540x720px

- [ ] Screenshot del login/registro
- [ ] Screenshot del dashboard
- [ ] Screenshot del catálogo de recompensas
- [ ] Screenshot del historial (opcional)
- [ ] Screenshot del perfil (opcional)

Nombra los archivos: `screenshot-mobile-1.png`, `screenshot-mobile-2.png`, etc.

#### Screenshots Desktop (opcional)
**Tamaño recomendado**: 1920x1080px o 1280x720px

- [ ] Screenshot desktop (opcional)

### 4. Gráfico de Función
**Tamaño**: 1024x500px

- [ ] Crear banner promocional con logo y texto
- [ ] Guardar como `feature-graphic.png`

### 5. Construir Proyecto
```bash
npm run build
```

- [ ] Build exitoso sin errores
- [ ] Archivos generados en `dist/`
- [ ] Tamaño del bundle verificado

## 🌐 Despliegue

### Opción A: Vercel (Recomendado)
```bash
npm install -g vercel
vercel login
vercel
```

- [ ] Proyecto desplegado en Vercel
- [ ] URL personalizada configurada (opcional)
- [ ] Certificado SSL activo (automático)
- [ ] Variables de entorno configuradas

**URL del proyecto**: ___________________________

### Opción B: Netlify
- [ ] Build y deploy en Netlify
- [ ] Redirects configurados (`_redirects` file)
- [ ] Variables de entorno configuradas

**URL del proyecto**: ___________________________

### Opción C: Firebase Hosting
```bash
firebase login
firebase init hosting
firebase deploy
```

- [ ] Proyecto desplegado en Firebase
- [ ] Dominio personalizado configurado (opcional)

**URL del proyecto**: ___________________________

## 📄 Documentación Legal

### Política de Privacidad
- [ ] Archivo `PRIVACY_POLICY.md` completado
- [ ] Información de contacto actualizada
- [ ] Publicado en tu web (e.g., `/privacy-policy`)
- [ ] URL accesible públicamente

**URL Política de Privacidad**: ___________________________

### Términos y Condiciones (opcional pero recomendado)
- [ ] Documento creado
- [ ] Publicado en tu web
- [ ] URL accesible

**URL Términos**: ___________________________

## 📱 Crear APK con Bubblewrap

### Instalación
```bash
npm install -g @bubblewrap/cli
```

### Inicializar Proyecto TWA
```bash
bubblewrap init --manifest https://tu-dominio.com/manifest.json
```

Información requerida:
- **Domain**: ___________________________
- **Package Name**: com.tuempresa.matripuntos
- **App Name**: Matripuntos
- **Start URL**: /
- **Theme Color**: #f97316
- **Background Color**: #ffffff

- [ ] Proyecto TWA inicializado
- [ ] Configuración validada

### Generar Signing Key
```bash
keytool -genkey -v -keystore matripuntos-release.keystore \
  -alias matripuntos -keyalg RSA -keysize 2048 -validity 10000
```

**Información del Keystore (GUARDAR DE FORMA SEGURA)**:
- Contraseña: ___________________________
- Alias: matripuntos
- Ubicación del archivo: ___________________________

⚠️ **IMPORTANTE**: Nunca pierdas este archivo ni la contraseña. No podrás actualizar tu app sin ellos.

- [ ] Keystore generado
- [ ] Información guardada de forma segura
- [ ] Backup del keystore creado

### Construir APK Firmado
```bash
bubblewrap build --signingKeyPath=./matripuntos-release.keystore
```

- [ ] APK generado exitosamente
- [ ] APK firmado correctamente
- [ ] Tamaño del APK < 100MB

**Ubicación del APK**: ___________________________

## 🔒 Verificación de Dominio (Digital Asset Links)

Crea archivo `.well-known/assetlinks.json` en tu dominio:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tuempresa.matripuntos",
    "sha256_cert_fingerprints": ["TU_SHA256_AQUI"]
  }
}]
```

Para obtener el SHA-256:
```bash
keytool -list -v -keystore matripuntos-release.keystore
```

- [ ] Archivo assetlinks.json creado
- [ ] SHA-256 fingerprint agregado
- [ ] Archivo subido a `/.well-known/assetlinks.json`
- [ ] Verificado que sea accesible: https://tu-dominio.com/.well-known/assetlinks.json
- [ ] Validado en: https://developers.google.com/digital-asset-links/tools/generator

## 📝 Información para Play Console

### Información Básica
- **Nombre de la App**: Matripuntos - Gamifica tu Relación
- **Descripción Corta** (80 caracteres):
  ```
  Gamifica tu relación: gana puntos y canjéalos por momentos especiales
  ```
- **Descripción Completa**: Ver `PLAYSTORE_GUIDE.md` sección 6

### Categorización
- **Categoría**: Estilo de vida
- **Etiquetas**: pareja, relación, gamificación, puntos, recompensas

### Información de Contacto
- **Email**: ___________________________
- **Sitio Web**: ___________________________
- **Teléfono** (opcional): ___________________________

### Clasificación de Contenido
- [ ] Cuestionario de clasificación completado
- [ ] Clasificación asignada (probablemente: Para todos)

### Precio y Distribución
- **Precio**: Gratis
- **Compras dentro de la app**: No
- **Publicidad**: No
- **Países**: ___________________________ (o "Todos los países")

## 📤 Subida a Play Console

### 1. Crear Aplicación
- [ ] Nueva aplicación creada en Play Console
- [ ] Idioma predeterminado seleccionado (Español)
- [ ] Tipo de app: App

### 2. Configurar Ficha de Play Store

#### Detalles de la App
- [ ] Nombre completo ingresado
- [ ] Descripción corta agregada
- [ ] Descripción completa agregada

#### Recursos Gráficos
- [ ] Icono de app subido (512x512px)
- [ ] Gráfico de función subido (1024x500px)
- [ ] Capturas de pantalla mobile subidas (mínimo 2)
- [ ] Capturas de pantalla desktop subidas (opcional)

#### Categorización
- [ ] Categoría seleccionada
- [ ] Etiquetas agregadas
- [ ] Información de contacto completada

### 3. Configurar Lanzamiento en Producción

#### Subir APK/AAB
- [ ] APK subido a "Producción"
- [ ] Notas de la versión agregadas (en español)
- [ ] Código de versión: 1
- [ ] Nombre de versión: 1.0.0

#### Política de Privacidad
- [ ] URL de política de privacidad agregada
- [ ] Enlace validado y accesible

### 4. Cuestionario de Clasificación de Contenido
- [ ] Todas las preguntas respondidas honestamente
- [ ] Clasificación obtenida
- [ ] Certificado generado

### 5. Configuración de Precios y Distribución
- [ ] Precio configurado (Gratis)
- [ ] Países de distribución seleccionados
- [ ] Consentimientos legales aceptados

### 6. Configuración de Aplicación
- [ ] Email de contacto público agregado
- [ ] Categoría confirmada
- [ ] Etiquetas confirmadas

## 🚀 Envío para Revisión

### Pre-envío
- [ ] Todas las secciones marcadas como "Completas"
- [ ] Sin errores pendientes en el dashboard
- [ ] Preview de la ficha de Play Store verificado

### Envío
- [ ] Botón "Enviar para revisión" presionado
- [ ] Confirmación recibida
- [ ] Email de confirmación recibido

**Fecha de envío**: ___________________________

### Post-envío
- [ ] Revisar estado diariamente
- [ ] Responder a cualquier solicitud de Google Play
- [ ] Esperar aprobación (típicamente 1-7 días)

## 🎉 Después de la Aprobación

- [ ] App visible en Play Store
- [ ] Link compartido en redes sociales (opcional)
- [ ] Monitorear reseñas y calificaciones
- [ ] Configurar alertas de crasheos (si aplica)

**URL en Play Store**: ___________________________

## 🔄 Actualizaciones Futuras

Para actualizar la app:

1. **Incrementar versión en package.json**
   ```json
   "version": "1.1.0"
   ```

2. **Reconstruir y redesplegar web**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Actualizar TWA**
   ```bash
   bubblewrap update
   bubblewrap build --signingKeyPath=./matripuntos-release.keystore
   ```

4. **Subir nuevo APK a Play Console**
   - Ir a "Lanzamiento en Producción"
   - Crear nueva versión
   - Subir APK actualizado
   - Agregar notas de versión
   - Enviar actualización

## 📊 Métricas a Monitorear

Después del lanzamiento, monitorea:
- [ ] Descargas diarias/mensuales
- [ ] Calificación promedio (objetivo: >4.0 ⭐)
- [ ] Reseñas de usuarios
- [ ] Tasa de retención
- [ ] Crasheos/errores

## 🆘 Recursos de Ayuda

- Play Console Dashboard: https://play.google.com/console
- Documentación de TWA: https://developers.google.com/web/android/trusted-web-activity
- Bubblewrap Docs: https://github.com/GoogleChromeLabs/bubblewrap
- Validador de Manifest: https://manifest-validator.appspot.com/
- Asset Links Validator: https://developers.google.com/digital-asset-links/tools/generator

## ✅ Estado Final

- [ ] App publicada en Play Store
- [ ] Todos los elementos del checklist completados
- [ ] Documentación guardada de forma segura
- [ ] Keystore respaldado en lugar seguro

---

**¡Felicidades por publicar tu app! 🎉**

Recuerda: La primera publicación es la más difícil. Las actualizaciones son mucho más sencillas.
