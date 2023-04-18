FROM php:8.1-fpm-buster

ENV COMPOSER_ALLOW_SUPERUSER=1 \
  COMPOSER_HOME=/composer

COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

RUN apt-get update && \
  apt-get -y install --no-install-recommends git unzip libzip-dev libicu-dev libonig-dev && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  docker-php-ext-install intl pdo_mysql zip bcmath

RUN apt-get update && \
  apt-get -y install git libicu-dev libonig-dev libzip-dev unzip nodejs npm vim unzip libfreetype6-dev libjpeg62-turbo-dev libpng-dev libjpeg-dev \
  && docker-php-ext-install \
                pdo_mysql \
                bcmath \
                gd \
  && docker-php-ext-configure gd \
                --with-freetype=/usr/include/ \
                --with-jpeg=/usr/include/ \
  && docker-php-ext-install -j$(nproc) gd

COPY ./php.ini /usr/local/etc/php/php.ini

WORKDIR /data