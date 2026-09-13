# ShipNow - API REST con Node.js, Express y MongoDB

API desarrollada con **Node.js, Express y MongoDB** para la gestión de usuarios, órdenes, repartidores y entregas.

El proyecto implementa una **arquitectura por capas** y cuenta con generación de datos simulados, manejo profesional de errores, logging centralizado, documentación Swagger/OpenAPI, testing funcional, configuración por entornos, carga de archivos mediante Multer y containerización mediante Docker.

## Características principales

* Arquitectura por capas.
* Persistencia mediante MongoDB y Mongoose.
* Generación de datos simulados utilizando Faker.
* Manejo centralizado de errores mediante `AppError`.
* Diccionario centralizado de códigos de error.
* Middleware global para respuestas de error consistentes.
* Logging centralizado mediante Winston.
* Persistencia y rotación de archivos de logs.
* Diferentes niveles de logging según el entorno.
* Endpoints de prueba para validar el sistema de logging.
* Documentación interactiva mediante Swagger UI y OpenAPI 3.0.
* Tests funcionales con Mocha, Chai y Supertest.
* Entorno de testing separado del entorno de desarrollo.
* Endpoint de health check.
* Paginación y límites en endpoints de consulta de grandes volúmenes.
* Configuración mediante variables de entorno.
* Validación de variables críticas al iniciar la aplicación.
* **Carga de archivos mediante Multer.**
* **Carga de documentos asociados a usuarios.**
* **Carga de comprobantes asociados a entregas.**
* **Validación de tipo, campo y tamaño de archivos.**
* **Almacenamiento organizado de archivos en carpetas del servidor.**
* **Persistencia de metadatos de archivos en MongoDB.**
* Containerización mediante Docker.

---

# Tecnologías

* Node.js
* Express
* MongoDB
* Mongoose
* Faker
* bcrypt
* dotenv
* Winston
* winston-daily-rotate-file
* **Multer**
* swagger-jsdoc
* swagger-ui-express
* Mocha
* Chai
* Supertest
* Docker

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/BelenAmpuero/BackEndIII.git
```

Ingresar al proyecto:

```bash
cd BackEndIII
```

Instalar las dependencias:

```bash
npm install
```

---

# Variables de entorno

La aplicación utiliza variables de entorno para evitar almacenar configuraciones y credenciales sensibles directamente en el código fuente.

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080

MONGODB_URI=tu_url_de_mongodb

SESSION_SECRET=tu_secret

NODE_ENV=development

LOG_LEVEL=debug
```

## Variables utilizadas

* `PORT`: puerto en el que se ejecuta el servidor.
* `MONGODB_URI`: cadena de conexión utilizada para conectarse a MongoDB.
* `SESSION_SECRET`: secreto utilizado por los mecanismos de sesión cuando corresponde.
* `NODE_ENV`: define el entorno de ejecución. Puede ser `development`, `test` o `production`.
* `LOG_LEVEL`: define el nivel mínimo de logging.

## Entorno de testing

El proyecto utiliza un archivo `.env.test` separado para ejecutar las pruebas.

Ejemplo:

```env
PORT=8080

MONGODB_URI=tu_url_de_mongodb_de_test

NODE_ENV=test

LOG_LEVEL=error
```

El entorno de testing utiliza una base de datos independiente para evitar afectar los datos utilizados durante el desarrollo.

La aplicación carga `.env.test` automáticamente cuando:

```env
NODE_ENV=test
```

## Producción

No es necesario almacenar un `.env.production` dentro del repositorio.

En un entorno productivo, las variables deben ser proporcionadas externamente por el servidor, plataforma de despliegue o contenedor.

Ejemplo:

```env
PORT=8080

MONGODB_URI=tu_url_de_mongodb

NODE_ENV=production

LOG_LEVEL=info
```

De esta manera, las credenciales y configuraciones sensibles no forman parte del código fuente.

> Los archivos `.env` y `.env.test` contienen información sensible y no deben subirse al repositorio.

---

# Ejecución local

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor directamente:

```bash
npm start
```

Por defecto, la API se ejecuta en:

```text
http://localhost:8080
```

---

# Health Check

La API cuenta con un endpoint de health check para comprobar rápidamente que la aplicación se encuentra funcionando:

```http
GET /api/health
```

Ejemplo de respuesta:

```json
{
  "status": "OK",
  "environment": "development",
  "uptime": 123.456,
  "timestamp": "2026-09-04T23:00:00.000Z"
}
```

El endpoint informa:

* Estado de la aplicación.
* Entorno de ejecución.
* Tiempo de actividad del proceso.
* Timestamp de la consulta.

No expone información sensible ni credenciales.

---

# Documentación Swagger

El proyecto cuenta con documentación interactiva de la API utilizando **Swagger UI y OpenAPI 3.0**.

La documentación está disponible en:

```text
http://localhost:8080/api/docs
```

Desde Swagger UI es posible consultar y probar los endpoints documentados directamente desde el navegador utilizando **Try it out**.

La especificación OpenAPI también puede consultarse en formato JSON mediante:

```text
http://localhost:8080/api/docs-json
```

## Módulos documentados

Actualmente la documentación incluye:

* **Mocks**
* **Logger**
* **Users**
* **Orders**
* **Delivery Persons**
* **Deliveries**
* **Carga de archivos**

Los endpoints de carga utilizan documentación `multipart/form-data` e indican:

* Campo esperado para el archivo.
* Campos adicionales.
* Tipos de documento permitidos.
* Respuestas exitosas.
* Posibles errores.

Los schemas reutilizables se encuentran separados de la documentación de los endpoints.

La estructura de documentación es:

```text
src/

├── config/
│   └── docs/
│       └── swagger.config.js
│
└── docs/
    ├── schemas.yaml
    ├── mocks.yaml
    ├── users.yaml
    ├── orders.yaml
    ├── deliveryPersons.yaml
    ├── deliveries.yaml
    ├── logger.yaml
    └── uploads.yaml
```

Los schemas incluyen las entidades utilizadas por la aplicación:

* User
* Order
* OrderItem
* DeliveryPerson
* Delivery
* Document
* ErrorResponse
* SuccessResponse
* Respuestas relacionadas con Mocking

---

# Carga de archivos

El proyecto incorpora un sistema centralizado de carga de archivos utilizando **Multer**.

La funcionalidad permite recibir archivos mediante `multipart/form-data`, validarlos, almacenarlos en carpetas organizadas del servidor y registrar únicamente sus metadatos en MongoDB.

Los archivos cargados **no se almacenan dentro de MongoDB**.

## Configuración de Multer

La configuración de Multer se encuentra centralizada fuera de los routers:

```text
src/
└── config/
    └── multer.config.js
```

La configuración centralizada define:

* Carpetas de destino.
* Generación de nombres de archivos.
* Tipos MIME permitidos.
* Límite de tamaño.
* Configuración específica para documentos de usuarios.
* Configuración específica para comprobantes de entregas.

Los routers solamente utilizan los middlewares de carga ya configurados.

Esto permite mantener separada la configuración de almacenamiento de la definición de las rutas.

---

# Estructura de uploads

Los archivos cargados se organizan en carpetas según su finalidad:

```text
uploads/

├── users/
│   └── documents/
│
└── deliveries/
    └── receipts/
```

### Documentos de usuarios

Los documentos asociados a usuarios se almacenan en:

```text
uploads/users/documents/
```

### Comprobantes de entregas

Los comprobantes asociados a entregas se almacenan en:

```text
uploads/deliveries/receipts/
```

La carpeta `uploads/` está incluida en `.gitignore`.

Los archivos cargados durante la ejecución de la aplicación no forman parte del repositorio.

---

# Tipos de archivos permitidos

La configuración de Multer permite los siguientes tipos MIME:

```text
image/jpeg
image/png
application/pdf
```

Los archivos que no correspondan a los tipos permitidos son rechazados mediante el sistema centralizado de errores.

---

# Metadatos de archivos

El archivo físico se almacena en el servidor, mientras que MongoDB conserva únicamente sus metadatos.

Entre los datos registrados se encuentran:

* Nombre original.
* Nombre generado.
* Ruta del archivo.
* Tipo MIME.
* Tamaño.
* Tipo de documento.
* Fecha de carga.

El modelo `Document` permite centralizar esta información y asociarla con las entidades correspondientes.

De esta manera, MongoDB **no almacena el contenido binario del archivo**.

---

# Documentos de usuarios

El sistema permite asociar documentos a usuarios existentes.

## Endpoint

```http
POST /api/users/:id/documents
```

El endpoint recibe:

* ID del usuario.
* Archivo.
* Tipo de documento.

La petición utiliza:

```text
multipart/form-data
```

El campo del archivo esperado es:

```text
file
```

El tipo de documento se envía mediante:

```text
documentType
```

## Tipos de documento

Los documentos de usuario aceptados incluyen:

```text
user_document
driver_license
```

El tipo `delivery_proof` se utiliza para comprobantes de entrega.

## Ejemplo conceptual de petición

```text
POST /api/users/:id/documents

Content-Type: multipart/form-data
```

Campos:

```text
file: archivo.jpg
documentType: user_document
```

Antes de almacenar el documento, el sistema verifica que el usuario exista.

Si la operación es correcta:

1. Multer recibe el archivo.
2. Se valida el archivo.
3. Se verifica la existencia del usuario.
4. Se valida el tipo de documento.
5. Se crea el documento con sus metadatos.
6. Se asocia el documento al usuario.
7. Se guarda la información actualizada.
8. Se registra el evento mediante Winston.

---

# Comprobantes de entregas

El sistema también permite cargar comprobantes asociados a una entrega existente.

## Endpoint

```http
POST /api/deliveries/:id/receipt
```

La petición utiliza:

```text
multipart/form-data
```

El campo del archivo esperado es:

```text
file
```

A diferencia de los documentos de usuario, el tipo de documento no necesita enviarse desde el cliente, ya que el endpoint determina automáticamente que se trata de un:

```text
delivery_proof
```

Antes de almacenar el comprobante, el sistema verifica que la entrega exista.

Si la operación es correcta:

1. Multer recibe el archivo.
2. Se valida el archivo.
3. Se verifica la existencia de la entrega.
4. Se crea el documento con sus metadatos.
5. Se asocia el documento a la entrega.
6. Se actualiza la entrega.
7. Se registra el evento mediante Winston.

La entrega mantiene la referencia al documento mediante el campo:

```text
receipt
```

---

# Validaciones de archivos

El sistema incorpora validaciones específicas para las cargas de archivos.

Entre ellas:

* Archivo obligatorio.
* Tipo de archivo permitido.
* Tamaño máximo configurado.
* Campo de archivo esperado.
* Tipo de documento válido.
* Existencia de la entidad asociada.
* Errores durante el almacenamiento de metadatos.

Estas validaciones se integran con el sistema centralizado de errores de ShipNow.

---

# Errores de carga de archivos

Los errores relacionados con archivos utilizan el mismo formato general que el resto de la API.

Principales códigos:

## Documentos y archivos

* `FILE_REQUIRED` - 400
* `INVALID_FILE_TYPE` - 400
* `FILE_TOO_LARGE` - 400
* `INVALID_FILE_FIELD` - 400
* `INVALID_DOCUMENT_TYPE` - 400
* `DOCUMENT_SAVE_ERROR` - 500
* `FILE_SAVE_ERROR` - 500

## Entidades asociadas

* `USER_NOT_FOUND` - 404
* `DELIVERY_NOT_FOUND` - 404

Ejemplo:

```json
{
  "status": "error",
  "code": "FILE_REQUIRED",
  "message": "El archivo es obligatorio"
}
```

Esto mantiene la misma estructura de respuesta utilizada por el resto de los módulos de la API.

---

# Manejo de errores de Multer

Los errores producidos durante la carga de archivos son procesados mediante un middleware específico:

```text
src/
└── middlewares/
    └── uploadError.middleware.js
```

Este middleware permite traducir los errores generados durante el procesamiento de `multipart/form-data` al formato de errores utilizado por ShipNow.

De esta manera, errores como:

* archivo demasiado grande,
* campo de archivo inesperado,
* tipo de archivo no permitido,

no quedan expuestos como errores internos de Multer, sino que se integran al sistema centralizado de errores.

---

# Endpoints de Users

El módulo de Users permite gestionar los usuarios registrados en la aplicación.

Los usuarios cuentan con información personal y un rol que determina su tipo dentro del sistema.

Los endpoints disponibles se encuentran documentados en Swagger bajo la sección **Users**.

```http
GET /api/users

GET /api/users/:id

POST /api/users
```

Además, el módulo incorpora la carga de documentos:

```http
POST /api/users/:id/documents
```

Los endpoints realizan las validaciones correspondientes y utilizan el sistema centralizado de manejo de errores.

Los endpoints de listado cuentan con mecanismos de consulta controlada para evitar recuperar cantidades ilimitadas de registros.

---

# Endpoints de Orders

El módulo de Orders permite gestionar pedidos asociados a usuarios existentes.

Cada pedido contiene:

* Usuario asociado.
* Items.
* Cantidad.
* Precio.
* Total.
* Dirección de entrega.
* Estado.
* Prioridad.

## Obtener todos los pedidos

```http
GET /api/orders
```

Obtiene los pedidos registrados en MongoDB utilizando mecanismos de consulta controlada.

## Obtener un pedido por ID

```http
GET /api/orders/:id
```

Obtiene un pedido específico utilizando su identificador único.

El endpoint valida que el ID tenga un formato válido y devuelve un error si el pedido no existe.

## Crear un pedido

```http
POST /api/orders
```

Crea un nuevo pedido asociado a un usuario existente.

El servidor valida:

* Que el usuario exista.
* Que el ID del usuario sea válido.
* Que exista al menos un item.
* Que la cantidad de cada item sea un número entero mayor o igual a 1.
* Que el precio sea un número mayor o igual a 0.
* Que el estado sea válido.
* Que la prioridad sea válida.

El total se calcula automáticamente a partir de la cantidad y el precio de cada producto.

Ejemplo:

```json
{
  "user": "64f1a2b3c4d5e6f789012345",
  "items": [
    {
      "product": "Hamburguesa clásica",
      "quantity": 2,
      "price": 4500
    },
    {
      "product": "Papas fritas",
      "quantity": 1,
      "price": 2000
    }
  ],
  "deliveryAddress": "Av. Colón 1234, Córdoba",
  "status": "pending",
  "priority": "low"
}
```

El total se calcula automáticamente:

```text
2 × 4500 + 1 × 2000 = 11000
```

## Actualizar el estado de un pedido

```http
PATCH /api/orders/:id/status
```

Permite actualizar el estado de un pedido existente.

Body:

```json
{
  "status": "accepted"
}
```

Estados disponibles:

```text
pending
accepted
preparing
on_the_way
delivered
cancelled
```

Un pedido que ya se encuentra en estado `cancelled` no puede volver a modificarse.

---

# Endpoints de Delivery Persons

El módulo de Delivery Persons permite gestionar los repartidores utilizados por el sistema.

Los repartidores se encuentran asociados a usuarios y cuentan con información sobre el vehículo utilizado.

Los endpoints disponibles se encuentran documentados en Swagger bajo la sección **Delivery Persons**.

Las operaciones, filtros, paginación y validaciones correspondientes pueden consultarse directamente desde Swagger UI.

---

# Endpoints de Deliveries

El módulo de Deliveries permite gestionar las entregas asociadas a pedidos y repartidores.

Las entregas relacionan:

* Un pedido.
* Un repartidor.
* Un estado de entrega.
* Opcionalmente, un comprobante asociado.

Los endpoints disponibles se encuentran documentados en Swagger bajo la sección **Deliveries**.

## Cargar comprobante de entrega

```http
POST /api/deliveries/:id/receipt
```

Recibe un archivo mediante `multipart/form-data` utilizando el campo:

```text
file
```

El comprobante se almacena en:

```text
uploads/deliveries/receipts/
```

y sus metadatos se registran en MongoDB.

La entrega queda asociada al documento mediante el campo:

```text
receipt
```

---

# Performance y escalabilidad

Como parte de la preparación de la API para un entorno de ejecución más estable, se incorporaron medidas básicas de control de rendimiento.

## Paginación

Los endpoints que trabajan con grandes cantidades de registros utilizan mecanismos de paginación y límites para evitar recuperar colecciones completas de manera descontrolada.

Endpoints que trabajan con paginación:

* users
* orders
* deliveries
* deliveryPersons

La paginación utiliza parámetros como:

```text
page
limit
```

Ejemplo:

```http
GET /api/deliveryPersons?page=1&limit=5
```

También se contemplan filtros y criterios de ordenamiento en los endpoints que los soportan.

Los límites evitan que un cliente solicite cantidades excesivamente grandes de registros en una única consulta.

## Consultas controladas

Las consultas a MongoDB utilizan mecanismos como:

* `skip()`
* `limit()`
* `countDocuments()`
* filtros
* ordenamiento controlado

Esto permite reducir el volumen de información transferida y procesada en cada solicitud.

## Logging

Se evita utilizar logging excesivo en operaciones normales.

Los registros de aplicación se gestionan mediante Winston y el nivel puede modificarse según el entorno utilizando `LOG_LEVEL`.

---

# Manejo profesional de errores

El proyecto cuenta con un sistema centralizado de manejo de errores que utiliza:

* `AppError`.
* Un diccionario de códigos de error.
* Middleware global `errorHandler`.
* Middleware específico para errores de carga de archivos.

Los errores controlados son procesados por los middlewares y devueltos al cliente utilizando una estructura JSON consistente.

## Estructura de respuesta de error

```json
{
  "status": "error",
  "code": "INVALID_MOCK_QUANTITY",
  "message": "La cantidad de mocks solicitada no es válida"
}
```

Los campos representan:

* `status`: indica que la operación terminó con un error.
* `code`: identifica el tipo de error definido en el diccionario de errores.
* `message`: describe el motivo del error.

Los errores controlados utilizan el código HTTP correspondiente definido en el diccionario de errores.

---

# Principales códigos de error

## Users

* `USER_NOT_FOUND` - 404
* `USER_ALREADY_EXISTS` - 409
* `INVALID_USER_DATA` - 400

## Orders

* `ORDER_NOT_FOUND` - 404
* `INVALID_ORDER_DATA` - 400
* `INVALID_ORDER_STATUS` - 400
* `ORDER_ALREADY_CANCELLED` - 409
* `ORDER_CANNOT_BE_CANCELLED` - 400

## Delivery Person

* `DELIVERY_PERSON_NOT_FOUND` - 404
* `DELIVERY_PERSON_NOT_AVAILABLE` - 409
* `DELIVERY_PERSON_ALREADY_ASSIGNED` - 409
* `INVALID_DELIVERY_PERSON` - 400

## Delivery

* `DELIVERY_NOT_FOUND` - 404
* `DELIVERY_ALREADY_COMPLETED` - 409
* `INVALID_DELIVERY_STATUS` - 400
* `DELIVERY_ASSIGNMENT_FAILED` - 400

## Documents y archivos

* `FILE_REQUIRED` - 400
* `INVALID_FILE_TYPE` - 400
* `FILE_TOO_LARGE` - 400
* `INVALID_FILE_FIELD` - 400
* `INVALID_DOCUMENT_TYPE` - 400
* `DOCUMENT_SAVE_ERROR` - 500
* `FILE_SAVE_ERROR` - 500

## Mocks

* `INVALID_MOCK_QUANTITY` - 400
* `MOCK_GENERATION_ERROR` - 500
* `MOCK_DATABASE_ERROR` - 500

---

# Logging

El proyecto utiliza **Winston** como sistema centralizado de logging.

El logger permite registrar diferentes tipos de eventos según su importancia y facilita el monitoreo y debugging de la aplicación.

Además de los eventos generales de la API, el sistema registra eventos relacionados con la carga de archivos.

Entre ellos:

* Carga exitosa de documentos.
* Carga exitosa de comprobantes.
* Asociación de comprobantes con entregas.
* Errores durante la carga.
* Intentos de utilizar tipos de archivo no permitidos.
* Errores durante el guardado de metadatos.

## Niveles de log

| Nivel     | Descripción                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| `fatal`   | Fallas críticas que pueden impedir el funcionamiento de la aplicación.              |
| `error`   | Errores inesperados o fallas importantes durante una operación.                     |
| `warning` | Situaciones anómalas o advertencias que no necesariamente interrumpen la operación. |
| `info`    | Información general sobre el funcionamiento de la aplicación.                       |
| `http`    | Información relacionada con solicitudes HTTP.                                       |
| `debug`   | Información detallada útil durante el desarrollo y debugging.                       |

Los niveles se encuentran ordenados por prioridad:

```text
fatal
error
warning
info
http
debug
```

---

# Persistencia de logs

Los logs también se almacenan en archivos dentro de:

```text
logs/
```

La configuración utiliza archivos separados según su propósito.

## Archivo general

El archivo `combined` almacena los eventos registrados por la aplicación según el nivel configurado.

## Archivo de errores

El archivo de errores almacena los eventos correspondientes a:

```text
error
fatal
```

Esto permite consultar rápidamente los errores importantes de la aplicación.

---

# Rotación de archivos

Para evitar que los archivos de logs crezcan indefinidamente se utiliza:

```text
winston-daily-rotate-file
```

Los archivos se generan de forma rotativa utilizando la fecha.

Esto permite mantener separados los registros correspondientes a diferentes períodos.

---

# Endpoint de prueba del logger

Para comprobar el funcionamiento de Winston se incorporó un router específico de prueba:

```text
/api/loggerTest
```

Este módulo permite generar registros de todos los niveles disponibles.

> Estos endpoints son únicamente herramientas de validación del sistema de logging y no representan funcionalidades de negocio.

## DEBUG

```http
GET /api/loggerTest/debug
```

## HTTP

```http
GET /api/loggerTest/http
```

## INFO

```http
GET /api/loggerTest/info
```

## WARNING

```http
GET /api/loggerTest/warn
```

## ERROR

```http
GET /api/loggerTest/error
```

## FATAL

```http
GET /api/loggerTest/fatal
```

Los endpoints `/error` y `/fatal` registran eventos con esos niveles, pero no representan necesariamente un error HTTP.

Por este motivo, pueden responder `200 OK` después de generar correctamente el log.

---

# Testing

El proyecto cuenta con una suite de tests funcionales automatizados que valida los endpoints principales de ShipNow, cubriendo casos exitosos y errores esperados.

Herramientas utilizadas:

* **Mocha:** framework de pruebas para organizar y ejecutar los tests.
* **Chai:** librería de aserciones para validar estados HTTP, estructura del body y propiedades.
* **Supertest:** permite realizar peticiones HTTP sobre la aplicación Express sin abrir puertos manualmente.

## Entorno de testing

El entorno está separado del desarrollo mediante:

* Un archivo `.env.test`.
* Una base de datos independiente.
* Una estrategia de limpieza de datos para mantener las pruebas controladas y repetibles.

## Ejecutar los tests

```bash
npm test
```

## Módulos cubiertos

* **Users:** listado, obtención por ID, creación y validación de casos de error.
* **User Documents:** carga correcta de documentos, archivo faltante, tipo de documento inválido y entidad inexistente.
* **Orders:** creación, listado, obtención por ID, actualización de estados y validación de errores.
* **Deliveries:** listado, obtención, creación, actualización de estados y validaciones.
* **Delivery Receipts:** carga correcta de comprobantes, archivo faltante y entrega inexistente.
* **Mocks:** generación de usuarios y órdenes simuladas y persistencia de datos de prueba.
* **Logger:** verificación de los endpoints de prueba de logging.
* **Swagger:** comprobación de la accesibilidad de la documentación interactiva.

Las pruebas de carga utilizan archivos fixture ubicados dentro de:

```text
test/fixtures/
```

Por ejemplo:

```text
test/
└── fixtures/
    └── test-image.jpg
```

Los archivos utilizados como fixtures forman parte de los tests y no corresponden a archivos cargados por usuarios durante la ejecución normal de la aplicación.

---

# Docker

La aplicación está preparada para ejecutarse dentro de un contenedor Docker.

## Dockerfile

El proyecto utiliza una imagen oficial de Node.js como base.

El Dockerfile:

* Utiliza Node.js.
* Define `/app` como directorio de trabajo.
* Copia `package.json` y `package-lock.json`.
* Instala las dependencias necesarias para ejecución.
* Copia el código fuente.
* Expone el puerto `8080`.
* Ejecuta la aplicación mediante `npm start`.

## Construir la imagen

Desde la raíz del proyecto:

```bash
docker build -t shipnow .
```

Esto genera una imagen denominada:

```text
shipnow:latest
```

## Ejecutar el contenedor

Las variables de entorno se proporcionan externamente mediante un archivo `.env`.

```bash
docker run --env-file .env -p 8080:8080 --name shipnow-api shipnow
```

El puerto se publica de la siguiente manera:

```text
8080 del host → 8080 del contenedor
```

## Verificar el contenedor

Para comprobar que el contenedor está ejecutándose:

```bash
docker ps
```

La aplicación debe mostrar un mapeo similar a:

```text
0.0.0.0:8080->8080/tcp
```

## Logs del contenedor

Para consultar los logs:

```bash
docker logs shipnow-api
```

Al iniciar correctamente, se espera visualizar mensajes similares a:

```text
[info] MongoDB conectado
[info] Servidor escuchando en el puerto 8080
```

## Health check dentro de Docker

Con el contenedor ejecutándose:

```text
http://localhost:8080/api/health
```

## Swagger dentro de Docker

La documentación se encuentra disponible en:

```text
http://localhost:8080/api/docs
```

La API también puede probarse desde Swagger mediante **Try it out**.

---

# .dockerignore

El proyecto cuenta con un `.dockerignore` para evitar incorporar archivos innecesarios o sensibles a la imagen.

Actualmente se excluyen elementos como:

```text
node_modules
npm-debug.log

.env
.env.test
.env.development

.git
.gitignore

logs
uploads
coverage
tmp

README.md
```

Esto permite reducir el contenido de la imagen y evita incluir credenciales, logs generados, archivos subidos, archivos temporales y otros recursos que no son necesarios para ejecutar la aplicación.

Las variables de entorno son proporcionadas externamente al contenedor.

> La carpeta `uploads/` se excluye deliberadamente de la imagen base. Los archivos cargados por los usuarios son datos de ejecución y no forman parte del código fuente.

---

# Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
src/

├── config/
│   ├── docs/
│   │   └── swagger.config.js
│   │
│   └── multer.config.js
│
├── controllers/
├── docs/
├── middlewares/
│   ├── errorHandler.js
│   └── uploadError.middleware.js
│
├── mocks/
├── models/
│   ├── user.model.js
│   ├── order.models.js
│   ├── deliveryPerson.model.js
│   ├── delivery.model.js
│   └── document.model.js
│
├── repositories/
├── routes/
├── services/
├── utils/
│   └── logger/
│
├── app.js
└── server.js
```

## Config

Contiene la configuración de la aplicación y las variables de entorno.

También contiene la configuración de Swagger/OpenAPI y Multer:

```text
config/

├── docs/
│   └── swagger.config.js
│
└── multer.config.js
```

## Docs

Contiene los schemas y la documentación OpenAPI de los endpoints:

```text
docs/

├── schemas.yaml
├── mocks.yaml
├── users.yaml
├── orders.yaml
├── deliveryPersons.yaml
├── deliveries.yaml
├── logger.yaml
└── uploads.yaml
```

## Mocks

Generan datos ficticios utilizando Faker.

## Services

Contienen la lógica de negocio y coordinación de operaciones.

La lógica relacionada con carga y asociación de documentos se encuentra centralizada en el servicio correspondiente.

## Repositories

Se encargan de la comunicación con MongoDB.

## Models

Definen los esquemas de Mongoose y sus validaciones.

El modelo `Document` representa los metadatos de los archivos almacenados.

## Controllers

Reciben las solicitudes HTTP y coordinan las operaciones correspondientes.

## Routes

Definen los endpoints disponibles en la API.

Los routers utilizan la configuración centralizada de Multer sin contener directamente la configuración de almacenamiento.

## Middlewares

Contienen funcionalidades transversales de la aplicación, como:

* Manejo centralizado de errores.
* Registro de solicitudes HTTP.
* Manejo de errores producidos durante la carga de archivos.

## Utils

Contiene utilidades generales del proyecto, incluyendo:

* Configuración centralizada de Winston.
* Constantes.
* `AppError`.
* Diccionario de errores.

---

# Datos generados

El sistema permite generar:

* Usuarios con roles válidos.
* Órdenes asociadas a usuarios.
* Órdenes con estados y prioridades válidos.
* Repartidores asociados a usuarios.
* Entregas asociadas a órdenes y repartidores.

Los datos generados respetan los modelos y las constantes definidas en el proyecto.

---

# Pruebas con Swagger

Una vez iniciado el servidor, ingresar a:

```text
http://localhost:8080/api/docs
```

Desde Swagger UI se pueden ejecutar los endpoints disponibles utilizando el botón **Try it out**.

## Users

```text
GET /api/users
GET /api/users/:id
POST /api/users
POST /api/users/:id/documents
```

Para cargar un documento desde Swagger se utiliza `multipart/form-data`.

El campo del archivo es:

```text
file
```

y el campo adicional:

```text
documentType
```

## Orders

```text
GET /api/orders
GET /api/orders/:id
POST /api/orders
PATCH /api/orders/:id/status
```

## Delivery Persons

Consultar los endpoints disponibles en la sección **Delivery Persons**.

## Deliveries

Consultar los endpoints disponibles en la sección **Deliveries**.

Para cargar un comprobante:

```text
POST /api/deliveries/:id/receipt
```

El campo del archivo es:

```text
file
```

## Mocking

```text
GET /api/mocks/mockingusers?qty=5
GET /api/mocks/mockingorders?qty=5
POST /api/mocks/generatedata?qty=5
```

## Logger

```text
GET /api/loggerTest/debug
GET /api/loggerTest/http
GET /api/loggerTest/info
GET /api/loggerTest/warn
GET /api/loggerTest/error
GET /api/loggerTest/fatal
```

También pueden comprobarse errores de validación utilizando cantidades inválidas:

```text
GET /api/mocks/mockingusers?qty=0

GET /api/mocks/mockingusers?qty=-5

GET /api/mocks/mockingorders?qty=abc

POST /api/mocks/generatedata?qty=hola
```

---

# Git e información sensible

Los siguientes archivos y carpetas no deben subirse al repositorio:

```gitignore
node_modules/

.env
.env.test

logs/

uploads/

coverage/

tmp/
```

El archivo `.env.example` puede utilizarse como referencia para conocer las variables necesarias sin exponer valores reales.

Los archivos `.env` y `.env.test` pueden contener credenciales y configuraciones sensibles.

La carpeta `logs/` contiene archivos generados automáticamente por Winston y no forma parte del código fuente.

La carpeta `uploads/` contiene archivos cargados durante la ejecución de la aplicación y debe permanecer fuera del repositorio.

Los archivos utilizados como fixtures para testing, ubicados en `test/fixtures/`, son independientes de la carpeta `uploads/`.

---

# Estado de la aplicación

La aplicación se encuentra preparada para:

* Ejecución local.
* Testing funcional automatizado.
* Documentación mediante Swagger/OpenAPI.
* Generación de datos simulados.
* Manejo centralizado de errores.
* Logging centralizado y rotativo.
* Configuración por entornos.
* Health check.
* Consultas con paginación y límites.
* **Carga de documentos mediante Multer.**
* **Carga de comprobantes asociados a entregas.**
* **Validación de archivos y tipos de documento.**
* **Almacenamiento organizado de archivos.**
* **Persistencia de metadatos en MongoDB.**
* **Integración de errores de archivos con el sistema centralizado.**
* **Logging de eventos relacionados con uploads.**
* **Documentación de uploads mediante Swagger/OpenAPI.**
* **Tests funcionales de carga de archivos.**
* Ejecución dentro de un contenedor Docker.

La imagen Docker puede construirse mediante:

```bash
docker build -t shipnow .
```

y ejecutarse mediante:

```bash
docker run --env-file .env -p 8080:8080 --name shipnow-api shipnow
```
