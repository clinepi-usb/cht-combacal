FROM alpine:latest

# create needed user and groups to keep file ownserships
# when copying data into the container
# otherwise the ownership will be changed to root

# horticulturalist group and user
RUN addgroup -g 95 horticulturalist
RUN adduser -G horticulturalist -u 95 horticulturalist -D

# avahi group and user
RUN addgroup -g 1000 avahi
RUN adduser -G avahi -u 999 avahi -D

# staff group
RUN addgroup -g 50 staff

# couchdb group and user
RUN addgroup -g 1001 couchdb
RUN adduser -G couchdb -u 998 couchdb -D

RUN mkdir /data-srv
COPY ./srv /data-srv

# created by running following cmd in medic os container:
# find . -printf 'chown %U:%G %hf/%f\n' > restore-original-ownerships.sh
# the script can be used to restore all needed permissions on the directories
# as copying the data to container as transport vehicle for the bootstrapped CHT
# App resets all ownership's to root (UID:0) when copying the files into the container.
# Permissions are not changed.
COPY ./restore-original-ownerships.sh /data-srv

RUN chmod +x /data-srv/restore-original-ownerships.sh

WORKDIR /data-srv

# restore the original ownerships of a freshly initialized and bootstrapped CHT-application
RUN ./restore-original-ownerships.sh

WORKDIR /

# # copy files in preserve mode using option p otherwise ownerships gets lost again
ENTRYPOINT ["cp", "-rp", "/data-srv", "/srv"]