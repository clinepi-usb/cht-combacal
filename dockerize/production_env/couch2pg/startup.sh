#!/bin/bash

set -e
WAIT_THRESHOLD="${WAIT_THRESHOLD:-20}"
SLEEP_SECONDS="${SLEEP_SECONDS:-5}"

welcome_message(){
  echo "Starting couch2pg process">&2
}

set_postgres_url(){
  export POSTGRESQL_URL=postgres://$POSTGRES_USER_NAME:$POSTGRES_PASSWORD@$POSTGRES_SERVER_NAME:$POSTGRES_PORT/$POSTGRES_DB_NAME
  echo "Set postgres URL to postgres://$POSTGRES_USER_NAME:...@$POSTGRES_SERVER_NAME:$POSTGRES_PORT/$POSTGRES_DB_NAMEL" >&2
}

check_if_postgres_is_ready(){
  # check if postgres is up
  wait_count=0
  echo "check_if_postgres_is_ready with \"pg_isready -q  -h $POSTGRES_SERVER_NAME -U $POSTGRES_USER_NAME --d $POSTGRES_DB_NAME\""
  until  pg_isready -q  -h $POSTGRES_SERVER_NAME -U $POSTGRES_USER_NAME --d $POSTGRES_DB_NAME
  do
    echo "Waiting for PostgreSQL..." >&2
    wait_count=$((wait_count +1))
    if [[ "$wait_count" -gt $WAIT_THRESHOLD ]]; then
      echo "No  PostgreSQL DB Found" >&2
      exit 1
    fi
    sleep $SLEEP_SECONDS
  done
echo "Postgres is ready moving on ...">&2
}

set_couch_url(){
  export COUCHDB_URL=http://$COUCHDB_USER:$COUCHDB_ADMIN_PASSWORD@$COUCHDB_HOST/$COUCHDB_DB
  echo "Set couchDB URL to: http://$COUCHDB_USER:...@$COUCHDB_HOST/$COUCHDB_DB"
}

get_couch_http_code(){
  curl --silent --show-error --head "$COUCHDB_URL/" --write-out '%{http_code}' | tail -n1
}


check_if_couchdb_is_ready(){
  # check if couchdb is up
  wait_count=0
  echo "START Checking for cht couchdb at http://$COUCHDB_USER:...@$COUCHDB_HOST/$COUCHDB_DB/" >&2
  HTTP_CODE=$(get_couch_http_code)
  until get_couch_http_code | grep "200" > /dev/null
  do
    echo "Waiting for cht couchdb, HTTP code: $HTTP_CODE" >&2
    wait_count=$((wait_count +1))
    if [[ "$wait_count" -gt $WAIT_THRESHOLD ]]; then
      echo "No couchdb end point Found" >&2
      exit 1
    fi
    sleep $SLEEP_SECONDS
  done
  echo "couchdb  is ready">&2

}

launch_couch2pg(){
  cd /app/cht-couch2pg
  node index.js
}


main (){

welcome_message
set_couch_url
set_postgres_url
check_if_couchdb_is_ready
check_if_postgres_is_ready
echo "Launching couch2pg">&2
launch_couch2pg
}


"$@"