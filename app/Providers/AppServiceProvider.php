<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            'App\Repositories\Groups\GroupsInterface',
            'App\Repositories\Eloquents\GroupsRepository'
        );
        $this->app->bind(
            'App\Repositories\Messages\MessagesInterface',
            'App\Repositories\Eloquents\MessagesRepository'
        );
        $this->app->bind(
            'App\Repositories\DavUser\DavUserInterface',
            'App\Repositories\Eloquents\DavUserRepository'
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
