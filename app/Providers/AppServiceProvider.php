<?php

namespace App\Providers;

use App\Mail\MailerooTransport;
use Carbon\CarbonImmutable;
use Illuminate\Mail\MailManager;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureMaileroo();

        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    }
    
    protected function configureMaileroo(): void
    {
        $this->app->resolving(MailManager::class, function (MailManager $manager) {
            $manager->extend('maileroo', function (array $config) {
                $apiKey = $config['api_key'] ?? env('MAILEROO_API_KEY');
                
                if (!$apiKey) {
                    throw new \InvalidArgumentException('Maileroo API key is required');
                }
                
                return new MailerooTransport($apiKey);
            });
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
