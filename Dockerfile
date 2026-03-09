FROM php:8.2-apache

RUN set -eux; \
    rm -f /etc/apache2/mods-enabled/mpm_event.load \
          /etc/apache2/mods-enabled/mpm_event.conf \
          /etc/apache2/mods-enabled/mpm_worker.load \
          /etc/apache2/mods-enabled/mpm_worker.conf; \
    a2dismod -f mpm_event mpm_worker mpm_prefork || true; \
    a2enmod mpm_prefork; \
    docker-php-ext-install mysqli pdo pdo_mysql

COPY frontend/ /var/www/html/
COPY backend/api/ /var/www/html/api/
COPY backend/config/ /var/www/html/config/
COPY docker/railway-entrypoint.sh /usr/local/bin/railway-entrypoint.sh

RUN chmod +x /usr/local/bin/railway-entrypoint.sh \
    && chown -R www-data:www-data /var/www/html/

EXPOSE 80
CMD ["railway-entrypoint.sh"]
