#!/usr/bin/env bash
while ! nc -z localhost 9042
do
  echo "waiting for C*..."
  sleep 5
done
echo "C* ready, initializing"
docker exec -it nodeapicassandra_db_1 cqlsh -f /db/init_db.cql
