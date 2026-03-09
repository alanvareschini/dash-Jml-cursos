#!/bin/sh
set -eu

PORT="${PORT:-80}"

# Railway injects a dynamic PORT; Apache must listen on it.
sed -ri "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
