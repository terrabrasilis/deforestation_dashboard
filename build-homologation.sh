#!/bin/bash

echo "Help"
echo "Call with parameters to customize the build: ./build-prod.sh <VERSION>"
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

echo "Building terrabrasilis/terrabrasilis-webapp:$VERSION"
echo "...................................................."

ENV="production"
BUILD_TYPE="homologation"

echo "Building $ENV mode..."
echo "........................"

docker build --no-cache --build-arg ENV=$ENV --build-arg BUILD_TYPE=$BUILD_TYPE -t terrabrasilis/terrabrasilis-webapp:$VERSION -f webapp-compose.dockerfile .

echo "The building was finished! Do you want sending this new image to Docker HUB? Type yes to continue." ; read SEND_TO_HUB
if [[ ! "$SEND_TO_HUB" = "yes" ]]; then
    echo "Ok, not send the image."
else
    echo "Nice, sending the image!"
    ./push.sh "$VERSION"
fi