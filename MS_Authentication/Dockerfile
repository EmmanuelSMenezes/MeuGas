#Build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN mkdir /app
COPY . /app
RUN cd /app && ls -l
RUN mkdir /build

#Artefact
RUN cd /app && dotnet publish WebApi/WebApi.csproj  -o /build

#Final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final

#Environment Variables
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:80

WORKDIR /build
COPY --from=build /build .

RUN mkdir -p /var/log/ms_authentication

EXPOSE 80

ENTRYPOINT ["./MicroserviceAuthentication"]