#!/bin/bash

echo " -- Setting up Database -- "

MSSQL_PID='developer' /opt/mssql/bin/mssql-conf -n setup accept-eula

echo " -- Starting SQL server -- "

/opt/mssql/bin/sqlservr &

sleep 10

echo " -- Publishing database -- "

/root/.dotnet/tools/sqlpackage /tsn:localhost,1433 /tu:SA /tp:${MSSQL_SA_PASSWORD} /A:Publish /tdn:FeatherTracker.Database /sf:/databaseinit/FeatherTracker.Database.dacpac /ttsc:true

sleep infinity;