# SOURCE: https://github.com/medic/cht-conf/blob/main/Dockerfile
FROM node:16-slim

RUN apt update \
    && apt install --no-install-recommends -y \
      build-essential \
      chromium \
      curl \
      git \
      openssh-client \
      python3-pip \
      python3-setuptools \
      python3-wheel \
      xsltproc \
    # Remove chromium to save space. We only installed it to get the transitive dependencies that are needed
    # when running tests with puppeteer. (puppeteer-chromium-resolver will always download its own version of chromium)
    && apt remove -y chromium \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic

RUN npm install -g cht-conf@3.21.5
# Install specifically needed eslint modules: @medic/eslint-config
# https://www.npmjs.com/package/@medic/eslint-config
RUN npm install -g eslint@8.15.0
RUN npm install -g eslint-plugin-node@11.1.0
RUN npm install -g eslint-plugin-json@3.1.0
RUN npm install -g @medic/eslint-config@1.1.0