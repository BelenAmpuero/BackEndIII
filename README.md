# ShipNow - API REST con Node.js, Express y MongoDB

API REST desarrollada con **Node.js, Express y MongoDB** para la gestión de usuarios, órdenes, repartidores y entregas.

El proyecto implementa una **arquitectura por capas**, persistencia mediante MongoDB y Mongoose, generación de datos simulados, manejo centralizado de errores, logging con Winston, documentación Swagger/OpenAPI, testing funcional, configuración por entornos, carga de archivos mediante Multer y ejecución mediante Docker y Docker Compose.

---

# Características principales

* Arquitectura por capas.
* Separación de responsabilidades mediante **Controllers, Services y Repositories**.
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
* Paginación, filtros y límites máximos en endpoints de consulta.
* Configuración mediante variables de entorno.
* Validación de variables críticas al iniciar la aplicación.
* Carga de archivos mediante Multer.
* Carga de documentos asociados a usuarios.
* Carga de comprobantes asociados a entregas.
* Validación de tipo, campo y tamaño de archivos.
* Almacenamiento organizado de archivos.
* Persistencia de metadatos de archivos en MongoDB.
* Containerización mediante Docker.
* Orquestación de API y MongoDB mediante Docker Compose.
* Healthcheck de MongoDB para controlar el inicio de la API.

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
* Multer
* swagger-jsdoc
* swagger-ui-express
* Mocha
* Chai
* Supertest
* Docker
* Docker Compose

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

La aplicación utiliza variables de entorno para evitar almacenar configuraciones y credenciales directamente en el código fuente.

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
MONGODB_URI=tu_url_de_mongodb
NODE_ENV=development
LOG_LEVEL=debug
```

## Variables utilizadas

* `PORT`: puerto en el que se ejecuta el servidor.
* `MONGODB_URI`: cadena de conexión utilizada para conectarse a MongoDB.
* `NODE_ENV`: define el entorno de ejecución. Puede ser `development`, `test` o `production`.
* `LOG_LEVEL`: define el nivel mínimo de logging.

Los archivos `.env` y `.env.test` se encuentran excluidos del repositorio mediante `.gitignore`.

---

# Entorno de testing

El proyecto utiliza un archivo `.env.test` separado para ejecutar las pruebas.

Ejemplo:

```env
PORT=8080
MONGODB_URI=tu_url_de_mongodb_de_test
NODE_ENV=test
LOG_LEVEL=error
```

Cuando `NODE_ENV=test`, la aplicación carga automáticamente `.env.test`.

El entorno de testing utiliza una base de datos independiente para evitar afectar los datos utilizados durante el desarrollo.

---

# Producción

En un entorno productivo, las variables de entorno deben ser proporcionadas externamente por el servidor, plataforma de despliegue o contenedor.

Ejemplo:

```env
PORT=8080
MONGODB_URI=tu_url_de_mongodb
NODE_ENV=production
LOG_LEVEL=info
```

No se deben almacenar credenciales ni configuraciones sensibles directamente en el código fuente.

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

La API cuenta con un endpoint de health check:

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

El endpoint permite comprobar:

* Estado de la aplicación.
* Entorno de ejecución.
* Tiempo de actividad del proceso.
* Timestamp de la consulta.

No expone credenciales ni información sensible.

---

# Documentación Swagger

La API cuenta con documentación interactiva mediante **Swagger UI y OpenAPI 3.0**.

Con la aplicación ejecutándose, acceder a:

```text
http://localhost:8080/api/docs
```

La especificación OpenAPI también está disponible en:

```text
http://localhost:8080/api/docs-json
```

Desde Swagger UI es posible consultar y probar los endpoints mediante **Try it out**.

## Módulos documentados

* Mocks
* Logger
* Users
* Orders
* Delivery Persons
* Deliveries
* Uploads

Los endpoints de carga utilizan `multipart/form-data` y documentan:

* Campo esperado para el archivo.
* Tipos de documento.
* Tipos MIME permitidos.
* Respuestas exitosas.
* Posibles errores.

La documentación OpenAPI se organiza mediante archivos separados:

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

---

# Carga de archivos

El proyecto incorpora un sistema centralizado de carga de archivos utilizando **Multer**.

La funcionalidad permite recibir archivos mediante `multipart/form-data`, validarlos, almacenarlos en carpetas organizadas y registrar sus metadatos en MongoDB.

Los archivos físicos **no se almacenan dentro de MongoDB**.

MongoDB conserva únicamente la información descriptiva y las referencias correspondientes.

## Configuración de Multer

La configuración se encuentra centralizada en:

```text
src/
└── config/
    └── multer.config.js
```

La configuración define:

* Carpetas de destino.
* Generación de nombres de archivo.
* Tipos MIME permitidos.
* Límite de tamaño.
* Configuración para documentos de usuarios.
* Configuración para comprobantes de entregas.

Los routers utilizan los middlewares de carga configurados y no contienen directamente la configuración de almacenamiento.

---

# Estructura de uploads

Los archivos se organizan según su finalidad:

```text
uploads/
├── users/
│   └── documents/
│
└── deliveries/
    └── receipts/
```

## Documentos de usuarios

```text
uploads/users/documents/
```

## Comprobantes de entregas

```text
uploads/deliveries/receipts/
```

La carpeta `uploads/` está excluida del repositorio mediante `.gitignore`.

Los archivos generados durante la ejecución no forman parte del código fuente.

---

# Tipos de archivos permitidos

Multer permite los siguientes tipos MIME:

```text
image/jpeg
image/png
application/pdf
```

El tamaño máximo permitido es de **5 MB**.

Los archivos que no cumplen las validaciones son rechazados mediante el sistema centralizado de errores.

---

# Metadatos de archivos

El archivo físico se almacena en el servidor, mientras que MongoDB conserva sus metadatos.

Entre los datos registrados se encuentran:

* Nombre original.
* Nombre generado.
* Ruta del archivo.
* Tipo MIME.
* Tamaño.
* Tipo de documento.
* Fecha de carga.

El modelo `Document` centraliza esta información y permite asociarla con las entidades correspondientes.

---

# Documentos de usuarios

Los documentos pueden asociarse a usuarios existentes mediante:

```http
POST /api/users/:id/documents
```

La petición utiliza:

```text
multipart/form-data
```

Campos:

```text
file: archivo
documentType: tipo de documento
```

Tipos de documento admitidos:

```text
user_document
driver_license
```

Antes de almacenar el documento se verifica que el usuario exista.

Flujo de procesamiento:

1. Multer recibe el archivo.
2. Se valida el archivo.
3. Se verifica la existencia del usuario.
4. Se valida el tipo de documento.
5. Se crea el documento con sus metadatos.
6. Se asocia el documento al usuario.
7. Se actualiza la información correspondiente.
8. Se registra el evento mediante Winston.

---

# Comprobantes de entregas

Los comprobantes se cargan mediante:

```http
POST /api/deliveries/:id/receipt
```

La petición utiliza:

```text
multipart/form-data
```

Campo:

```text
file
```

El endpoint determina automáticamente que el documento corresponde al tipo:

```text
delivery_proof
```

Antes de almacenar el comprobante se verifica que la entrega exista.

Flujo:

1. Multer recibe el archivo.
2. Se valida el archivo.
3. Se verifica la existencia de la entrega.
4. Se crea el documento con sus metadatos.
5. Se asocia el documento a la entrega.
6. Se actualiza la entrega.
7. Se registra el evento mediante Winston.

La entrega mantiene la referencia al documento mediante:

```text
receipt
```

---

# Validaciones de archivos

El sistema contempla validaciones para:

* Archivo obligatorio.
* Tipo de archivo permitido.
* Tamaño máximo.
* Campo de archivo esperado.
* Tipo de documento válido.
* Existencia de la entidad asociada.
* Errores durante el almacenamiento.
* Errores durante el guardado de metadatos.

---

# Errores de carga de archivos

Los errores de archivos utilizan el mismo formato general que el resto de la API.

Principales códigos:

```text
FILE_REQUIRED           - 400
INVALID_FILE_TYPE       - 400
FILE_TOO_LARGE          - 400
INVALID_FILE_FIELD      - 400
INVALID_DOCUMENT_TYPE   - 400
DOCUMENT_SAVE_ERROR     - 500
FILE_SAVE_ERROR         - 500
```

Errores relacionados con las entidades:

```text
USER_NOT_FOUND          - 404
DELIVERY_NOT_FOUND      - 404
```

Ejemplo:

```json
{
  "status": "error",
  "code": "FILE_REQUIRED",
  "message": "El archivo es obligatorio"
}
```

---

# Manejo de errores de Multer

Los errores producidos durante el procesamiento de archivos son gestionados mediante:

```text
src/
└── middlewares/
    └── uploadError.middleware.js
```

Este middleware traduce los errores producidos durante `multipart/form-data` al formato de errores utilizado por ShipNow.

De esta manera, errores como:

* Archivo demasiado grande.
* Campo inesperado.
* Tipo de archivo no permitido.

se integran al sistema centralizado de errores.

---

# Endpoints principales

## Users

```http
GET /api/users
GET /api/users/:id
POST /api/users
POST /api/users/:id/documents
```

Los endpoints de listado utilizan paginación y límites para controlar la cantidad de registros recuperados.

## Orders

```http
GET /api/orders
GET /api/orders/:id
POST /api/orders
PATCH /api/orders/:id/status
```

## Delivery Persons

Los endpoints se encuentran documentados en Swagger bajo la sección:

```text
Delivery Persons
```

## Deliveries

Los endpoints se encuentran documentados en Swagger bajo la sección:

```text
Deliveries
```

Incluye la carga de comprobantes:

```http
POST /api/deliveries/:id/receipt
```

---

# Paginación y límites

Los endpoints que trabajan con grandes cantidades de registros utilizan paginación:

```text
GET /api/users
GET /api/orders
GET /api/deliveryPersons
GET /api/deliveries
```

Parámetros:

```text
page
limit
```

Configuración:

```text
Valor predeterminado: 10
Valor mínimo: 1
Valor máximo: 100
```

Ejemplo:

```http
GET /api/users?page=1&limit=5
```

El mismo límite máximo se aplica a los demás endpoints paginados.

Si el cliente solicita un `limit` superior a `100`, se utiliza automáticamente el máximo permitido.

Las consultas utilizan mecanismos como:

* `skip()`
* `limit()`
* `countDocuments()`
* filtros
* ordenamiento controlado

Esto permite limitar el volumen de información procesada y transferida en cada solicitud.

---

# Manejo profesional de errores

El proyecto utiliza un sistema centralizado compuesto por:

* `AppError`.
* Diccionario de códigos de error.
* Middleware global `errorHandler`.
* Middleware específico para errores de carga.

Los errores controlados utilizan una estructura JSON consistente:

```json
{
  "status": "error",
  "code": "INVALID_MOCK_QUANTITY",
  "message": "La cantidad de mocks solicitada no es válida"
}
```

El middleware global también contempla errores inesperados y responde con un error HTTP `500` en formato JSON.

---

# Logging

El proyecto utiliza **Winston** como sistema centralizado de logging.

Los niveles disponibles son:

```text
fatal
error
warning
info
http
debug
```

El nivel utilizado puede configurarse mediante:

```env
LOG_LEVEL=debug
```

En producción se recomienda utilizar un nivel más restrictivo, por ejemplo:

```env
LOG_LEVEL=info
```

El sistema registra, entre otros eventos:

* Operaciones HTTP.
* Errores de aplicación.
* Errores inesperados.
* Carga de documentos.
* Carga de comprobantes.
* Errores de carga.
* Eventos de debugging.

---

# Persistencia y rotación de logs

Los logs se almacenan en:

```text
logs/
```

La aplicación utiliza `winston-daily-rotate-file` para realizar la rotación de archivos según la fecha.

La carpeta `logs/` se encuentra excluida del repositorio.

---

# Endpoint de prueba del logger

El router de prueba se encuentra en:

```text
/api/loggerTest
```

Endpoints:

```http
GET /api/loggerTest/debug
GET /api/loggerTest/http
GET /api/loggerTest/info
GET /api/loggerTest/warn
GET /api/loggerTest/error
GET /api/loggerTest/fatal
```

Estos endpoints sirven para comprobar el funcionamiento del sistema de logging y no representan funcionalidades de negocio.

---

# Testing

El proyecto cuenta con una suite de tests funcionales automatizados utilizando:

* Mocha
* Chai
* Supertest

## Ejecutar los tests

```bash
npm test
```

La suite actual cuenta con **55 tests passing**.

Los tests cubren, entre otros:

* Users.
* User Documents.
* Orders.
* Deliveries.
* Delivery Persons.
* Delivery Receipts.
* Mocks.
* Logger.
* Swagger.
* Validaciones y errores.

Los tests de carga utilizan archivos fixture ubicados en:

```text
test/
└── fixtures/
```

Estos archivos forman parte de los tests y son independientes de la carpeta `uploads/`.

---

# Docker

La aplicación está preparada para ejecutarse mediante Docker.

El proyecto utiliza un **Dockerfile multi-stage** para separar la instalación de dependencias de la imagen final de ejecución.

## Construir la imagen

Desde la raíz:

```bash
docker build -t shipnow .
```

Esto genera:

```text
shipnow:latest
```

## Ejecutar solamente la API

También es posible ejecutar la imagen directamente:

```bash
docker run --env-file .env -p 8080:8080 --name shipnow-api shipnow
```

En este caso, `MONGODB_URI` debe apuntar a una instancia de MongoDB accesible desde el contenedor.

---

# Docker Compose

La forma recomendada para ejecutar el entorno completo es mediante **Docker Compose**.

Compose administra:

* API ShipNow.
* MongoDB.
* Red entre servicios.
* Variables de entorno.
* Persistencia de MongoDB.
* Healthcheck de MongoDB.
* Dependencia de la API respecto de MongoDB.

La configuración se encuentra en:

```text
docker-compose.yml
```

## Servicios

```text
docker-compose.yml
│
├── mongo
│   └── MongoDB 8
│
└── api
    └── ShipNow
```

## MongoDB

El servicio utiliza:

```text
mongo:8
```

La base de datos utilizada por la API dentro de Compose es:

```text
mongodb://mongo:27017/shipnow
```

El nombre `mongo` corresponde al nombre del servicio dentro de la red de Docker Compose.

MongoDB utiliza un volumen persistente:

```text
mongo_data
```

## Healthcheck

MongoDB cuenta con un healthcheck utilizando:

```text
mongosh
```

El healthcheck comprueba que MongoDB pueda responder correctamente antes de considerar el servicio saludable.

La API utiliza:

```yaml
depends_on:
  mongo:
    condition: service_healthy
```

Por lo tanto, la API espera a que MongoDB se encuentre saludable antes de iniciar.

## Levantar el entorno

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Para ejecutarlo en segundo plano:

```bash
docker compose up -d --build
```

## Ver el estado de los servicios

```bash
docker compose ps
```

Una ejecución correcta debe mostrar ambos servicios:

```text
shipnow-api
shipnow-mongo
```

MongoDB debe aparecer como:

```text
Up (healthy)
```

y la API debe publicar:

```text
0.0.0.0:8080->8080/tcp
```

## Detener los servicios

```bash
docker compose down
```

El volumen de MongoDB se mantiene mientras no se utilice:

```bash
docker compose down -v
```

---

# Docker y Swagger

Con Docker Compose ejecutándose, la API está disponible en:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/api/docs
```

Health check:

```text
http://localhost:8080/api/health
```

Los endpoints pueden probarse directamente desde Swagger mediante **Try it out**.

---

# Docker y carga de archivos

Los archivos cargados durante la ejecución se almacenan dentro del contenedor de la API, por ejemplo:

```text
/app/uploads/users/documents/
```

o:

```text
/app/uploads/deliveries/receipts/
```

La carpeta `uploads/` se excluye de la imagen base mediante `.dockerignore` porque contiene datos generados durante la ejecución.

En un entorno productivo, la persistencia de estos archivos debería resolverse mediante un volumen o almacenamiento externo.

---

# .dockerignore

El proyecto cuenta con `.dockerignore` para evitar incorporar archivos innecesarios o sensibles a la imagen.

Entre los elementos excluidos se encuentran:

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

Esto permite mantener la imagen más limpia y evita incorporar credenciales, logs, archivos subidos y archivos temporales.

---

# Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Model
  ↓
MongoDB
```

Estructura principal:

```text
src/
├── config/
│   ├── docs/
│   │   └── swagger.config.js
│   └── multer.config.js
│
├── controllers/
│
├── docs/
│
├── middlewares/
│   ├── errorHandler.js
│   └── uploadError.middleware.js
│
├── mocks/
│
├── models/
│   ├── user.model.js
│   ├── order.models.js
│   ├── deliveryPerson.model.js
│   ├── delivery.model.js
│   └── document.model.js
│
├── repositories/
│
├── routes/
│
├── services/
│
├── utils/
│   └── logger/
│
├── app.js
└── server.js
```

## Controllers

Reciben las solicitudes HTTP y coordinan la respuesta.

Los controllers no realizan directamente consultas a MongoDB.

## Services

Contienen la lógica de negocio, validaciones y coordinación de operaciones.

## Repositories

Se encargan de la comunicación con MongoDB mediante Mongoose.

## Models

Definen los schemas de Mongoose y sus validaciones.

## Routes

Definen los endpoints disponibles y conectan las solicitudes con los controllers y middlewares correspondientes.

## Middlewares

Contienen funcionalidades transversales como:

* Manejo global de errores.
* Manejo de errores de Multer.
* Procesamiento de solicitudes HTTP.

## Config

Contiene la configuración de la aplicación, Swagger/OpenAPI y Multer.

## Docs

Contiene la documentación OpenAPI y los schemas reutilizables.

## Utils

Contiene utilidades generales como:

* Winston.
* Constantes.
* `AppError`.
* Diccionario de errores.

---

# Datos generados

El sistema permite generar datos simulados utilizando Faker:

* Usuarios.
* Órdenes.
* Repartidores.
* Entregas.

Los datos generados respetan los modelos y constantes definidos por la aplicación.

Endpoints principales:

```http
GET /api/mocks/mockingusers?qty=5
GET /api/mocks/mockingorders?qty=5
POST /api/mocks/generatedata?qty=5
```

---

# Pruebas con Swagger

Con la aplicación ejecutándose:

```text
http://localhost:8080/api/docs
```

## Users

```http
GET /api/users
GET /api/users/:id
POST /api/users
POST /api/users/:id/documents
```

## Orders

```http
GET /api/orders
GET /api/orders/:id
POST /api/orders
PATCH /api/orders/:id/status
```

## Delivery Persons

Consultar la sección `Delivery Persons` de Swagger.

## Deliveries

Consultar la sección `Deliveries` de Swagger.

Para cargar un comprobante:

```http
POST /api/deliveries/:id/receipt
```

## Mocking

```http
GET /api/mocks/mockingusers?qty=5
GET /api/mocks/mockingorders?qty=5
POST /api/mocks/generatedata?qty=5
```

## Logger

```http
GET /api/loggerTest/debug
GET /api/loggerTest/http
GET /api/loggerTest/info
GET /api/loggerTest/warn
GET /api/loggerTest/error
GET /api/loggerTest/fatal
```

---

# Git e información sensible

Los siguientes elementos no deben formar parte del repositorio:

```text
node_modules/
.env
.env.test
logs/
uploads/
coverage/
tmp/
*.zip
*.rar
*.7z
```

El proyecto utiliza `.gitignore` para excluir estos archivos y directorios.

Los archivos `.env` y `.env.test` pueden contener credenciales y configuraciones sensibles.

Los logs son archivos generados automáticamente por Winston.

Los archivos cargados por usuarios pertenecen a la carpeta `uploads/` y no forman parte del código fuente.

Los archivos de `test/fixtures/` utilizados por los tests sí forman parte del proyecto cuando son necesarios para ejecutar las pruebas.

---

# Estado de la aplicación

ShipNow se encuentra preparado para:

* Ejecución local.
* Testing funcional automatizado.
* Documentación mediante Swagger/OpenAPI.
* Generación de datos simulados.
* Arquitectura por capas.
* Manejo centralizado de errores.
* Logging centralizado y rotativo.
* Configuración por entornos.
* Health check.
* Paginación y límites máximos.
* Carga de documentos mediante Multer.
* Carga de comprobantes de entregas.
* Validación de archivos.
* Almacenamiento organizado de archivos.
* Persistencia de metadatos en MongoDB.
* Documentación de uploads mediante Swagger/OpenAPI.
* Tests funcionales de carga de archivos.
* Ejecución mediante Docker.
* Ejecución mediante Docker Compose.
* MongoDB administrado como servicio independiente.
* Healthcheck de MongoDB.
* Inicio de la API condicionado a la disponibilidad de MongoDB.

## Verificación realizada

El entorno Docker Compose fue probado verificando:

```text
shipnow-api       Up
shipnow-mongo     Up (healthy)
```

También se verificaron mediante Swagger:

```text
GET  /api/users
POST /api/users
POST /api/users/:id/documents
```

La carga de un documento PDF respondió correctamente con:

```text
201 Created
```

y los metadatos del archivo fueron registrados en MongoDB.

La suite de testing continúa funcionando correctamente:

```text
55 passing
```

---

# Comandos principales

## Desarrollo

```bash
npm run dev
```

## Producción/local

```bash
npm start
```

## Tests

```bash
npm test
```

## Docker

```bash
docker build -t shipnow .
```

## Docker Compose

```bash
docker compose up --build
```

## Docker Compose en segundo plano

```bash
docker compose up -d --build
```

## Estado de los servicios

```bash
docker compose ps
```

## Logs

```bash
docker compose logs -f
```

## Detener Compose

```bash
docker compose down
```

