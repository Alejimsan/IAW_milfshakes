FROM node:18-alpine
WORKDIR /usr/src/app

# Copiar package.json primero para aprovechar cache
COPY package.json ./

# Instalar dependencias
RUN npm install --production=false

# Copiar el resto del código
COPY . .

RUN mkdir -p /usr/src/app/data

EXPOSE 3000

# Por defecto, seed + start en docker-compose; fallback a start
CMD ["sh", "-c", "npm start"]
