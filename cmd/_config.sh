#!/bin/bash -eu

source .env

DB_CONTAINER_NAME="mysql"
DB_HOST="localhost"
DB_USER=$MYSQL_USER
DB_PASSWORD=$MYSQL_PASSWORD

DUMP_FILE_DIR="mysql/sql/"
DUMP_FILE=$DUMP_FILE_DIR"dump.sql"
