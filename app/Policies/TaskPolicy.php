<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Task $task): bool
    {
        $task->loadMissing('project');
        
        if ($user->isAdmin()) {
            return true;
        }
        
        $project = $task->project;
        return $user->id === $project->user_id 
            || $project->users()->where('user_id', $user->id)->exists()
            || $task->assigned_to === $user->id;
    }

    public function create(User $user, ?Project $project = null): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        
        if ($project) {
            return $user->id === $project->user_id 
                || $project->users()->where('user_id', $user->id)->exists();
        }
        
        return true;
    }

    public function update(User $user, Task $task): bool
    {
        $task->loadMissing('project');
        
        if ($user->isAdmin()) {
            return true;
        }
        
        $project = $task->project;
        return $user->id === $project->user_id 
            || $project->users()->where('user_id', $user->id)->exists()
            || $task->assigned_to === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return false;
    }
}
