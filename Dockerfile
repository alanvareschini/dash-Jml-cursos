FROM php:8.2-apache

# Esta linha instala o driver do MySQL dentro do servidor PHP
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copia seus arquivos para o servidor
COPY . /var/www/html/

# Ajusta as permissões
RUN chown -R www-data:www-data /var/www/html/

