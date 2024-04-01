<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssignmentStudentTable extends Migration
{
    public function up()
    {
        Schema::create('assignment_student', function (Blueprint $table) {
            $table->uuid('assignment_student_id')->primary();
            $table->uuid('assignment_id');
            $table->uuid('student_id');
            $table->timestamps();
    
            // Correct foreign key references
            $table->foreign('assignment_id')->references('assignment_id')->on('assignments')->onDelete('cascade');
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('assignment_student');
    }
}
?>