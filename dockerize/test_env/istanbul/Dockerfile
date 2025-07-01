# Docker image to build a container having all needed dependecies
# installed to create a test environment to run all tests of the cht-combacal-config-code repos
FROM ubuntu:22.04

# install test dependencies
RUN apt-get update -y
# needed dependencies to run puppeteer and headless chrome on ubunutu 
RUN apt-get install -y libgbm-dev ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils


# Install chromium browser to run tests in headless chrome
RUN apt-get install -y chromium-browser

# install nodejs (cht-conf is a nodejs application)
RUN apt-get install -y curl
# use new version of nodejs (16+) to run test
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

# install test dependencies
RUN npm install --location=global puppeteer@16.0.0
RUN npm install --location=global nyc@15.1.0
RUN npm install --location=global mocha@9.2.2
RUN npm install --location=global chai@4.3.6
RUN npm install --location=global semver@7.3.7
RUN npm install --location=global eslint@8.15.0
RUN npm install --location=global eslint-plugin-node@11.1.0
RUN npm install --location=global eslint-plugin-json@3.1.0
RUN npm install --location=global cht-conf-test-harness@2.4.1
RUN npm install --location=global @medic/eslint-config@1.1.0

# keep the container running
CMD tail -f /dev/null