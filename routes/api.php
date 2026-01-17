<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController as ApiProjectController;
use App\Http\Controllers\Api\TaskController as ApiTaskController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(\App\Http\Middleware\AuthenticateApiToken::class)->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::apiResource('projects', ApiProjectController::class);
    
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('tasks', ApiTaskController::class);
    });
});
