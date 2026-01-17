<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->date('due_date')->nullable()->after('status');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null')->after('user_id');
            $table->timestamp('completed_at')->nullable()->after('due_date');
            $table->foreignId('completed_by')->nullable()->constrained('users')->onDelete('set null')->after('completed_at');
            $table->text('completion_comment')->nullable()->after('completed_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropForeign(['completed_by']);
            $table->dropColumn(['due_date', 'assigned_to', 'completed_at', 'completed_by', 'completion_comment']);
        });
    }
};
