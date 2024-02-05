<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('enum', function ($attribute, $value, $parameters, $validator) {
            $allowed = ['Customer', 'Admin'];
            return in_array($value, $allowed);

            // Aquí debes implementar la lógica para validar el campo 'enum'
            // $value es el valor del campo que estás validando
            // Puedes compararlo con los valores permitidos en tu enum
            // Si el valor es válido, devuelve true; de lo contrario, devuelve false.
        });
    }
}
