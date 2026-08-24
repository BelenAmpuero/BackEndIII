# ShipNow - Mocking, manejo profesional de errores y logging

API desarrollada con Node.js, Express y MongoDB para la generación de datos simulados y su posterior carga en la base de datos.

El proyecto implementa una arquitectura por capas y permite generar usuarios, órdenes, repartidores y entregas respetando los modelos y constantes definidos en la aplicación.

Además, cuenta con:

- Una capa centralizada de manejo de errores mediante errores personalizados.
- Un diccionario de códigos de error.
- Un middleware global para devolver respuestas HTTP consistentes.
- Un sistema de logging centralizado utilizando Winston.
- Persistencia de logs en archivos.
- Rotación de archivos de logs.
- Diferentes niveles de logging según la importancia del evento y el entorno de ejecución.
- Un endpoint de prueba para verificar el funcionamiento de todos los niveles de log.

---

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- Faker
- bcrypt
- dotenv
- Winston
- winston-daily-rotate-file

---

## Instalación

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

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
MONGODB_URI=tu_url_de_mongodb
NODE_ENV=development
LOG_LEVEL=debug
```

### Variables utilizadas

- `PORT`: puerto en el que se ejecuta el servidor.
- `MONGODB_URI`: cadena de conexión a MongoDB.
- `NODE_ENV`: define el entorno de ejecución (`development` o `production`).
- `LOG_LEVEL`: define el nivel mínimo de logging.

> El archivo `.env` contiene información sensible y no debe subirse al repositorio.

---

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Por defecto, la API se ejecuta en:

```text
http://localhost:8080
```

---

# Endpoints de Mocking

## Generar usuarios

```http
GET /api/mocks/mockingusers?qty=5
```

Genera usuarios simulados sin almacenarlos en MongoDB.

---

## Generar órdenes

```http
GET /api/mocks/mockingorders?qty=5
```

Genera órdenes simuladas asociadas a usuarios ficticios.

---

## Generar y guardar datos

```http
POST /api/mocks/generatedata?qty=10
```

Genera y almacena en MongoDB:

- Usuarios
- Órdenes
- Repartidores
- Entregas

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

---

# Manejo profesional de errores

El proyecto cuenta con un sistema centralizado de manejo de errores que utiliza errores personalizados mediante `AppError`, un diccionario de errores y un middleware global.

Los errores son procesados por el middleware y devueltos al cliente utilizando una estructura JSON consistente.

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

- `status`: indica que la operación terminó con un error.
- `code`: identifica el tipo de error definido en el diccionario de errores.
- `message`: describe el motivo del error.

Los errores controlados utilizan el código HTTP correspondiente definido en el diccionario de errores, mientras que los errores inesperados del servidor utilizan `500 Internal Server Error`.

---

## Ejemplo de error de validación

Si se intenta generar una cantidad inválida de mocks, por ejemplo `0`, un número negativo o un valor que no sea numérico:

```http
POST /api/mocks/generatedata?qty=hola
```

La respuesta esperada es:

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

# Logging

El proyecto utiliza **Winston** como sistema centralizado de logging.

El logger permite registrar diferentes tipos de eventos según su importancia y facilita el monitoreo y debugging de la aplicación.

## Niveles de log

ShipNow utiliza los siguientes niveles personalizados:

| Nivel | Descripción |
|---|---|
| `fatal` | Fallas críticas que pueden impedir el funcionamiento de la aplicación. |
| `error` | Errores inesperados o fallas importantes durante una operación. |
| `warning` | Situaciones anómalas o advertencias que no necesariamente interrumpen la operación. |
| `info` | Información general sobre el funcionamiento de la aplicación. |
| `http` | Información relacionada con solicitudes HTTP. |
| `debug` | Información detallada útil durante el desarrollo y debugging. |

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

## Configuración según el entorno

El comportamiento del logger depende de las variables de entorno `NODE_ENV` y `LOG_LEVEL`.

### Desarrollo

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

### Producción

En producción se recomienda utilizar:

```env
NODE_ENV=production
LOG_LEVEL=info
```

De esta manera se reducen los mensajes menos relevantes y se registran principalmente eventos importantes.

El nivel puede modificarse mediante `LOG_LEVEL` sin necesidad de cambiar la configuración del logger.

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

Los archivos se generan mediante una estrategia de rotación para evitar que crezcan indefinidamente.

## Archivo de errores

El archivo de errores almacena únicamente los niveles:

```text
error
fatal
```

Por lo tanto, no deben aparecer allí registros de:

```text
debug
http
info
warning
```

Esto permite consultar rápidamente los errores importantes de la aplicación.

---

# Rotación de archivos

Para evitar que los archivos de logs crezcan sin control se utiliza:

```text
winston-daily-rotate-file
```

Los archivos se generan de forma rotativa utilizando la fecha y se mantiene un historial limitado.

Esto permite conservar registros anteriores sin generar archivos demasiado grandes.

---

# Endpoint de prueba del logger

Para comprobar el funcionamiento de Winston se incorporó un router específico de prueba:

```http
/api/loggerTest
```

Este endpoint permite generar registros de todos los niveles disponibles.

## DEBUG

```http
GET /api/loggerTest/debug
```

Genera un log:

```text
[debug] Mensaje de prueba - DEBUG
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

---

## INFO

```http
GET /api/loggerTest/info
```

Genera un log:

```text
[info] Mensaje de prueba - INFO
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

---

## ERROR

```http
GET /api/loggerTest/error
```

Genera un log:

```text
[error] Mensaje de prueba - ERROR
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

Estos endpoints son únicamente herramientas de prueba del sistema de logging.

Los endpoints `/error` y `/fatal` registran eventos con esos niveles, pero no representan necesariamente un error HTTP. Por este motivo, pueden responder `200 OK` después de generar correctamente el log.

---

# Ejemplo de salida

En desarrollo, los registros pueden visualizarse en consola con timestamp, nivel y mensaje:

```text
2026-08-24 19:00:13 [info] ✅ MongoDB conectado
2026-08-24 19:00:13 [info] 🚀 Servidor escuchando en el puerto 8080
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
├── controllers/
├── middlewares/
├── mocks/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
│   └── logger/
├── app.js
└── server.js
```

### Config

Contiene la configuración de la aplicación y la conexión con MongoDB.

### Mocks

Generan datos ficticios utilizando Faker.

### Services

Contienen la lógica de generación y coordinación de los datos.

### Repositories

Se encargan de la comunicación con MongoDB.

### Models

Definen los esquemas de Mongoose y sus validaciones.

### Controllers

Reciben las solicitudes HTTP y coordinan las operaciones correspondientes.

### Routes

Definen los endpoints disponibles en la API.

### Middlewares

Contienen funcionalidades transversales de la aplicación, como el manejo centralizado de errores y el logging.

### Utils

Contiene utilidades generales del proyecto, incluyendo la configuración centralizada de Winston.

---

# Datos generados

El sistema permite generar:

- Usuarios con roles válidos.
- Órdenes asociadas a usuarios.
- Órdenes con estados y prioridades válidos.
- Repartidores asociados a usuarios.
- Entregas asociadas a órdenes y repartidores.

Los datos generados respetan los modelos y las constantes definidas en el proyecto.

---

# Ejemplo completo

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

Durante la operación, los eventos importantes pueden quedar registrados mediante Winston para facilitar el monitoreo y debugging de la aplicación.

---

# Git e información sensible

Los siguientes archivos y carpetas no deben subirse al repositorio:

```gitignore
node_modules/
.env
logs/
```

El archivo `.env` contiene las variables de entorno y credenciales necesarias para la aplicación.

La carpeta `logs/` contiene archivos generados automáticamente por Winston y no forma parte del código fuente del proyecto.