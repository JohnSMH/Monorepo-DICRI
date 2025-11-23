#!/bin/bash

# Ensure script has execution permission (Windows mount fix)
chmod +x /entrypoint.sh

echo "Starting SQL Server..."
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to be fully up
sleep 30s

echo "Running init.sql..."
/opt/mssql-tools/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P $MSSQL_SA_PASSWORD \
  -d master \
  -i /init.sql

echo "Init script executed."

wait