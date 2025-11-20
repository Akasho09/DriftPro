#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

echo "Waiting for Postgres ($host) to be ready..."

until pg_isready -h "$host" -U "driftpro" >/dev/null 2>&1; do
  echo "Postgres not ready yet... retrying in 2s"
  sleep 2
done

echo "Postgres is ready! Executing command..."
exec $cmd
