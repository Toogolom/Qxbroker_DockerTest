# Базовый образ для выполнения приложения
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

RUN mkdir -p /app/StaticFiles

# Строительный образ с установленным .NET SDK и Node.js
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Установка Node.js (для работы с Angular и другими зависимостями)
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && node -v 

# Копирование проекта и установка зависимостей
WORKDIR /src
COPY ["qxbroker.client/nuget.config", "qxbroker.client/"]
COPY ["Qxbroker.API/Qxbroker.API.csproj", "Qxbroker.API/"]
COPY ["qxbroker.client/qxbroker.client.esproj", "qxbroker.client/"]
COPY ["Qxbroker.Domain/Qxbroker.Domain.csproj", "Qxbroker.Domain/"]
COPY ["Qxbroker.Infrastructure/Qxbroker.Infrastructure.csproj", "Qxbroker.Infrastructure/"]
COPY ["Qxbroker.Service/Qxbroker.Service.csproj", "Qxbroker.Service/"]
RUN dotnet restore "./Qxbroker.API/Qxbroker.API.csproj"
COPY . .
WORKDIR "/src/Qxbroker.API"

# Установка зависимостей Angular
WORKDIR "/src/qxbroker.client"
RUN npm install

# Сборка .NET проекта
RUN dotnet build "/src/Qxbroker.API/Qxbroker.API.csproj" -c Release -o /app/build

# Публикация .NET проекта
FROM build AS publish
RUN dotnet publish "/src/Qxbroker.API/Qxbroker.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Финальный образ
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Qxbroker.API.dll"]
