<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $tasks = $project->tasks()->with('user')->latest()->get();

        return response()->json([
            'data' => $tasks,
        ], 200);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'project_id' => $project->id,
            'user_id' => auth()->id(),
        ]);

        $task->load(['user', 'project']);

        return response()->json([
            'data' => $task,
            'message' => 'Task created successfully',
        ], 201);
    }

    public function show(Project $project, Task $task): JsonResponse
    {
        if ($project->user_id !== auth()->id() || $task->project_id !== $project->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $task->load(['user', 'project']);

        return response()->json([
            'data' => $task,
        ], 200);
    }

    public function update(Request $request, Project $project, Task $task): JsonResponse
    {
        if ($project->user_id !== auth()->id() || $task->project_id !== $project->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ]);

        $task->update($validated);
        $task->load(['user', 'project']);

        return response()->json([
            'data' => $task,
            'message' => 'Task updated successfully',
        ], 200);
    }

    public function destroy(Project $project, Task $task): JsonResponse
    {
        if ($project->user_id !== auth()->id() || $task->project_id !== $project->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ], 200);
    }
}
