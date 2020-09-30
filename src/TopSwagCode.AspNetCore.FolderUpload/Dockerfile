FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["TopSwagCode.AspNetCore.FolderUpload/TopSwagCode.AspNetCore.FolderUpload.csproj", "TopSwagCode.AspNetCore.FolderUpload/"]
RUN dotnet restore "TopSwagCode.AspNetCore.FolderUpload/TopSwagCode.AspNetCore.FolderUpload.csproj"
COPY . .
WORKDIR "/src/TopSwagCode.AspNetCore.FolderUpload"
RUN dotnet build "TopSwagCode.AspNetCore.FolderUpload.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TopSwagCode.AspNetCore.FolderUpload.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TopSwagCode.AspNetCore.FolderUpload.dll"]