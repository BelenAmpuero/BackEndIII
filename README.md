# ShipNow - Mocking, manejo profesional de errores, logging y documentación Swagger

API desarrollada con Node.js, Express y MongoDB para la generación de datos simulados y su posterior carga en la base de datos.

El proyecto implementa una arquitectura por capas y permite gestionar usuarios, órdenes, repartidores y entregas, respetando los modelos y constantes definidos en la aplicación.

Además, cuenta con:

* Una capa centralizada de manejo de errores mediante errores personalizados.
* Un diccionario de códigos de error.
* Un middleware global para devolver respuestas HTTP consistentes.
* Un sistema de logging centralizado utilizando Winston.
* Persistencia de logs en archivos.
* Rotación de archivos de logs.
* Diferentes niveles de logging según la importancia del evento y el entorno de ejecución.
* Endpoints de prueba para verificar el funcionamiento de los diferentes niveles de logging.
* Documentación interactiva de la API mediante Swagger UI y OpenAPI 3.0.

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
* swagger-jsdoc
* swagger-ui-express
* mocka
* chai
* supertest

---

# Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd nombre-del-proyecto
```

Instalar dependencias:

```bash
npm install
```

---

# Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
MONGODB_URI=tu_url_de_mongodb
NODE_ENV=development
LOG_LEVEL=debug
```

Para el entorno de testing, crear un archivo .env.test en la raíz:

PORT=8080
MONGODB_URI_TEST=mongodb://localhost:27017/shipnow-test
NODE_ENV=test
LOG_LEVEL=error

## Variables utilizadas

* `PORT`: puerto en el que se ejecuta el servidor.
* `MONGODB_URI`: cadena de conexión a MongoDB para desarrollo y testing respectivamente.
* `NODE_ENV`: define el entorno de ejecución (`development` `production` o `test`).
* `LOG_LEVEL`: define el nivel mínimo de logging.



> Los archivos `.env`y `.env.test`  contiene información sensible y no debe subirse al repositorio.

---


# Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Por defecto, la API se ejecuta en:

```text
http://localhost:8080
```

---

# Documentación Swagger

El proyecto cuenta con documentación interactiva de la API utilizando Swagger UI y OpenAPI 3.0.

La documentación está disponible en:

```text
http://localhost:8080/api/docs
```

Desde Swagger UI es posible consultar y probar los endpoints documentados directamente desde el navegador.

La especificación OpenAPI también puede consultarse en formato JSON mediante:

```text
http://localhost:8080/api/docs-json
```

## Módulos documentados

Actualmente la documentación incluye los siguientes módulos:

* **Mocks**
* **Logger**
* **Users**
* **Orders**
* **Delivery Persons**
* **Deliveries**

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
    └── logger.yaml
```

Los schemas incluyen las entidades utilizadas por la aplicación:

* User
* Order
* OrderItem
* DeliveryPerson
* Delivery
* ErrorResponse
* SuccessResponse
* Respuestas relacionadas con Mocking

---

# Endpoints de Users

El módulo de Users permite gestionar los usuarios registrados en la aplicación.

Los usuarios cuentan con información personal y un rol que determina su tipo dentro del sistema.

Los endpoints disponibles se encuentran documentados en Swagger bajo la sección **Users**.

Entre las operaciones disponibles se encuentran:

```http
GET /api/users
GET /api/users/:id
POST /api/users
```

Los endpoints realizan las validaciones correspondientes y utilizan el sistema centralizado de manejo de errores.

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

Los endpoints disponibles se encuentran documentados en Swagger bajo la sección **Orders**.

## Obtener todos los pedidos

```http
GET /api/orders
```

Obtiene la lista de pedidos registrados en MongoDB.

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

Los estados disponibles son:

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

Las operaciones y validaciones correspondientes pueden consultarse directamente desde Swagger UI.

---

# Endpoints de Deliveries

El módulo de Deliveries permite gestionar las entregas asociadas a pedidos y repartidores.

Las entregas relacionan:

* Un pedido.
* Un repartidor.
* Un estado de entrega.

Los endpoints disponibles se encuentran documentados en Swagger bajo la sección **Deliveries**.

Las operaciones y estados disponibles pueden consultarse y probarse directamente desde Swagger UI.

---

# Manejo profesional de errores

El proyecto cuenta con un sistema centralizado de manejo de errores que utiliza:

* `AppError`.
* Un diccionario de códigos de error.
* Un middleware global `errorHandler`.

Los errores controlados son procesados por el middleware y devueltos al cliente utilizando una estructura JSON consistente.

## Estructura de respuesta de error

Una respuesta de error tiene el siguiente formato:

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

Los errores inesperados del servidor utilizan:

```text
500 Internal Server Error
```

con una respuesta de este tipo:

```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Error interno del servidor"
}
```

---

# Principales códigos de error

El proyecto contempla diferentes códigos de error relacionados con las entidades y operaciones implementadas.

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

## Mocks

* `INVALID_MOCK_QUANTITY` - 400
* `MOCK_GENERATION_ERROR` - 500
* `MOCK_DATABASE_ERROR` - 500

---

# Ejemplo de error de validación

Si se intenta generar una cantidad inválida de mocks, por ejemplo `0`, un número negativo o un valor que no sea un número entero válido:

```http
GET /api/mocks/mockingusers?qty=0
```

o:

```http
POST /api/mocks/generatedata?qty=hola
```

La respuesta será:

```json
{
  "status": "error",
  "code": "INVALID_MOCK_QUANTITY",
  "message": "La cantidad de mocks solicitada no es válida"
}
```

con código HTTP:

```text
400 Bad Request
```

---

# Endpoints de Mocking

El módulo de Mocking permite generar datos ficticios utilizando Faker y, en determinados casos, almacenarlos en MongoDB.

## Generar usuarios

```http
GET /api/mocks/mockingusers?qty=5
```

Genera usuarios simulados sin almacenarlos en MongoDB.

El parámetro `qty` permite indicar la cantidad de usuarios a generar.

Ejemplo de respuesta:

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "ObjectId",
      "name": "Nombre generado",
      "email": "usuario@example.com",
      "password": "hash",
      "role": "user",
      "phone": "123456789",
      "address": "Dirección generada"
    }
  ]
}
```

---

## Generar órdenes

```http
GET /api/mocks/mockingorders?qty=5
```

Genera órdenes simuladas asociadas a usuarios ficticios.

Cada orden contiene:

* Usuario asociado.
* Items.
* Cantidad.
* Precio.
* Total.
* Dirección de entrega.
* Estado.
* Prioridad.

---

## Generar y guardar datos

```http
POST /api/mocks/generatedata?qty=10
```

Genera y almacena en MongoDB datos de prueba relacionados entre sí.

El proceso genera:

* Usuarios.
* Órdenes.
* Repartidores.
* Entregas.

Las relaciones entre las entidades se generan automáticamente durante el proceso.

Ejemplo de respuesta:

```json
{
  "status": "success",
  "message": "Datos de prueba generados correctamente",
  "inserted": {
    "users": 10,
    "orders": 10,
    "deliveryPersons": 10,
    "deliveries": 10
  }
}
```

El parámetro `qty` permite definir la cantidad de datos base que se generan.

---

# Logging

El proyecto utiliza **Winston** como sistema centralizado de logging.

El logger permite registrar diferentes tipos de eventos según su importancia y facilita el monitoreo y debugging de la aplicación.

## Niveles de log

ShipNow utiliza los siguientes niveles personalizados:

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

# Configuración según el entorno

El comportamiento del logger depende de las variables de entorno `NODE_ENV` y `LOG_LEVEL`.

## Desarrollo

En desarrollo se puede utilizar:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

Esto permite visualizar todos los niveles disponibles:

```text
debug
http
info
warning
error
fatal
```

## Producción

En producción se recomienda utilizar:

```env
NODE_ENV=production
LOG_LEVEL=info
```

De esta manera se reducen los mensajes menos relevantes y se registran principalmente eventos importantes.

El nivel puede modificarse mediante `LOG_LEVEL` sin necesidad de modificar la configuración del logger.

---

# Persistencia de logs

Los logs también se almacenan en archivos dentro de la carpeta:

```text
logs/
```

La configuración utiliza archivos separados según su propósito.

## Archivo general

El archivo `combined` almacena los eventos registrados por la aplicación según el nivel configurado.

Puede contener registros como:

```text
debug
http
info
warning
error
fatal
```

Los archivos se generan mediante una estrategia de rotación.

## Archivo de errores

El archivo de errores almacena los eventos correspondientes a los niveles:

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

```http
/api/loggerTest
```

Este módulo permite generar registros de todos los niveles disponibles.

> Estos endpoints son únicamente herramientas de validación del sistema de logging y no representan funcionalidades de negocio.

---

## DEBUG

```http
GET /api/loggerTest/debug
```

Genera un log:

```text
[debug] Mensaje de prueba - DEBUG
```

Respuesta:

```json
{
  "status": "success",
  "message": "Log DEBUG generado correctamente"
}
```

---

## HTTP

```http
GET /api/loggerTest/http
```

Genera un log:

```text
[http] Mensaje de prueba - HTTP
```

Respuesta:

```json
{
  "status": "success",
  "message": "Log HTTP generado correctamente"
}
```

---

## INFO

```http
GET /api/loggerTest/info
```

Genera un log:

```text
[info] Mensaje de prueba - INFO
```

Respuesta:

```json
{
  "status": "success",
  "message": "Log INFO generado correctamente"
}
```

---

## WARNING

```http
GET /api/loggerTest/warn
```

Genera un log:

```text
[warning] Mensaje de prueba - WARNING
```

Respuesta:

```json
{
  "status": "success",
  "message": "Log WARNING generado correctamente"
}
```

---

## ERROR

```http
GET /api/loggerTest/error
```

Genera un log:

```text
[error] Mensaje de prueba - ERROR
```

Respuesta:

```json
{
  "status": "success",
  "message": "Log ERROR generado correctamente"
}
```

---

## FATAL

```http
GET /api/loggerTest/fatal
```

Genera un log:

```text
[fatal] Mensaje de prueba - FATAL
```

Respuesta:

```json
{
  "status": "success",
  "message": "Log FATAL generado correctamente"
}
```

Los endpoints `/error` y `/fatal` registran eventos con esos niveles, pero no representan necesariamente un error HTTP.

Por este motivo, pueden responder `200 OK` después de generar correctamente el log.

---

# Ejemplo de salida

En desarrollo, los registros pueden visualizarse en consola con timestamp, nivel y mensaje:

```text
2026-08-24 19:00:13 [info] MongoDB conectado

2026-08-24 19:00:13 [info] Servidor escuchando en el puerto 8080

2026-08-24 19:05:21 [debug] Mensaje de prueba - DEBUG

2026-08-24 19:05:25 [http] Mensaje de prueba - HTTP

2026-08-24 19:05:30 [info] Mensaje de prueba - INFO

2026-08-24 19:05:35 [warning] Mensaje de prueba - WARNING

2026-08-24 19:05:40 [error] Mensaje de prueba - ERROR

2026-08-24 19:05:45 [fatal] Mensaje de prueba - FATAL
```

Los registros también se almacenan en la carpeta `logs/` según la configuración de los transports.

---

# Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
src/

├── config/
│   └── docs/
│       └── swagger.config.js
│
├── controllers/
├── docs/
├── middlewares/
├── mocks/
├── models/
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

También contiene la configuración de Swagger/OpenAPI:

```text
config/
└── docs/
    └── swagger.config.js
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
└── logger.yaml
```

## Mocks

Generan datos ficticios utilizando Faker.

## Services

Contienen la lógica de generación y coordinación de los datos.

## Repositories

Se encargan de la comunicación con MongoDB.

## Models

Definen los esquemas de Mongoose y sus validaciones.

## Controllers

Reciben las solicitudes HTTP y coordinan las operaciones correspondientes.

## Routes

Definen los endpoints disponibles en la API.

## Middlewares

Contienen funcionalidades transversales de la aplicación, como el manejo centralizado de errores y el registro de solicitudes HTTP.

## Utils

Contiene utilidades generales del proyecto, incluyendo la configuración centralizada de Winston.

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

# Ejemplo completo

Generación y persistencia de datos de prueba:

```http
POST /api/mocks/generatedata?qty=10
```

Respuesta:

```json
{
  "status": "success",
  "message": "Datos de prueba generados correctamente",
  "inserted": {
    "users": 10,
    "orders": 10,
    "deliveryPersons": 10,
    "deliveries": 10
  }
}
```

Durante la operación, los eventos importantes quedan registrados mediante Winston para facilitar el monitoreo y debugging de la aplicación.

---

# Pruebas con Swagger

Una vez iniciado el servidor, ingresar a:

```text
http://localhost:8080/api/docs
```

Desde Swagger UI se pueden ejecutar los endpoints disponibles utilizando el botón **Try it out**.

Se recomienda probar los siguientes endpoints:

## Users

```text
GET /api/users
GET /api/users/:id
POST /api/users
```

## Orders

```text
GET /api/orders
GET /api/orders/:id
POST /api/orders
PATCH /api/orders/:id/status
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

También se pueden comprobar los errores de validación utilizando cantidades inválidas, por ejemplo:

```text
GET /api/mocks/mockingusers?qty=0

GET /api/mocks/mockingusers?qty=-5

GET /api/mocks/mockingorders?qty=abc

POST /api/mocks/generatedata?qty=hola
```

Los endpoints de **Delivery Persons** y **Deliveries** también pueden probarse directamente desde sus respectivas secciones en Swagger UI.

---
# Testing

El proyecto cuenta con una suite de tests funcionales automatizados que validan los endpoints principales de ShipNow, cubriendo casos exitosos y errores esperados.

Herramientas utilizadas:

* Mocha: Framework de pruebas para organizar y ejecutar los tests.

* Chai: Librería de aserciones para validar el estado HTTP, la estructura del body y sus propiedades.

* Supertest: Permite realizar peticiones HTTP sobre la app Express de forma aislada sin abrir puertos manualmente.

# Entorno de testing

El entorno está completamente separado del de desarrollo mediante:

Un archivo de configuración dedicado (.env.test).

Una base de datos independiente (shipnow-test) para garantizar datos controlados, repetibles y descartables mediante una estrategia de limpieza automática antes y después de las pruebas.

# Cómo ejecutar los tests

Para correr la suite de pruebas automatizadas, ejecutar:

npm test

# Módulos cubiertos

* Users: Listado de usuarios, obtención por ID y validación de casos de error.

* Orders: Creación con datos válidos, listado, obtención por ID, actualización de estados y validación de errores (datos incompletos, recursos inexistentes, estados inválidos).

* Mocks: Generación de usuarios y órdenes simuladas, y persistencia de datos de prueba en la base de datos de test (/api/mocks).

* Logger: Verificación de los endpoints de prueba de logging (/api/loggerTest).

* Swagger: Comprobación de la accesibilidad de la ruta de documentación interactiva (/api/docs).


---

# Git e información sensible

Los siguientes archivos y carpetas no deben subirse al repositorio:

```gitignore
node_modules/

.env

logs/

.env.test

```

Los archivos `.env` y `.env.test` contienen las variables de entorno y credenciales necesarias para la aplicación.

La carpeta `logs/` contiene archivos generados automáticamente por Winston y no forma parte del código fuente del proyecto.
