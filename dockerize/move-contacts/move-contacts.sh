#!/bin/bash

# Check if needed env vars are set
if [[ -z "${CHT_USER}" ]]
then
    echo "CHT_USER env is not set"
    exit 1
fi

if [[ -z "${CHT_PASSWORD}" ]]
then
    echo "CHT_PASSWORD env is not set"
    exit 1
fi

if [[ -z "${CHT_HOST}" ]]
then
    echo "CHT_HOST env is not set"
    exit 1
fi

# comma separated list of uids
if [[ -z "${CHT_CONTACTS}" ]]
then
    echo "CHT_CONTACTS env is not set"
    exit 1
fi

if [[ -z "${CHT_PARENT}" ]]
then
    echo "CHT_PARENT env is not set"
    exit 1
fi


echo "setup moving contacts $CHT_CONTACTS to parent $CHT_PARENT"

echo "clean up data folder"
rm -f /app/data/*

# the upload steps are taken from: https://combacal.atlassian.net/wiki/spaces/COMBACAL/pages/115965953/Development+Setup
# Upload new app settings
if ! cht move-contacts --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST -- --contacts=$CHT_CONTACTS --parent=$CHT_PARENT --docDirectoryPath=/app/data
then
  echo "create config file to move contacts failed"
  exit 1
fi

if [ $DRY_RUN ] 
then
  echo "in dry run mode to review created move contacts file"
  exit 0
fi


echo "executing moving contacts $CHT_CONTACTS to parent $CHT_PARENT"
if ! cht --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST upload-docs -- --docDirectoryPath=/app/data
then
  echo "moving contacts failed"
fi

echo "Contacs moved successfully"