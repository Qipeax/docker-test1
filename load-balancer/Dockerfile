FROM node:18-alpine

WORKDIR /app

# Копируем сначала только файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем специфичные файлы балансировщика
COPY load-balancer/ ./

EXPOSE 80

CMD ["node", "loadBalancer.js"]