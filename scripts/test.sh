#!/bin/bash

# Test script for Bitbucket pipelines
# =============================================
# Executes all tests with Mocha
# Note: The predeploy.sh script must be run before this one, in order to have the needed dependencies.

  echo "Installing dependencies..."
  apt-get update
  apt-get install -y libgbm-dev
  apt-get install -y chromium

  apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

  rm package-lock.json

  npm install
  npm install puppeteer
  npm install -g mocha
  npm install chai
  npm install -g nyc

  echo "Converting XSLS to XForms..."
  cht --accept-self-signed-certs convert-app-forms
  cht --accept-self-signed-certs convert-contact-forms
  
  echo "Compiling app-settings..."
  cht --accept-self-signed-certs compile-app-settings

  echo "Running tests..."
  if ! nyc mocha --recursive; then
    echo "Tests failed, see log for details."
    exit 1
  else
    echo "Tests completed successfully!"
    exit 0
  fi
