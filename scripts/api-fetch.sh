#!/bin/bash

# API Data Fetching test script
# =============================================
# This is an example script for fetching some sample data from the API.
# - MODE:           DEV or TEST or PROD (will automatically choose corresponding EC2 instance from .env or repo variables)
# - USER_NAME:      CHT username for administrator
# - USER_PASSWORD:  CHT password for administrator

# Get env variables (local only)
if [ -f ../.env ]
then
  export "$(cat ../.env | sed 's/#.*//g' | xargs)"
fi

# List of available modes
VALID_MODES=("PROD" "TEST" "DEV")

if printf '%s\n' "${VALID_MODES[@]}" | grep -Fxq "$MODE"; then
  echo "Connecting to $MODE instance..."

  # Find corresponding environment variable (EC2_DEV, EC2_TEST or EC2_PROD)
  ec2_name=EC2_$MODE

  # Find EC2 instance
  ec2=${!ec2_name}

  # This is just an example for getting the contacts. You can use any available API call, see:
  # https://docs.communityhealthtoolkit.org/apps/reference/api/#get-apiv2exportmessages
  apiCall='api/v2/export/contacts'

  url="http://${USER_NAME}:${USER_PASSWORD}@${ec2}/${apiCall}"

  # Curl some data (-k to allow insecure connect, -L to follow 301 codes, -m for timeout)
  # You can also use wget if you need to store data to a file.
  curl -k -m 2 -L "$url"

  echo "API fetch in mode $MODE completed!"
else
  echo "Error: Invalid mode $MODE"
fi


