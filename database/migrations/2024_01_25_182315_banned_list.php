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
        Schema::create('banned_list', function(Blueprint $table){
            $table->id('banID');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
            $table->unsignedBigInteger('faculty_id')->nullable();
            $table->foreign('faculty_id')->references('faculty_id')->on('faculty')->onDelete('set null');
            $table->longText('client_ip')->nullable();
            $table->boolean('ban_status')->default(0)->nullable(); // 0 not banned, 1 banned 
            $table->datetime('banned_until')->nullable();
            $table->string('ban_reason')->nullable();
            $table->boolean('permanent_ban')->default(0)->nullable(); // 0 -> not banned forever, 1 -> banned forever
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banned_list');
    }
};
