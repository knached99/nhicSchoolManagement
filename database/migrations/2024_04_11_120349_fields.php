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
        Schema::create('fields', function (Blueprint $table) {
            $table->uuid('field_id')->primary();
            $table->uuid('form_id');
            $table->string('name');
            $table->string('type');
            $table->json('options')->nullable();
            $table->timestamps();
    
            $table->foreign('form_id')->references('form_id')->on('forms')->onDelete('cascade');
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};
