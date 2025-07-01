#!/bin/bash

echo "Uploading data to CHT"

# NOTE: --force is overwriting all pre-existing forms on the instance

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


# the upload steps are taken from: https://combacal.atlassian.net/wiki/spaces/COMBACAL/pages/115965953/Development+Setup
# TODO: any uploads missing? e.g. branding?
# Upload new app settings
if ! cht --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST --force upload-app-settings
then
  echo "uploading app setting failed"
  exit 1
fi
# upload new app forms (workflow forms)
if ! cht --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST --force upload-app-forms
then
  echo "uploading app forms failed"
  exit 1
fi
# upload new contact forms
if ! cht --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST --force upload-contact-forms
then
  echo "uploading contact forms failed"
  exit 1
fi
# upload new resources
if ! cht --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST --force upload-resources
then
  echo "uploading resources failed"
  exit 1
fi
# upload new custom translations
if ! cht --url=$PROTOCOL://$CHT_USER:$CHT_PASSWORD@$CHT_HOST --force upload-custom-translations
then
  echo "uploading custom translations failed"
  exit 1
fi

echo "Data successfully uploaded"