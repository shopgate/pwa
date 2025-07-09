#!/bin/bash
STATUS=$1
MESSAGE=$2

curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\": \"$STATUS: $MESSAGE in $CI_JOB_NAME\"}" \
  $SLACK_WEBHOOK_URL

