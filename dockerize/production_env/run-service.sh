#!/bin/bash

# bash script to start run all containers necessary to run the CHT application
# 1. build and run dkfbasel/medicos:
#    - slightly modified medic-os container as run environment for CHT-Combacal App
#    - contains following internal services:
#     - medic-core: core package containing main services to run the application
#          - nginx: used as proxy, which proxies all request to medic-api
#          - couchDB: running on port 5985
#          - openssh: deactivated
#          - RDBMS: uninstalled (is run in a separate postgres container)
#          - couch2pg: uninstalled ( is run a separate postgres container)
#       - medic-api: processing all incoming request and proxy the request to right service
#       - medic-sentinel: runs background tasks for cht-app e.g. synchronization of DB
#       - horticulturalist: tool to deploy CHT core locally, used to setup the medic-os and the deployment of CHT-app
# 2. build and run haproxy:
#    - load balancer for CouchDB
# 3. build and run postgres 14.4
#    - persists couchDB data
#    - can be used for data exports
# 4. build and run cht-couch2pg:
#    - specific tool to export couchDB data to postgres (creates default views and materialized views)

run_haproxy(){
  echo "Run haproxy container..."
  # check if the env file exists

  if [[ ! -f haproxy.env ]]
  then
    echo "missing env file for haproxy"
    exit 1
  fi

  docker run -d \
    --name haproxy \
    --env-file haproxy.env \
    -e HA_PASSWORD=$MEDIC_PASSWORD \
    --mount type=bind,source=${DATA_BIND_PATH},target=/srv \
    --network medic-net \
    medicmobile/haproxy:rc-1.17

  if [ "$( docker container inspect -f '{{.State.Status}}' haproxy )" != "running" ]
  then
    echo "haproxy is not running"
    exit 
  fi
}


run_medicos(){
  echo "Run dkfbasel/combacal.medicos"

  if [[ ! -f medic-os.env ]]
  then
    echo "missing env file for medic-os"
    exit 1
  fi

  docker run -d \
    --name combacal.medicos \
    --env-file medic-os.env \
    -e DOCKER_COUCHDB_ADMIN_PASSWORD=$MEDIC_PASSWORD \
    --mount type=bind,source=${DATA_BIND_PATH},target=/srv \
    --network medic-net \
    --publish "0.0.0.0:8080:80" \
    --publish "127.0.0.1:8090:5985" \
    dkfbasel/combacal.medicos:1.0.0

  if [ "$( docker container inspect -f '{{.State.Status}}' combacal.medicos )" != "running" ]
  then
    echo "medic-os is not running"
    exit 1
  fi
}


run_postgres(){
  POSTGRES_DATA_BIND_PATH=/srv/combacal/data/postgres

  if [[ ! -f postgres.env ]]
  then
    echo "missing env file for postgres"
    exit 1
  fi

  echo "Run postgres"
  docker run -d \
    --name combacal.postgres-db \
    --network medic-net \
    --env-file postgres.env \
    --publish "127.0.0.1:5432:5432" \
    --mount type=bind,source=$POSTGRES_DATA_BIND_PATH,target=/var/lib/postgresql/data \
    postgres:14.4

  if [ "$( docker container inspect -f '{{.State.Status}}' combacal.postgres-db )" != "running" ]
  then
    echo "postgres is not running"
    exit 1
  fi
}

run_couch2pg(){

  if [[ ! -f couch2pg.env ]]
  then
    echo "missing env file for couch2pg"
    exit 1
  fi

  echo "Run couch2pg"
  docker run -d \
    --name combacal.couch2pg \
    --network medic-net \
    --env-file couch2pg.env \
    dkfbasel/combacal.couch2pg:1.0.0

  if [ "$( docker container inspect -f '{{.State.Status}}' combacal.couch2pg )" != "running" ]
  then
    echo "couch2pg is not running"
    exit 1
  fi

}

main(){

  if [[ ! "$(docker network ls | grep medic-net)" ]]
  then
    echo "Creating medic-net docker network"
    docker network create medic-net
  fi


  if [[ -z "$DATA_BIND_PATH" ]]
  then
    echo "Please define a path the application /srv should be mounted as env variable DATA_BIND_PATH"
    exit 1
  fi

  if [[ -z "$MEDIC_PASSWORD" ]]
  then
    echo "no password defined for the medic user, please set the env var MEDIC_PASSWORD"
    exit 1
  fi

  # no args provided so run all services
  if [[ "$#" -eq 0 ]]
  then
    # 1. Build and run medic-os
    run_medicos

    # 2. Build and run haproxy
    run_haproxy


    # 3. build and run postgres
    run_postgres

    # 4. build and run couch2pg
    run_couch2pg
    exit 0
  fi

  # only run the provided services
  for service in "$@"
  do
    run_"$service"
  done

}

main "$@"

