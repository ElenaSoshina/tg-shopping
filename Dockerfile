# Этап 1: Сборка приложения
# Используем официальный образ Node.js как базовый образ для сборки
FROM node:14 as build-stage

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в рабочую директорию
COPY . .

# Запускаем сборку приложения
RUN npm run build

# Этап 2: Подготовка сервера для раздачи статических файлов
# Используем образ Nginx для раздачи статических файлов
FROM nginx:stable-alpine as production-stage

# Копируем собранные статические файлы из предыдущего этапа
COPY --from=build-stage /app/build /usr/share/nginx/html

# Добавляем ваш кастомный конфиг Nginx, если это необходимо
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80 для внешнего мира
EXPOSE 80

# Запускаем Nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]
