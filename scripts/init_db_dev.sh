#!/usr/bin/env bash
while ! nc -z localhost 9042
do
  echo "waiting for C*..."
  sleep 5
done
echo "C* ready, initializing"
# Replace container ID below with your dev instance
docker exec -it cassandra_dev cqlsh -f /db/init_db.cql
