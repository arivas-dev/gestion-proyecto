<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\EnsureUserIsActive::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) {
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                ], $e->getStatusCode());
            }
            
            if ($e->getStatusCode() === 403) {
                $redirectUrl = url()->previous() !== url()->current() 
                    ? url()->previous() 
                    : (auth()->check() ? '/projects' : '/login');
                
                return redirect($redirectUrl)->with('error', $e->getMessage() ?: __('common.this_action_unauthorized'));
            }
        });
    })->create();
