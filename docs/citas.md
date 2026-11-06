# Agenda FORST

`/citas` conserva el header, footer, fuentes y colores del sitio. El anfitrión es Diego Acosta y su fotografía está en `public/assets/img/diego-acosta.jpg`. El nombre se cambia en `components/citas/AgendaCitas.tsx`.

## Conectar Google Calendar

1. Habilita Google Calendar API en tu proyecto de Google Cloud.
2. Crea un cliente OAuth de tipo **Aplicación web**. Autoriza exactamente:
   - `http://localhost:3000/api/google/callback`
   - `https://web-forst.vercel.app/api/google/callback`
3. Configura consentimiento con los scopes `https://www.googleapis.com/auth/calendar.freebusy` y `https://www.googleapis.com/auth/calendar.events.owned`. En modo de prueba añade como usuario de prueba el correo que organizará las reuniones.
4. En `.env.local`, agrega `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` y `GOOGLE_SETUP_SECRET`. No uses prefijos `NEXT_PUBLIC_`.
5. Genera la clave de configuración con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Guarda el resultado como `GOOGLE_SETUP_SECRET`.
6. Reinicia `npm run dev`, abre `http://localhost:3000/citas/conectar` e introduce esa clave. Autoriza con la cuenta del organizador.
7. El callback muestra una única vez la variable `GOOGLE_REFRESH_TOKEN`. Cópiala en `.env.local`, cierra la pestaña y elimina `GOOGLE_SETUP_SECRET` para deshabilitar el asistente. El servidor no escribe credenciales en el repositorio.
8. Reinicia el servidor. `/citas` consultará los horarios reales de tu calendario principal. Si usas uno secundario, debe ser tuyo, aceptar Google Meet y estar indicado en `GOOGLE_CALENDAR_ID`.
9. Para producción, configura las mismas credenciales privadas en Vercel, con `GOOGLE_REDIRECT_URI=https://web-forst.vercel.app/api/google/callback`, y vuelve a desplegar. Un refresh token autorizado con el mismo cliente puede utilizarse en ambos entornos. No necesitas dejar habilitado el asistente.

Los tokens de aplicaciones OAuth externas en estado **Testing**, con permisos de Calendar, normalmente caducan a los siete días. Antes de operar de manera permanente, revisa el estado de publicación y los requisitos de verificación que Google aplique a tu aplicación. Nunca compartas el secreto de cliente ni el refresh token por chat o capturas.

## Reglas de disponibilidad

- Zona horaria única: America/Lima (UTC−5), independiente de la zona del navegador.
- Lunes a viernes; 09:30, 10:30, 11:30, 13:30, 14:30, 15:30 y 16:30.
- Duración de 45 minutos; mínimo cuatro horas de anticipación; máximo 60 días.
- Cambia estas reglas en `lib/citas/horarios.ts`.
- Las ocupaciones y los días bloqueados se gestionan en Google Calendar como eventos que marquen ocupado. No se exponen los nombres ni el contenido de esos eventos.
- Al reservar se vuelve a consultar free/busy. El ID de evento por horario evita una segunda inserción simultánea desde este sitio. No es una transacción con cambios manuales ni con otras plataformas de reserva; dedica un calendario a este flujo cuando sea necesario.
- Google crea el evento, solicita Google Meet y envía las notificaciones a invitados con `sendUpdates=all`. El envío y la recepción del correo dependen de Google y de las preferencias del destinatario. Meet puede generarse de forma asíncrona; la interfaz nunca inventa un enlace.
- Los visitantes cancelan rechazando la invitación o contactando a FORST. Rechazarla no libera automáticamente la franja del organizador. Los eventos cancelados con el mismo ID pueden impedir reutilizar esa hora: el administrador debe restaurar/editar el evento o ofrecer otra franja.

## Comprobaciones

Pruebas sin credenciales: `node --test scripts/test-citas.mjs`. Comprueban fechas, zona horaria, anticipación, solapamientos, creación del evento y conflictos mediante respuestas de Google simuladas.

1. Sin credenciales: muestra la agenda como pendiente y ofrece Contacto; no anuncia reservas falsas.
2. Con la cuenta autorizada: crea un evento ocupado y verifica que su franja desaparezca.
3. Reserva con un correo de prueba propio y verifica evento, invitación y enlace Meet.
4. Comprueba dos intentos del mismo horario: solo se crea un evento.

El límite de consultas/intentos es en memoria por instancia (igual que otros formularios del proyecto). Para alto tráfico o abuso distribuido se necesita un contador compartido o protección adicional. No se ha agregado un proveedor nuevo de almacenamiento ni de CAPTCHA.

## Tipografías locales

Poppins, Montserrat y Lexend Giga se incluyen en `public/assets/fonts` con sus licencias OFL. `next/font/local` conserva las variables CSS del sitio y evita descargar fuentes durante cada compilación. Para regenerar estos archivos desde Google Fonts: `node scripts/vendor-fonts.mjs` (requiere red).
