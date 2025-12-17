# Notificaciones Push en MatriPuntos

Este documento explica cómo funcionan las notificaciones push en la aplicación y cómo configurarlas correctamente.

## Características Implementadas

### 1. Sistema de Chat en Tiempo Real
- Mensajes instantáneos entre parejas
- Indicadores de lectura (check simple y doble check)
- Notificaciones push cuando llega un nuevo mensaje

### 2. Notificaciones Push
- Notificaciones del navegador usando Web Push API
- Soporte para Chrome, Firefox, Edge y Safari (iOS 16.4+)
- Notificaciones para:
  - Nuevos mensajes de chat
  - Puntos añadidos
  - Logros desbloqueados
  - Recompensas canjeadas

### 3. Gestión de Notificaciones
- Activar/desactivar notificaciones desde el perfil
- Prueba de notificaciones
- Estado visual de suscripción
- Soporte para múltiples dispositivos

## Configuración de VAPID Keys

Para que las notificaciones push funcionen correctamente, necesitas generar un par de claves VAPID (Voluntary Application Server Identification).

### Paso 1: Generar VAPID Keys

Puedes generar las claves VAPID usando web-push:

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Esto generará:
- **Public Key**: Para usar en el frontend
- **Private Key**: Para usar en el backend (Edge Function)

### Paso 2: Configurar la Clave Pública

Actualiza el archivo `src/lib/pushNotificationService.ts` con tu clave pública:

```typescript
const VAPID_PUBLIC_KEY = 'TU_CLAVE_PUBLICA_AQUI';
```

### Paso 3: Configurar la Clave Privada

La clave privada se usa en la Edge Function. Por razones de seguridad, debes guardarla como una variable de entorno en Supabase:

1. Ve a tu dashboard de Supabase
2. Navega a Settings > Edge Functions > Secrets
3. Agrega una nueva variable:
   - Name: `VAPID_PRIVATE_KEY`
   - Value: Tu clave privada VAPID

### Paso 4: Actualizar la Edge Function

La Edge Function necesita ser actualizada para usar web-push correctamente con las VAPID keys. Esto requiere actualizar el código de la función para usar la librería web-push de npm.

## Cómo Usar las Notificaciones

### Para Usuarios

1. **Activar Notificaciones**
   - Ve a tu Perfil
   - Busca la sección "Notificaciones Push"
   - Haz clic en "Activar Notificaciones"
   - Acepta el permiso cuando el navegador lo solicite

2. **Probar Notificaciones**
   - Una vez activadas, haz clic en "Enviar Prueba"
   - Deberías recibir una notificación de prueba

3. **Recibir Notificaciones**
   - Recibirás notificaciones automáticamente cuando:
     - Tu pareja te envíe un mensaje
     - Ganes puntos
     - Desbloquees un logro
     - Canjees una recompensa

### Para Desarrolladores

#### Enviar Notificaciones Personalizadas

Usa las funciones helper en `src/lib/sendPushNotification.ts`:

```typescript
import { sendPushNotification } from './lib/sendPushNotification';

await sendPushNotification({
  userId: 'user-id',
  title: 'Título de la notificación',
  body: 'Contenido del mensaje',
  url: '/ruta-destino',
  icon: '/icono.png',
  tag: 'categoria-notificacion'
});
```

#### Funciones Predefinidas

```typescript
// Notificación de chat
await sendChatMessageNotification(recipientUserId, senderName, messageContent);

// Notificación de puntos
await sendPointsAddedNotification(userId, points, description);

// Notificación de logro
await sendAchievementUnlockedNotification(userId, achievementTitle);

// Notificación de recompensa
await sendRewardRedeemedNotification(userId, rewardTitle);
```

## Estructura de Archivos

```
src/
├── lib/
│   ├── chatService.ts              # Servicio de chat
│   ├── pushNotificationService.ts  # Servicio de notificaciones
│   └── sendPushNotification.ts     # Helpers para enviar notificaciones
├── components/
│   ├── ChatBox.tsx                 # Componente de chat
│   ├── ChatMessage.tsx             # Mensaje individual
│   └── NotificationSettings.tsx    # Configuración de notificaciones
└── pages/
    └── Chat.tsx                    # Página de chat

public/
└── sw.js                           # Service Worker

supabase/
├── functions/
│   └── send-push-notification/     # Edge Function para enviar notificaciones
└── migrations/
    ├── create_chat_system.sql      # Migración de chat
    └── create_push_subscriptions_table.sql  # Migración de notificaciones
```

## Base de Datos

### Tabla `messages`
- `id`: UUID único del mensaje
- `couple_id`: ID de la pareja
- `sender_id`: ID del usuario que envió el mensaje
- `content`: Contenido del mensaje
- `read`: Si el mensaje ha sido leído
- `created_at`: Fecha de creación

### Tabla `push_subscriptions`
- `id`: UUID único de la suscripción
- `user_id`: ID del usuario
- `endpoint`: URL del endpoint de push
- `p256dh_key`: Clave pública de encriptación
- `auth_key`: Clave de autenticación
- `user_agent`: Información del navegador
- `created_at`: Fecha de creación
- `last_used`: Última vez que se usó

## Seguridad

- Las suscripciones están protegidas con RLS
- Solo los usuarios autenticados pueden crear suscripciones
- Los mensajes solo son visibles para miembros de la pareja
- Las notificaciones solo se envían a dispositivos del usuario correcto

## Solución de Problemas

### Las notificaciones no funcionan

1. Verifica que el navegador soporte notificaciones push
2. Asegúrate de que los permisos estén concedidos
3. Verifica que las VAPID keys estén configuradas correctamente
4. Revisa la consola del navegador para errores
5. Asegúrate de que el Service Worker esté registrado correctamente

### El Service Worker no se registra

1. Verifica que el archivo `public/sw.js` exista
2. Asegúrate de que la aplicación se sirva sobre HTTPS (o localhost)
3. Revisa la pestaña "Application" en DevTools de Chrome

### Las notificaciones no llegan

1. Verifica que el usuario tenga una suscripción activa
2. Revisa los logs de la Edge Function en Supabase
3. Asegúrate de que la VAPID private key esté configurada en Supabase
4. Verifica que no hayas bloqueado las notificaciones en el navegador

## Próximas Mejoras

- [ ] Implementar web-push correctamente en la Edge Function
- [ ] Agregar notificaciones por categoría
- [ ] Permitir configurar qué notificaciones recibir
- [ ] Agregar sonidos personalizados
- [ ] Implementar notificaciones agrupadas
- [ ] Agregar imágenes en las notificaciones
