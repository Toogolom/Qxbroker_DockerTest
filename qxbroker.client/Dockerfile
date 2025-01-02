FROM node:latest AS build

# Устанавливаем зависимости для .NET SDK (для генерации сертификатов)
RUN apt-get update && apt-get install -y \
    wget \
    apt-transport-https \
    software-properties-common \
    && wget https://packages.microsoft.com/config/debian/10/prod.list \
    && mv prod.list /etc/apt/sources.list.d/microsoft-prod.list \
    && wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | apt-key add - \
    && apt-get update \
    && apt-get install -y dotnet-sdk-6.0

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run prod
RUN ls -la /app/dist/qxbroker.client/browser

FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist/qxbroker.client/browser /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
