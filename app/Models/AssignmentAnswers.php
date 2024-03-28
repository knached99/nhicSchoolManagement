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
        'assignment_answer',
        'student_id'
    ];

    public function student(){
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function grade(){
        return $this->belongsTo(Grades::class, 'grade_id');
    }

}
