# Rebuild solution
msbuild /t:Build .\Database\FeatherTracker.Database /p:Configuration=Release /p:OutputPath=./../../Docker/Database

# Build all images
docker build -t docker-feathertracker/database -f .\Docker\database.Dockerfile .
docker build -t docker-feathertracker/api -f .\Docker\api.Dockerfile .
docker build -t docker-feathertracker/frontend -f .\Docker\frontend.Dockerfile .