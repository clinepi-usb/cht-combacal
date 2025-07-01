# Installation Guide

This guide describes how to setup an fresh installation of the CHT application running on medic-os on a server instance.
After successfully applying all described steps you will end up with a Maternal and Newborn Health Reference App https://docs.communityhealthtoolkit.org/apps/examples/anc/

The medic-os service tries to install the cht application on start-up via horticulturalist, a library to deploy cht applications on medic-os server.
this requires the service to communicate to external while also be able to reach the haproxy for authentication reasons. As the combacal server runs
inside the USB-server environment we need to setup the proxy configuration of the docker containers to allow external communications and limit
internal communications via setting the no_proxy option.

## Problem:

As horticulturalist runs a nodejs request command to check if the couchdb is reachable via the haproxy (meaning the horti inside of the medicos calls
the haproxy to connect to the couchdb inside of the medicos). Unfortunately nodejs request ignores the env for no_proxy if a proxy is set, that is the
case as the container needs to download the update files from an external server, so the check request is proxied and never reaches the couchdb.

## Solution:

Instead of running the horticulturalist bootstrapping on the server, we prepare them locally and copy the complete ./srv directory to the server.
As an result it is no longer required to setup a proxy as the medic-os service should no longer need to communicate to external.

Therefore we build the medic-os image with pre-installed updates by running the underlaying supervisor. there is also a custom nginx config file
and an altered system-container-start script, that are copied into the container image.

## Setup Steps:

*Run the following steps on your local environment*:

1. Build the docker image for medic-os running

   `docker compose build medic-os`

2. IMPORTANT: set an env variable MEDIC_PASSWORD containing a secure password for the "medic" user.
   The passwords can be found in the wallets of 1Password for the corresponding server instance dkfsolmedlk01 or dkfsolmedlp01

   `export MEDIC_PASSWORD='your-secure-password'`

   The variable is then used in the 'run-service.sh' script

   NOTE: This step is necessary to set a save password for production to not accidentally use a weak password from your local production environment as
   the configuration files of couchDB are saved within the medic-data container which is loaded on the server instances

3. Define a absolute local path were you the /srv file should be locally mounted by defining the DATA_BIND_PATH env variable.
   
   `export DATA_BIND_PATH="your-local-path"`

4. Comment the `DOCKER_HORTI_BOOTSTRAP_DISABLED` env var in the `medic-os.env` file to trigger that horticulturalist bootstraps the CHT application

5. If you have an existing srv directory at the defined path (DATA_BIND_PATH) make sure it is empty

6. Start the medic-os container with a mounted ./srv directory where all service data are stored

   `./run-service.sh medicos`

7. Run the haproxy service

   `./run-service.sh haproxy`

!NOTE: watch the combacal.medicos os logs and wait until the bootstrapping is complete: *"Info: Horticulturalist bootstrapping complete"*

8. Stop both containers

   `docker stop combacal.medicos haproxy`

9. IMPORTANT: unset the MEDIC_PASSWORD on your local system

   `unset MEDIC_PASSWORD`

10. Change the permissions on the ./srv directory as some .d files require execute permissions. So to copy the files into the image upgraded permissions must be granted.

   `sudo chmod -R 777 ./srv` 

11. Copy the /srv directory into a docker image. this image will function as the data copy instance

   `docker compose build medic-data`

12. Push the medic-os and medic-data images to docker hub:
    `docker compose push medic-os medic-data`

With this set up, external communication is no longer required

*Run the following steps on the server*:

14. Login to the server

***WARNING*: when executing the script of the next step, the existing local srv directory will be overwritten and existing DB files are lost.
So, make sure you have a backup of you local ./srv directory before performing the next step!!**

15. Run the `medicos-data.sh` script

16. Make sure the `DOCKER_HORTI_BOOTSTRAP_DISABLED` variable in the medic-os.env file is defined and set `true`

17. Remove the medicos-data container as the data are copied into the /srv/combacal/data/data-srv directory

    `docker rm -f medicos-data`

18. Rename the directory to ./srv and grant 777 permissions

19. Run both the medic-os and the haproxy container on the server

    `./run-service.sh medicos haproxy`

20. Check medicos if horticulturalist has already boostrapped and couchdb already configured

    `docker logs -f combacal.medicos`

21. Check haproxy if connections could be established to hte medicos couchdb

    `docker logs -f haproxy`