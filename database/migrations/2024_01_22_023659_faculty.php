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
            $table->uuid('faculty_id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->longText('password');
            $table->string('role');
            $table->string('room_number')->nullable();
            $table->string('profile_pic')->nullable();
            $table->string('wallpaper_pic')->nullable();
            $table->json('permissions')->nullable();
            $table->longText('client_ip')->nullable();
            $table->rememberToken();
            $table->timestamps();

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
