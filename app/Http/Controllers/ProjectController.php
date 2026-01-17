<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $projects = Project::with(['user', 'tasks', 'users'])
                ->latest()
                ->get();
        } else {
            $projects = Project::with(['user', 'tasks', 'users'])
                ->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhereHas('users', function ($q) use ($user) {
                            $q->where('user_id', $user->id);
                        });
                })
                ->latest()
                ->get();
        }

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'user_id' => auth()->id(),
        ]);

        $project->users()->attach(auth()->id());

        return redirect()->route('projects.show', $project)->with('success', __('common.project_created'));
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load(['tasks.user', 'tasks.assignedUser', 'tasks.completedByUser', 'user', 'users']);
        
        $users = [];
        if (auth()->user()->isAdmin()) {
            $users = \App\Models\User::where('id', '!=', auth()->id())->get();
        }

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'users' => $users,
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($validated);

        // Force explicit redirect to avoid any intended() redirects
        return redirect()->to("/projects/{$project->id}")->with('success', 'Project updated successfully');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')->with('success', __('common.project_deleted'));
    }

    public function assignUsers(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        $userIds = isset($validated['user_ids']) ? array_map('intval', $validated['user_ids']) : [];
        $project->users()->sync($userIds);

        return redirect()->back()->with('success', __('common.users_assigned'));
    }
}
