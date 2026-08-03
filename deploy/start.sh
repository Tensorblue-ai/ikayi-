#!/bin/sh
set -eu

node server.js &
NEXT_PID="$!"

trap 'kill "$NEXT_PID" 2>/dev/null || true' INT TERM

nginx -g "daemon off;" &
NGINX_PID="$!"

wait "$NGINX_PID"
