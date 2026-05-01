FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

# copy everything else and build api
COPY ./API ./API/
RUN dotnet publish ./API/FeatherTracker.API/FeatherTracker.API.csproj -c release -o /api

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /api
COPY --from=build /api ./
EXPOSE 8080
ENTRYPOINT dotnet FeatherTracker.API.dll --jwtsecret "${JWT_SECRET}" --jwtlifetime ${JWT_LIFETIME} --dbconnectionstring "Server=tcp:docker-feathertracker-database,1433;Initial Catalog=FeatherTracker.Database;Persist Security Info=False;User ID=sa;Password=${DB_PASSWORD};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;"
