#!/bin/bash

# QuoteCanvas Deployment Script
# Supports Docker Hub, GitHub Container Registry, and AWS ECR

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="quotecanvas"
VERSION=$(date +%Y%m%d-%H%M%S)

echo -e "${BLUE}🚀 QuoteCanvas Deployment Script${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Select registry
echo "Select deployment target:"
echo "1) Docker Hub"
echo "2) GitHub Container Registry (ghcr.io)"
echo "3) AWS ECR"
echo "4) Local build only"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        REGISTRY="docker.io"
        read -p "Docker Hub username: " DOCKER_USER
        FULL_IMAGE="$DOCKER_USER/$IMAGE_NAME"
        ;;
    2)
        REGISTRY="ghcr.io"
        read -p "GitHub username/org: " GITHUB_USER
        FULL_IMAGE="ghcr.io/$GITHUB_USER/$IMAGE_NAME"
        ;;
    3)
        REGISTRY="aws-ecr"
        read -p "AWS Account ID: " AWS_ACCOUNT
        read -p "AWS Region: " AWS_REGION
        FULL_IMAGE="$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME"
        ;;
    4)
        REGISTRY="local"
        FULL_IMAGE="$IMAGE_NAME"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}📦 Building image: $FULL_IMAGE:$VERSION${NC}"

# Build the image
docker build -t "$FULL_IMAGE:$VERSION" -t "$FULL_IMAGE:latest" .

echo -e "${GREEN}✅ Build completed successfully!${NC}"

if [ "$REGISTRY" != "local" ]; then
    echo ""
    echo -e "${YELLOW}🔐 Logging in to registry...${NC}"
    
    case $choice in
        1)
            docker login
            ;;
        2)
            echo "Please ensure you have a GitHub token with packages:write scope"
            docker login ghcr.io
            ;;
        3)
            echo "Configuring AWS ECR..."
            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
            ;;
    esac
    
    echo ""
    echo -e "${YELLOW}📤 Pushing images...${NC}"
    docker push "$FULL_IMAGE:$VERSION"
    docker push "$FULL_IMAGE:latest"
    
    echo -e "${GREEN}✅ Push completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🎉 Deployment completed!${NC}"
    echo -e "${BLUE}Image available at: $FULL_IMAGE:latest${NC}"
    echo ""
    echo -e "${YELLOW}Quick run command:${NC}"
    echo "docker run -p 8000:8000 $FULL_IMAGE:latest"
else
    echo ""
    echo -e "${GREEN}✅ Local build completed!${NC}"
    echo -e "${YELLOW}Run locally with:${NC}"
    echo "docker run -p 8000:8000 $FULL_IMAGE:latest"
fi

echo ""
echo -e "${BLUE}🌐 QuoteCanvas will be available at: http://localhost:8000${NC}"