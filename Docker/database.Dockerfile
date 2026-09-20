FROM ubuntu:24.04

RUN apt-get update -qq
RUN apt-get install -y curl ca-certificates software-properties-common

RUN mkdir -p /opt/downloads
WORKDIR /opt/downloads

# Setup Repos
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
RUN curl -fsSL https://packages.microsoft.com/config/ubuntu/24.04/mssql-server-2025.list | tee /etc/apt/sources.list.d/mssql-server-2025.list
RUN curl -sSL -O https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb

RUN apt-get update -qq

# SQL server
RUN apt-get install -y mssql-server

# SQL tools
ENV ACCEPT_EULA=Y
RUN apt-get install -y mssql-tools18 unixodbc-dev
RUN echo PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bash_profile
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc

# SQL Package
RUN apt-get install -y dotnet-sdk-10.0
RUN dotnet tool install -g microsoft.sqlpackage

EXPOSE 1433/tcp

COPY ./Docker/Database/FeatherTracker.Database.dacpac /databaseinit/
COPY ./Docker/databaseinit.sh /databaseinit/
RUN ["chmod", "+x", "/databaseinit/databaseinit.sh"]

CMD MSSQL_SA_PASSWORD=$MSSQL_SA_PASSWORD sh /databaseinit/databaseinit.sh
