# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и yarn.lock, чтобы кешировать зависимости
COPY package.json yarn.lock ./

# Устанавливаем все зависимости (dev и prod) для сборки
RUN yarn install

# Копируем весь исходный код
COPY . .

# Собираем проект
RUN yarn build

# --- Stage 2: Production ---
FROM node:18-alpine

WORKDIR /app

# Копируем только package.json и yarn.lock для установки продакшен зависимостей
COPY package.json yarn.lock ./

RUN yarn install --production

# Копируем собранные файлы из builder
COPY --from=builder /app/dist ./dist

# Экспонируем порт
EXPOSE 8080

# Запускаем приложение
CMD ["node", "dist/main.js"]

