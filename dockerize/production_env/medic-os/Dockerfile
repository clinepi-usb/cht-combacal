FROM medicmobile/medic-os:cht-3.9.0-rc.2

# we start postgres and couch2db in a separate docker container
# therefore remove the not needed medic-os packages  for couch2pg and rdbms
RUN rm -rf /mnt/startup/packages/medic-rdbms-v94122-x64.vpkg
RUN rm -rf /mnt/startup/packages/medic-couch2pg-v10000-x64.vpkg

# replace the nginx config file
# all request are handeled via normal http
# https is no required as the container runs either locally or the https communtiation
# is handled by the USB proxy server. All services of the CHT are running on the same server instance
# and no other remote server has be requested, therefore the communication can be run via http on localhost

RUN mkdir -p /nginx/custom-configs
COPY ./medic-os/nginx.conf /nginx/custom-configs/nginx.conf

# replace the startup script
COPY ./medic-os/system-container-start /boot/system-container-start
RUN chmod +x /boot/system-container-start

ENTRYPOINT /boot/container-start /