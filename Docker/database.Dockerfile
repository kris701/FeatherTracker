FROM mcr.microsoft.com/azure-sql-edge

ENV ACCEPT_EULA=1

COPY ./Docker/Database/FeatherTracker.Database_Create.sql /databaseinit/
COPY ./Docker/databaseinit.sh /databaseinit/
