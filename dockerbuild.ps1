# Rebuild solution
msbuild /t:Build .\Database\FeatherTracker.Database /p:Configuration=Release /p:OutputPath=./../../Docker/Database

# Build all images
docker build -t kris701/feathertracker-database -f .\Docker\database.Dockerfile .
docker build -t kris701/feathertracker-api -f .\Docker\api.Dockerfile .
docker build -t kris701/feathertracker-frontend -f .\Docker\frontend.Dockerfile .

# Publish
docker push kris701/feathertracker-database
docker push kris701/feathertracker-api
docker push kris701/feathertracker-frontend