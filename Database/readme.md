# Database

The database is a SQL Server database written in TSQL.
It is a relatively simple database, where each folder more or less corresponds to a 
plugin in the API.

## Development Tools
To start a local docker DB that you can deploy to:

`docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=yourStrong(!)Password' -p 1433:1433 --name primengtemplate-database -d mcr.microsoft.com/azure-sql-edge`

You can then connect to it as `localhost,1433`