# Usa una imagen oficial de Node.js ligera
FROM node:18-alpine

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

CMD ["npm", "start"]