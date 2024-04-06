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
        Schema::create('failed_login_attempts', function(Blueprint $table){
            $table->id('loginID');
            $table->text('email_used');
            $table->longText('client_ip')->nullable();
            $table->text('user_agent')->nullable();
            $table->text('location_information')->nullable();
            $table->boolean('is_blocked')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('failed_login_attempts');
    }
};
