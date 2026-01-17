<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Project $project): Response
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()->with(['user', 'assignedUser', 'completedByUser'])->latest()->get();

        return Inertia::render('Tasks/Index', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    public function create(Project $project): Response
    {
        $this->authorize('view', $project);
        
        $users = $project->users()->get();
        if (auth()->user()->isAdmin()) {
            $allUsers = \App\Models\User::where('id', '!=', auth()->id())->get();
            $users = $users->merge($allUsers)->unique('id');
        }

        return Inertia::render('Tasks/Create', [
            'project' => $project,
            'users' => $users,
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);
        
        $user = auth()->user();
        $policy = new \App\Policies\TaskPolicy();
        if (!$policy->create($user, $project)) {
            abort(403, __('common.this_action_unauthorized'));
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $taskData = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'due_date' => $validated['due_date'] ?? null,
        ];

        if ($user->isAdmin() && isset($validated['assigned_to'])) {
            $taskData['assigned_to'] = $validated['assigned_to'];
        }

        $task = Task::create($taskData);

        return redirect()->route('projects.tasks.show', [$project, $task])->with('success', __('common.task_created'));
    }

    public function show(Project $project, Task $task): Response
    {
        $this->authorize('view', $project);
        $this->authorize('view', $task);

        $task->load(['user', 'project', 'assignedUser', 'completedByUser']);
        
        $users = $project->users()->get();
        if (auth()->user()->isAdmin()) {
            $allUsers = \App\Models\User::where('id', '!=', auth()->id())->get();
            $users = $users->merge($allUsers)->unique('id');
        }

        return Inertia::render('Tasks/Show', [
            'project' => $project,
            'task' => $task,
            'users' => $users,
        ]);
    }

    public function edit(Project $project, Task $task): Response
    {
        $this->authorize('view', $project);
        $this->authorize('update', $task);
        
        $users = $project->users()->get();
        if (auth()->user()->isAdmin()) {
            $allUsers = \App\Models\User::where('id', '!=', auth()->id())->get();
            $users = $users->merge($allUsers)->unique('id');
        }

        return Inertia::render('Tasks/Edit', [
            'project' => $project,
            'task' => $task,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Project $project, Task $task): RedirectResponse
    {
        $this->authorize('view', $project);
        $this->authorize('update', $task);

        $user = auth()->user();
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'due_date' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'completion_comment' => ['nullable', 'string', 'required_if:status,completed'],
        ]);

        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'due_date' => $validated['due_date'] ?? null,
        ];

        if ($user->isAdmin() && isset($validated['assigned_to'])) {
            $updateData['assigned_to'] = $validated['assigned_to'];
        }

        if ($validated['status'] === 'completed' && $task->status !== 'completed') {
            $updateData['completed_at'] = now();
            $updateData['completed_by'] = $user->id;
            $updateData['completion_comment'] = $validated['completion_comment'] ?? null;
        } elseif ($validated['status'] !== 'completed' && $task->status === 'completed') {
            $updateData['completed_at'] = null;
            $updateData['completed_by'] = null;
            $updateData['completion_comment'] = null;
        } elseif ($validated['status'] === 'completed' && isset($validated['completion_comment'])) {
            $updateData['completion_comment'] = $validated['completion_comment'];
        }

        $task->update($updateData);

        return redirect()->route('projects.tasks.show', [$project, $task])->with('success', __('common.task_updated'));
    }

    public function destroy(Project $project, Task $task): RedirectResponse
    {
        $this->authorize('view', $project);
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('projects.show', $project)->with('success', __('common.task_deleted'));
    }
}
