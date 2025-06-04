#!/bin/bash

echo "Stopping containers..."
docker-compose down

echo "Removing library-api container if it exists..."
docker rm -f library-api 2>/dev/null || true

echo "Removing libraryapp-api image if it exists..."
docker rmi libraryapp-api 2>/dev/null || true

echo "Starting containers..."
docker-compose up -d

echo "Done! Containers are running in the background."