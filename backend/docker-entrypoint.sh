#!/bin/sh
set -e

if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
fi

echo "Starting server..."
exec node dist/server.js
