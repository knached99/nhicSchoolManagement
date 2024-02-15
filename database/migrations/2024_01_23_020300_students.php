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
        $table->string('first_name')->nullable();
        $table->string('last_name')->nullable();
        $table->date('date_of_birth')->nullable(); // Change the type to date
        $table->string('address')->nullable();
        $table->string('street_address_2')->nullable();
        $table->string('city')->nullable();
        $table->string('state')->nullable();
        $table->string('zip')->nullable();
        $table->string('level')->nullable();
        $table->string('gender')->nullable();
        $table->longText('allergies_or_special_needs')->nullable(); 
        $table->string('emergency_contact_person')->nullable();
        $table->string('emergency_contact_hospital')->nullable();
        $table->unsignedBigInteger('user_id')->nullable();
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
        $table->unsignedBigInteger('faculty_id')->nullable();
        $table->foreign('faculty_id')->references('faculty_id')->on('faculty')->onDelete('set null');
        $table->timestamps();
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
