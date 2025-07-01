# Source: https://docs.communityhealthtoolkit.org/apps/tutorials/couch2pg-setup/
# CHT-couch2pg tool nieed nodejs 8 - 12 --> not supported on ubnutu22.04
FROM ubuntu:18.04

RUN apt-get update -y
RUN apt-get install -y curl
RUN apt-get install -y postgresql-client

# CHT-couch2pg tool need nodejs 8 - 12
RUN curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

RUN mkdir /app

WORKDIR /app

RUN apt-get update -y
RUN apt-get install -y git

RUN git clone https://github.com/medic/cht-couch2pg.git

# set default env vars
# number of documents Couch2pg will fetch in each query
ENV COUCH2PG_DOC_LIMIT=1000
# amount of times couch2pg should retry a failed connection before it fails
ENV COUCH2PG_RETRY_COUNT=5
# interval size in minutes Couch2pg will use to poll Couchdb.
ENV COUCH2PG_SLEEP_MINS=120
# number of changes to query since the last sync operation
ENV COUCH2PG_CHANGES_LIMIT=1000

WORKDIR /app/cht-couch2pg

# install dependencies
RUN npm install pg@8.7.1
RUN npm ci

WORKDIR /app
COPY ./couch2pg/startup.sh .
RUN chmod +x startup.sh

WORKDIR /


# run the service
ENTRYPOINT ["/app/startup.sh"]
CMD ["main"]