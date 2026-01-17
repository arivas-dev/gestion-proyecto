<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController as ApiProjectController;
use App\Http\Controllers\Api\TaskController as ApiTaskController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(\App\Http\Middleware\AuthenticateApiToken::class)->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::apiResource('projects', ApiProjectController::class)->names([
        'index' => 'api.projects.index',
        'store' => 'api.projects.store',
        'show' => 'api.projects.show',
        'update' => 'api.projects.update',
        'destroy' => 'api.projects.destroy',
    ]);
    
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('tasks', ApiTaskController::class)->names([
            'index' => 'api.projects.tasks.index',
            'store' => 'api.projects.tasks.store',
            'show' => 'api.projects.tasks.show',
            'update' => 'api.projects.tasks.update',
            'destroy' => 'api.projects.tasks.destroy',
        ]);
    });
});
