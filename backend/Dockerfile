FROM node:18-alpine

WORKDIR /app

# Копируем сначала только файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем специфичные файлы бэкенда
COPY backend/ ./

EXPOSE 3000

CMD ["node", "server.js"]