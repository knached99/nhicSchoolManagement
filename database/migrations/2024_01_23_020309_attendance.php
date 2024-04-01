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
        Schema::create('attendance', function (Blueprint $table) {
            $table->uuid('attendance_id')->primary();
            $table->uuid('student_id'); // Foreign key to link to students table
            $table->uuid('faculty_id');
            $table->boolean('is_present')->nullable(); // 0 -> not present 1 -> present
            $table->string('reason_for_abscence')->nullable(); 
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->foreign('faculty_id')->references('faculty_id')->on('faculty')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance');
    }
};

?>