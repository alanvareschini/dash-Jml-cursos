#!/bin/sh
set -eu

PORT="${PORT:-80}"

echo "Starting Apache on PORT=${PORT}"

# Force a single MPM for mod_php compatibility.
a2dismod -f mpm_event mpm_worker >/dev/null 2>&1 || true
a2enmod mpm_prefork >/dev/null 2>&1 || true
rm -f /etc/apache2/mods-enabled/mpm_event.load \
      /etc/apache2/mods-enabled/mpm_event.conf \
      /etc/apache2/mods-enabled/mpm_worker.load \
      /etc/apache2/mods-enabled/mpm_worker.conf || true

# Railway injects a dynamic PORT; Apache must listen on it.
sed -ri "s/^[[:space:]]*Listen[[:space:]]+[0-9]+$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

apache2ctl -t

if [ "$#" -eq 0 ]; then
    set -- apache2-foreground
fi

exec "$@"
