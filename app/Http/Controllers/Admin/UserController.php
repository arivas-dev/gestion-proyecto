<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'is_admin' => $user->isAdmin(),
                    'created_at' => $user->created_at->format('d/m/Y'),
                    'projects_count' => $user->projects()->count(),
                    'tasks_count' => $user->tasks()->count(),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        // Prevenir que el admin se desactive a sí mismo
        if ($user->id === auth()->id()) {
            return back()->with('error', __('common.cannot_deactivate_yourself'));
        }

        // Determinar el nuevo estado
        $newStatus = !$user->is_active;
        
        // Actualizar usando Query Builder con casting explícito para PostgreSQL
        \DB::table('users')
            ->where('id', $user->id)
            ->update([
                'is_active' => \DB::raw($newStatus ? 'true' : 'false'),
                'updated_at' => now(),
            ]);

        $message = $newStatus 
            ? __('common.user_activated') 
            : __('common.user_deactivated');

        return back()->with('success', $message);
    }

    public function destroy(User $user): RedirectResponse
    {
        // Prevenir que el admin se elimine a sí mismo
        if ($user->id === auth()->id()) {
            return back()->with('error', __('common.cannot_delete_yourself'));
        }

        // Prevenir eliminar el último admin
        if ($user->isAdmin() && User::whereHas('roles', function ($query) {
            $query->where('slug', 'admin');
        })->count() <= 1) {
            return back()->with('error', __('common.cannot_delete_last_admin'));
        }

        // Prevenir eliminar usuarios con tareas asignadas
        if ($user->tasks()->count() > 0) {
            return back()->with('error', __('common.cannot_delete_user_with_tasks'));
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', __('common.user_deleted'));
    }
}
