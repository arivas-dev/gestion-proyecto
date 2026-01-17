<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->header('X-API-TOKEN');

        if (!$token) {
            return response()->json([
                'message' => 'Unauthenticated. Token required.',
            ], 401);
        }

        $user = \App\Models\User::where('api_token', hash('sha256', $token))->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid token.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Account is deactivated.',
            ], 403);
        }

        Auth::login($user);

        return $next($request);
    }
}
