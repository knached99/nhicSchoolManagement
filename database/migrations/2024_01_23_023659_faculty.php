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
        Schema::create('faculty', function (Blueprint $table) {
            $table->id('faculty_id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->longText('password');
            $table->string('role');
            $table->boolean('status')->default(1);
            $table->unsignedBigInteger('teacher_student_id')->nullable();
            $table->timestamps();
                
            // Foreign key constraint
            $table->foreign('teacher_student_id')->references('student_id')->on('students')->onDelete('set null');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty');
    }
};
