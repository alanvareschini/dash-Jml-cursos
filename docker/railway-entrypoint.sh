#!/bin/sh
set -eu

PORT="${PORT:-80}"

echo "Starting Apache on PORT=${PORT}"

# Railway injects a dynamic PORT; Apache must listen on it.
sed -ri "s/^[[:space:]]*Listen[[:space:]]+[0-9]+$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

apache2ctl -t

exec "$@"
