#!/bin/bash -eu

source ./cmd/_config.sh
source ./cmd/_func.sh

info "RUN" "docker-compose up"
docker-compose up -d --build

# DBサーバー起動待ちのため遅延処理
sleep 2

# if [ -e $DUMP_FILE ]; then
#   info "RUN" "resotre $DUMP_FILE"
#   restoreDatabase
# fi

# open https://localhost:3000

cd ./app && yarn start:dev
