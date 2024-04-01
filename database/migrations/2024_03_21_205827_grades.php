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
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('grade_id')->primary();
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('assignment_student_id'); // Use the same name as in the referenced table
            //$table->unsignedBigInteger('student_id');
            $table->integer('grade');
            $table->text('feedback')->nullable();
           
            $table->timestamps();
            // Foreign key constraints
            $table->foreign('assignment_student_id')->references('assignment_student_id')->on('assignment_student')->onDelete('cascade');
            
            $table->foreign('assignment_id')->references('assignment_id')->on('assignments')->onDelete('cascade');
           // $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
        });
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');

    }
};
