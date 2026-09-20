# Docker

This folder contains all the scripts needed to build the 3 docker images:
* `api.Dockerfile` to build the API
* `database.Dockerfile` to build the database
* `frontend.Docekrfile` to build the frontend

These images are build automatically by the GitHub actions run on a new version.

You can use the `docker-compose.yaml` file at the root of the project to start them all
in an already configured setup. Or you can run them individually with `docker run` if
you want.

## Building
You can also build these images locally.
You have to be in the root of the project, build the database project, and copy the resulting "FeatherTracker.Database.dacpac" into the folder "./Docker/Database/"
Then you can build the images using docker:

`docker build -t feathertracker-database -f .\Docker\database.Dockerfile .`

`docker build -t feathertracker-api -f .\Docker\api.Dockerfile .`

`docker build -t feathertracker-frontend -f .\Docker\frontend.Dockerfile .`

