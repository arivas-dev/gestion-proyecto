<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with(['user', 'tasks'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'data' => $projects,
        ], 200);
    }

    public function store(Request $request): JsonResponse
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

        $project->load(['user', 'tasks']);

        return response()->json([
            'data' => $project,
            'message' => 'Project created successfully',
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $project->load(['user', 'tasks.user']);

        return response()->json([
            'data' => $project,
        ], 200);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($validated);
        $project->load(['user', 'tasks']);

        return response()->json([
            'data' => $project,
            'message' => 'Project updated successfully',
        ], 200);
    }

    public function destroy(Project $project): JsonResponse
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully',
        ], 200);
    }
}
