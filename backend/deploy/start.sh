#!/bin/sh
set -eu

node src/server.js &
API_PID="$!"

trap 'kill "$API_PID" 2>/dev/null || true' INT TERM

nginx -g "daemon off;" &
NGINX_PID="$!"

wait "$NGINX_PID"
