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
        Schema::create('students', function(Blueprint $table){
            $table->id('student_id'); 
            $table->string('name');
            $table->string('parent_guardian_email')->nullable(); // Email of parent/guardian
            $table->date('date_of_birth')->nullable();
            $table->string('address')->nullable();
            $table->string('grade'); // What grade the student is in 
            $table->unsignedBigInteger('user_id')->nullable(); // New column for foreign key
            $table->timestamps();
            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            // Adjusted migration for students table

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
