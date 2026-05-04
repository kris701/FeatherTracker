FROM ubuntu:22.04

RUN apt update -qq
RUN apt install -y curl software-properties-common

RUN mkdir -p /opt/downloads
WORKDIR /opt/downloads

# Setup Repos
RUN curl https://packages.microsoft.com/keys/microsoft.asc | tee /etc/apt/trusted.gpg.d/microsoft.asc
RUN curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | tee /etc/apt/sources.list.d/mssql-server-2022.list
RUN curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/prod.list | tee /etc/apt/sources.list.d/mssql-release.list
RUN add-apt-repository ppa:dotnet/backports

RUN apt update -qq

# SQL server
RUN apt install -y mssql-server

# SQL tools
ENV ACCEPT_EULA=Y
RUN apt install -y mssql-tools18 unixodbc-dev
RUN echo PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bash_profile
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc

# SQL Package
RUN apt install -y dotnet-sdk-10.0
RUN dotnet tool install -g microsoft.sqlpackage

EXPOSE 1433/tcp

COPY ./Docker/Database/FeatherTracker.Database.dacpac /databaseinit/
COPY ./Docker/databaseinit.sh /databaseinit/
RUN ["chmod", "+x", "/databaseinit/databaseinit.sh"]

CMD MSSQL_SA_PASSWORD=$MSSQL_SA_PASSWORD /databaseinit/databaseinit.sh
