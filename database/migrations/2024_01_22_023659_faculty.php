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
            $table->string('room_number')->nullable();
            $table->string('profile_pic')->nullable();
            $table->json('permissions')->nullable();
            $table->boolean('status')->default(1);
            $table->rememberToken();
            $table->timestamps();
            // $table->index('name');
            // $table->index('email');
            // $table->index('phone');
            // $table->index('role');
            // $table->index('room_number');
    
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
