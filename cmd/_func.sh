#!/bin/bash -eu

function restoreDatabase() {
  docker exec -i $DB_CONTAINER_NAME sh -c "mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD" <$DUMP_FILE
}

function dumpDatabase() {
  if [ ! -e $DUMP_FILE ]; then
    mkdir $DUMP_FILE_DIR
  fi

  docker exec -it $DB_CONTAINER_NAME sh -c "mysqldump --no-tablespaces -h $DB_HOST -u $DB_USER -p$DB_PASSWORD --all-databases --events" >$DUMP_FILE
}

function info() {
  name=$1
  message=$2

  ESC=$(printf '\033')
  echo "${ESC}[37m$name: $message${ESC}[m"
}
