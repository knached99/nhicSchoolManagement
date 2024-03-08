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
        Schema::create('assignments', function (Blueprint $table) {
            $table->id('assignment_id');
            $table->string('assignment_name');
            $table->text('assignment_description');
             //may consider the following:
            $table->string('assignment_question')->nullable();
            $table->string('student_answer')->nullable();
            $table->string('assignment_video')->nullable();
            
            $table->float('assignment_grade');
            $table->datetime('assignment_due_date');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('faculty_id')->nullable();
                
            // Foreign key constraints with explicit data types
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('set null');
            $table->foreign('faculty_id')->references('faculty_id')->on('faculty')->onDelete('set null');
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};

?>