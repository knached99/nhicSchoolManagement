<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Students; 
use App\Models\Grades;

class AssignmentAnswers extends Model
{
    use HasFactory;

    protected $table = 'assignment_answers';

    protected $primaryKey = 'assignment_answer_id';

    protected $fillable = [
        'assignment_answer_id',
        'assignment_answer',
        'student_id',
        'assignment_id',
        'grade_id'
    ];

    protected $casts = ['assignment_answer_id'=>'string', 'assignment_id'=>'string', 'student_id'=>'string', 'grade_id'=>'string'];


    public function student(){
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function grade(){
        return $this->belongsTo(Grades::class, 'assignment_student_id');
    }

}
