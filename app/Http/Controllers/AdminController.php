<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $totalProjects = Project::count();
        $totalCollaborators = User::count();
        $pendingTasks = Task::whereIn('status', ['pending', 'in_progress'])->count();
        $completedTasks = Task::where('status', 'completed')->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProjects' => $totalProjects,
                'totalCollaborators' => $totalCollaborators,
                'pendingTasks' => $pendingTasks,
                'completedTasks' => $completedTasks,
            ],
        ]);
    }
}
