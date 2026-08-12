# ShipNow - Mocking y manejo profesional de errores

API desarrollada con Node.js, Express y MongoDB para la generación de datos simulados y su posterior carga en la base de datos.

El proyecto implementa una arquitectura por capas y permite generar usuarios, órdenes, repartidores y entregas respetando los modelos y constantes definidos en la aplicación.

Además, cuenta con una capa centralizada de manejo de errores mediante errores personalizados, un diccionario de errores y un middleware global para devolver respuestas HTTP consistentes.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- Faker
- bcrypt
- dotenv

## Instalación

Clonar el repositorio:

git clone URL_DEL_REPOSITORIO

Ingresar al proyecto:

cd nombre-del-proyecto

Instalar dependencias:

npm install

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

PORT=8080
MONGO_URL=tu_url_de_mongodb

## Ejecución

Para iniciar el servidor:

npm run dev

## Endpoints de Mocking

### Generar usuarios

GET /api/mocks/mockingusers?qty=5

Genera usuarios simulados sin almacenarlos en MongoDB.

### Generar órdenes

GET /api/mocks/mockingorders?qty=5

Genera órdenes simuladas asociadas a usuarios ficticios.

### Generar y guardar datos

POST /api/mocks/generatedata?qty=10

Genera y almacena en MongoDB:

- Usuarios
- Órdenes
- Repartidores
- Entregas

## Arquitectura

El proyecto utiliza una arquitectura por capas:

src/
├── controllers/
├── models/
├── mocks/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js

### Mocks

Generan datos ficticios utilizando Faker.

### Services

Contienen la lógica de generación y coordinación de los datos.

### Repositories

Se encargan de la comunicación con MongoDB.

### Models

Definen los esquemas de Mongoose y las validaciones.

### Controllers

Reciben las solicitudes HTTP y devuelven las respuestas.

### Routes

Definen los endpoints disponibles.

## Datos generados

El sistema permite generar:

- Usuarios con roles válidos.
- Órdenes asociadas a usuarios.
- Órdenes con estados y prioridades válidos.
- Repartidores asociados a usuarios.
- Entregas asociadas a órdenes y repartidores.

Los datos generados respetan los modelos y las constantes definidas en el proyecto.

### Ejemplo

POST /api/mocks/generatedata?qty=10

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