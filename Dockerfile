FROM php:8.2-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql

COPY frontend/ /var/www/html/
COPY backend/api/ /var/www/html/api/
COPY backend/config/ /var/www/html/config/

RUN chown -R www-data:www-data /var/www/html/

EXPOSE 80
