<p align="center">
    <img src="https://github.com/user-attachments/assets/17c57df2-4a10-45cf-b4ee-005dbd4e887d" width="200" height="200" />
</p>

# Feather Tracker
This is a small project for you to have your own self-hosted bird tracking tool.
You can use it for:
* Tracking: Keeping track of your birds age, quirks, etc.
* Weight: Regular weight logs can be saved and reviewed
* Recipies: Save chop recipies that your birds love!

And more are being made :)

<img width="1677" height="995" alt="image" src="https://github.com/user-attachments/assets/965b808d-aba7-441d-80e2-1371c83bddfe" />
<img width="1678" height="995" alt="image" src="https://github.com/user-attachments/assets/fc706c7b-a4a0-4f17-84d7-6902713a3065" />
<img width="1669" height="994" alt="image" src="https://github.com/user-attachments/assets/77055dc7-d0c8-4bd3-96f6-77304e2553a2" />

## Docker
You can quickly run this application with Docker, and explore if its something for you.
You have to have Docker installed and running.
From the root of the project, simply type `docker compose up -d`, to start all the services
that is needed.
You can then open the website on `http://localhost:52905`.

## Implementation Details

The tech-stack is:
* Database: SQL Server 2022 using TSQL
* API:      ASP.NET Web API using .NET 10
* Frontend: Angular 22 project using Taiga UI 5

Each folder for Database, API and Frontend each have a small readme for more info.
