#!/bin/bash -eu

source ./cmd/_config.sh
source ./cmd/_func.sh

if [ "$(docker container ls -q -f name="$DB_CONTAINER_NAME")" ]; then
  info "RUN" "mysqldump"
  dumpDatabase

  info "RUN" "docker-compose down"
  docker-compose down --volumes
else
  echo "Container not exist."
fi
