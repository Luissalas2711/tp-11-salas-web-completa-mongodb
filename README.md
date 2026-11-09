# Trabajo práctico 11 - Edición de reservas

## 1. Punto de partida

Nombre de la entrega: tp-11-salas-web-completa-mongodb.
Punto de partida: copia del TP 10 terminado. Se conserva el sitio web, la API y la conexión con MongoDB, y se agrega la edición de reservas mediante reemplazo completo.

## 2. Herramientas y base de datos

- Node.js: v24.19.0
- Express: v5.2.1
- Mongoose: v9.11.2
- Base de datos: MongoDB Atlas Free (M0), `reservas_salas_u11`
- Colección: `reservas`

## 3. Preparación y ejecución

1. Instalar las dependencias con `npm install`.
2. Preparar una base gratuita en MongoDB Atlas con un usuario que tenga permiso para leer y guardar reservas.
3. Copiar `.env.example` como `.env` y colocar allí la dirección privada de conexión a la base.
4. Si la colección está vacía, crear desde el formulario las reservas de ejemplo indicadas en la consigna:
   - Ana Ejemplo: `ana@example.com`, Sala Norte, 2026-11-04, Mañana, 2 personas.
   - Bruno Ejemplo: `bruno@example.com`, Sala Sur, 2026-11-04, Tarde, 3 personas.
5. Iniciar el sitio con `npm start` y abrir `http://localhost:3000`.

Las fechas son ilustrativas. No se cargan reservas automáticamente ni se deben volver a crear si ya existen.

## 4. Conexión y comandos

La aplicación se conecta a MongoDB Atlas al iniciarse. En este proyecto se configuraron servidores DNS públicos para resolver la dirección de Atlas.

- Comprobar la conexión: `node --env-file .env scripts/comprobar-conexion.js`
- Revisar formato y errores de código: `npm run check`
- Iniciar la aplicación: `npm start`

## 5. Qué hace la aplicación

La aplicación permite crear, consultar y editar reservas desde el sitio web. También permite consultar y actualizar reservas desde la API. Ambas partes usan las mismas reservas guardadas en MongoDB.

Cada reserva tiene estudiante, email, sala, fecha, turno, cantidad de personas y estado. El estado puede ser `pendiente` o `confirmada`; una reserva nueva comienza como `pendiente`.

Para editar desde la web, se abre el detalle de una reserva y se presiona **Editar reserva**. El formulario muestra los datos actuales. Al guardar, se reemplaza la reserva completa y se vuelve al listado.

## 6. Reglas de edición

El formulario y la API verifican que los datos estén completos y sean válidos: email con `@`, sala y turno permitidos, personas entre 1 y 6, y estado `pendiente` o `confirmada`.

La API requiere los siete campos para un reemplazo completo con PUT. Si falta un campo o algún valor no es válido, responde con error y no modifica la reserva. Si un formulario web tiene errores, vuelve a mostrarse con los valores ingresados para poder corregirlos.

Un ID mal formado responde 400. Un ID con formato válido que no corresponde a una reserva existente responde 404. La fecha es ilustrativa: no se comprueba que sea futura. Tampoco se controla la disponibilidad de salas.

## 7. Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Abrir la edición desde el detalle | Se muestran los datos actuales de la reserva |
| Guardar cambios desde la web | Los cambios aparecen en la web y en la API |
| Reemplazo completo desde la API | Respondió 200 y los cambios se vieron en el formulario web |
| Reemplazo incompleto desde la API | Respondió 400 y la reserva mantuvo sus datos |
| Formulario web inválido con personas en 0 | Respondió 400, mostró el error y conservó los valores del formulario |
| Cancelar la edición | Los cambios no guardados no modificaron la reserva |
| ID mal formado al abrir la edición | Respondió 400 |
| ID válido sin reserva al abrir la edición | Respondió 404 |
| Reiniciar el servidor | La reserva editada continuó guardada |
| `npm run check` | Ejecutado; formato y revisión de código sin errores |

## 8. Cambios realizados en este trabajo

Se agregó el formulario para editar reservas existentes, el acceso **Editar reserva** desde el detalle y el guardado del reemplazo completo. Se puede editar la misma reserva desde la web o desde la API.

## 9. Protección de datos

El archivo `.env` contiene la dirección privada de la base y no debe publicarse. `.env.example` sirve como plantilla y no debe incluir contraseñas ni datos privados. Las reservas usadas para las pruebas son ficticias.

## 10. Direcciones para probar

Con el servidor iniciado en `http://localhost:3000`:

| Uso | Dirección |
|---|---|
| Ver el listado web | `/reservas` |
| Ver el detalle de una reserva | `/reservas/:id` |
| Abrir su formulario de edición | `/reservas/:id/editar` |
| Guardar la edición desde la web | El formulario envía los cambios a `/reservas/:id/editar` |
| Consultar las reservas desde la API | `/api/reservas` |
| Consultar una reserva desde la API | `/api/reservas/:id` |
| Reemplazar una reserva completa desde la API | PUT `/api/reservas/:id` |

Para probar el reemplazo con PUT, enviar los siete campos de la reserva en el cuerpo de la solicitud. No incluir la dirección privada de MongoDB ni información personal real en capturas o documentación.
