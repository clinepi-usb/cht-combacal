#!/bin/bash

# Deployment script for Bitbucket pipelines
# =============================================
# Deploys the current repository state to the given EC2 instance.
# Params:
# - MODE:           DEV or TEST or PROD (will automatically choose corresponding EC2 instance from .env or repo variables)
# - NO_PROMPT:      can be set to 'true' to skip manual confirmation prompt (used for Bitbucket pipelines)
# - USER_NAME:      CHT username for administrator
# - USER_PASSWORD:  CHT password for administrator

# Ensure .pem key exists
if not [ -f combacal.pem ]
then
  echo "Error: Key file 'combacal.pem' not found!"
  exit
fi

# Confirmation prompt (can be skipped by setting 'NO_PROMPT' to 'true')
if [[ "$NO_PROMPT" != "true" ]]
then
  echo "Are you sure you want to deploy in mode $MODE?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

# List of available deployment modes
VALID_MODES=("PROD" "TEST" "DEV")

if printf '%s\n' "${VALID_MODES[@]}" | grep -Fxq "$MODE"; then
  echo "Deploying in mode $MODE..."
  # Find corresponding environment variable (EC2_DEV, EC2_TEST or EC2_PROD)
  ec2_name=EC2_$MODE
  ec2=${!ec2_name}

  # Upload all files via SCP
  echo "Uploading configuration to $MODE EC2 instance ($ec2)..."
  scp -r -i combacal.pem app_settings* ubuntu@"${ec2}":~/cht-core/config/combacal/app_settings
  scp -r -i combacal.pem branding* ubuntu@"${ec2}":~/cht-core/config/combacal/branding
  scp -r -i combacal.pem data* ubuntu@"${ec2}":~/cht-core/config/combacal/data
  scp -r -i combacal.pem forms* ubuntu@"${ec2}":~/cht-core/config/combacal/forms
  scp -r -i combacal.pem resources* ubuntu@"${ec2}":~/cht-core/config/combacal/resources
  scp -r -i combacal.pem tasks* ubuntu@"${ec2}":~/cht-core/config/combacal/tasks
  scp -r -i combacal.pem translations* ubuntu@"${ec2}":~/cht-core/config/combacal/translations
  scp -i combacal.pem app_settings.json ubuntu@"${ec2}":~/cht-core/config/combacal/app_settings.json
  scp -i combacal.pem contact-summary.templated.js ubuntu@"${ec2}":~/cht-core/config/combacal/contact-summary.templated.js
  scp -i combacal.pem contact-summary-extras.js ubuntu@"${ec2}":~/cht-core/config/combacal/contact-summary-extras.js
  scp -i combacal.pem nools-extras.js ubuntu@"${ec2}":~/cht-core/config/combacal/nools-extras.js
  scp -i combacal.pem resources.json ubuntu@"${ec2}":~/cht-core/config/combacal/resources.json
  scp -i combacal.pem targets.js ubuntu@"${ec2}":~/cht-core/config/combacal/targets.js
  scp -i combacal.pem tasks.js ubuntu@"${ec2}":~/cht-core/config/combacal/tasks.js
  scp -i combacal.pem .eslintrc ubuntu@"${ec2}":~/cht-core/config/combacal/.eslintrc
  echo "Files uploaded!"

  # Re-run CHT on remote instance (with --force to apply all without prompts)
  echo "Redeploying on remote instance..."
  cht --url=https://"${USER_NAME}":"${USER_PASSWORD}"@"${ec2}" --accept-self-signed-certs --force

  echo "Deploy in mode $MODE completed!"
else
  echo "Error: Invalid mode $MODE"
fi
