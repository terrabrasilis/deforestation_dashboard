#!/bin/bash

echo "Help"
echo "Call with parameters to customize the build: ./build-compose.sh <VERSION>"
echo "VERSION parameter allows (ex.: v1.1 or v1.2-beta among others)"
echo ""

# get version number to build image
if [[ ! "$1" = "" ]]; then
    VERSION=$1
else
    echo "Need one number to versioning this image. Enter one:" ; read VERSION
    if [[ "$VERSION" = "" ]]; then
        echo "Read fail! Aborting...."
        exit
    fi
fi

echo "Building terrabrasilis/terrabrasilis-webapp:$VERSION-local"
echo "...................................................."

ENV="production"
BUILD_TYPE="compose"

echo "Building $ENV mode..."
echo "........................"

docker build --no-cache --build-arg ENV=$ENV --build-arg BUILD_TYPE=$BUILD_TYPE -t terrabrasilis/terrabrasilis-webapp:$VERSION-local -f webapp-compose.dockerfile .
