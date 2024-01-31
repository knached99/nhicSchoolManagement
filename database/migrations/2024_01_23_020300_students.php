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
        $table->string('first_name')->nullable();;
        $table->string('last_name')->nullable();;
        $table->string('parent_guardian_email')->nullable();
        $table->date('date_of_birth')->nullable(); // Change the type to date
        $table->string('address')->nullable();
        $table->string('city')->nullable();
        $table->string('state')->nullable();
        $table->string('zip')->nullable();
        $table->integer('grade')->nullable();
        $table->unsignedBigInteger('user_id')->nullable();
        $table->timestamps();

        // Foreign key constraint
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
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
