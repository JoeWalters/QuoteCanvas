#!/bin/bash

# QuoteCanvas Docker Build and Deploy Script
# Usage: ./docker-build.sh [tag] [registry]

set -e

# Configuration
IMAGE_NAME="quotecanvas"
DEFAULT_TAG="latest"
DEFAULT_REGISTRY=""

# Parse arguments
TAG=${1:-$DEFAULT_TAG}
REGISTRY=${2:-$DEFAULT_REGISTRY}

# Set full image name
if [ -n "$REGISTRY" ]; then
    FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"
else
    FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"
fi

echo "🏗️  Building QuoteCanvas Docker Image"
echo "📦 Image: $FULL_IMAGE_NAME"
echo ""

# Build the image
echo "🔨 Building Docker image..."
docker build -t "$FULL_IMAGE_NAME" .

echo "✅ Build completed successfully!"
echo ""

# Tag with latest if not already latest
if [ "$TAG" != "latest" ]; then
    if [ -n "$REGISTRY" ]; then
        docker tag "$FULL_IMAGE_NAME" "$REGISTRY/$IMAGE_NAME:latest"
        echo "🏷️  Tagged as $REGISTRY/$IMAGE_NAME:latest"
    else
        docker tag "$FULL_IMAGE_NAME" "$IMAGE_NAME:latest"
        echo "🏷️  Tagged as $IMAGE_NAME:latest"
    fi
fi

echo ""
echo "🎉 QuoteCanvas Docker image built successfully!"
echo "📋 Available commands:"
echo ""
echo "   Run locally:"
echo "   docker run -p 8000:8000 $FULL_IMAGE_NAME"
echo ""
echo "   Run with docker-compose:"
echo "   docker-compose up -d"
echo ""

if [ -n "$REGISTRY" ]; then
    echo "   Push to registry:"
    echo "   docker push $FULL_IMAGE_NAME"
    echo ""
    
    read -p "🚀 Push to registry now? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing to registry..."
        docker push "$FULL_IMAGE_NAME"
        
        if [ "$TAG" != "latest" ]; then
            docker push "$REGISTRY/$IMAGE_NAME:latest"
        fi
        
        echo "✅ Push completed successfully!"
        echo "🌐 Image available at: $FULL_IMAGE_NAME"
    fi
fi

echo ""
echo "🎯 QuoteCanvas is ready to deploy!"