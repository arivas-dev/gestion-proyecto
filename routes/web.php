<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return redirect('/admin');
        }
        return redirect('/projects');
    }
    return redirect('/login');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
    
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    
    Route::get('/forgot-password', [PasswordResetController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');
});

Route::get('/locale/{locale}', [\App\Http\Controllers\LocaleController::class, 'setLocale'])->name('locale.set');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    
    Route::resource('projects', ProjectController::class);
    Route::post('/projects/{project}/assign-users', [ProjectController::class, 'assignUsers'])->name('projects.assign-users');
    
    Route::prefix('projects/{project}')->group(function () {
        Route::resource('tasks', TaskController::class)->names([
            'index' => 'projects.tasks.index',
            'create' => 'projects.tasks.create',
            'store' => 'projects.tasks.store',
            'show' => 'projects.tasks.show',
            'edit' => 'projects.tasks.edit',
            'update' => 'projects.tasks.update',
            'destroy' => 'projects.tasks.destroy',
        ]);
    });
    
    Route::middleware(EnsureUserIsAdmin::class)->group(function () {
        Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
        
        // Rutas de administración de usuarios
        Route::prefix('admin/users')->name('admin.users.')->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->name('index');
            Route::patch('/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('toggle-status');
            Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy');
        });
    });
});
