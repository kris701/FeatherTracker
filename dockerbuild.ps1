# Build all images
docker build -t feathertracker/api -f .\Docker\api.Dockerfile .
docker build -t feathertracker/frontend -f .\Docker\frontend.Dockerfile .