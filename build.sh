#!/bin/bash

echo "Help"
echo "Call with parameters to customize the build: ./build.sh <BUILD_TYPE> <VERSION>"
echo "BUILD_TYPE optional parameter allows (ex.: homologation or production)"
echo "VERSION optional parameter allows (ex.: v1.1 or v1.2-beta among others)"
echo ""


# get version number to build image
if [[ ! "$2" = "" ]]; then
    VERSION=$2
else
    
    PACKAGE_VERSION=$(cat package.json | grep -oP '(?<="version": ")[^"]*')
    if [[ ! "$PACKAGE_VERSION" = "" ]]; then
        echo "Auto detect the project version from package.json file and we'll use the version number: v$PACKAGE_VERSION"
        VERSION="v$PACKAGE_VERSION"
    else
        echo "Need one number to versioning this image. Enter one:" ; read VERSION
        if [[ "$VERSION" = "" ]]; then
            echo "Read fail! Aborting...."
            exit
        fi
    fi
fi

# environment to homologation or production build
# to homologation use homologation
if [[ "$1" = "homologation" ]]; then
    BUILD_TYPE="$1"
    VERSION="hom_$VERSION"
else
    # adopt production by default
    BUILD_TYPE="production"
    VERSION="prod_$VERSION"
fi

echo "Building $BUILD_TYPE mode..."
echo "Building terrabrasilis/deforestation-dashboard:$VERSION"
echo "...................................................."
docker build -t terrabrasilis/deforestation-dashboard:$VERSION -f Dockerfile.${BUILD_TYPE} .

echo "The building was finished! Do you want sending this new image to Docker HUB? Type yes to continue." ; read SEND_TO_HUB
if [[ ! "$SEND_TO_HUB" = "yes" ]]; then
    echo "Ok, not send the image."
else
    echo "Nice, sending the image!"
    docker push terrabrasilis/deforestation-dashboard:$VERSION
fi;