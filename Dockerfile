# Etapa 1: instalación de dependencias
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# Etapa 2: imagen final
FROM node:22-alpine

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY package*.json ./

COPY src ./src

EXPOSE 8080

CMD ["npm", "start"]