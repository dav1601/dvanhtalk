# Turn on maintenance mode
php artisan down
# Pull the latest changes from the git repository
git pull origin master
# update pr
sudo chown -R www-data:www-data .
# Install/update composer dependecies
composer install --no-interaction --prefer-dist --optimize-autoloader
# Install node modules
npm install --no-audit --legacy-peer-deps
# Run database migrations
sudo chown -R www-data:www-data .
#
php artisan migrate --force
# Clear caches
php artisan cache:clear

# Clear expired password reset tokens
php artisan auth:clear-resets

# Clear and cache config
php artisan config:clear
php artisan config:cache
#
npm run prod
#
sudo service nginx restart
#
sudo supervisorctl restart all
# Turn off maintenance mode
php artisan up
