# use a custom combacal cht conf container
FROM dkfbasel/combacal.conf:1.1.0 as conf

RUN mkdir /app

RUN mkdir /data

COPY ./move-contacts.sh /app

WORKDIR /app

RUN chmod 700 /app/move-contacts.sh

CMD ["/app/move-contacts.sh"]