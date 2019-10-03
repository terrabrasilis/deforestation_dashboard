#!/bin/bash

sudo docker run --rm --name deforestation-dashboard -p 8081:80 terrabrasilis/deforestation-dashboard:$1
