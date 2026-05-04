# Docker

This folder contains all the scripts needed to build the 3 docker images:
* `api.Dockerfile` to build the API
* `database.Dockerfile` to build the database
* `frontend.Docekrfile` to build the frontend

These images are build automatically by the GitHub actions run on a new version.

You can use the `docker-compose.yaml` file at the root of the project to start them all
in an already configured setup. Or you can run them individually with `docker run` if
you want.
