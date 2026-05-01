#!/bin/bash

/opt/mssql/bin/sqlservr &

for i in {1..5};
do
    # Check if Database already exists
    RESULT=`/opt/mssql-tools/bin/sqlcmd -S docker-feathertracker-database -U sa -P 'yourStrong(!)Password' -Q "IF DB_ID('FeatherTracker.Database') IS NOT NULL print 'YES'"`
    CODE=$?
    
    if [[ $RESULT == "YES" ]]
    then
        echo "Database already initialized."
        break;
    elif [[ $CODE -eq 0 ]] && [[ $RESULT == "" ]]
    then
        echo "Initializing database!"
	/opt/mssql-tools/bin/sqlcmd -l 5 -S docker-feathertracker-database -U sa -P 'yourStrong(!)Password' -d master -i /databaseinit/FeatherTracker.Database_Create.sql;
        break;
    else
        echo "Database not ready yet..."
        sleep 1
    fi
done

sleep infinity;