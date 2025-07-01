#!/bin/bash

# Pre-deployment script for Bitbucket pipelines
# =============================================
# Installs all necessary tools and sets up permissions.
# This script must be run before deploying with 'deploy.sh'

echo "Installing deployment dependencies..."
apt-get update
apt-get -y install python-dev
python --version
curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py
python get-pip.py
npm -g config set user root
npm install -g cht-conf@3.10.2
npm i moment
npm i eslint
npm i @medic/eslint-config
npm i eslint-plugin-json
pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
echo "Setting key file permissions..."
chmod 400 combacal.pem
echo "Pre-deploy complete!"
