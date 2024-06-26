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
        Schema::create('assignment_answers', function(Blueprint $table){
            $table->uuid('assignment_answer_id')->primary();
            $table->text('assignment_answer');
            $table->uuid('student_id')->nullable();
            $table->uuid('grade_id')->nullable();
            $table->unsignedBigInteger('assignment_id');
            $table->foreign('assignment_id')->references('assignment_id')->on('assignments')->onDelete('cascade');
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('set null');
            $table->foreign('grade_id')->references('grade_id')->on('grades')->onDelete('set null'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_answers');
    }
};
