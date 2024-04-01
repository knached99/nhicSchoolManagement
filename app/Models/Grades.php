<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grades extends Model
{
    use HasFactory;

    protected $primaryKey = 'grade_id';

    protected $fillable = [
        'grade_id',
        'assignment_id',
        'assignment_student_id',
        'student_id',
        'grade',
        'feedback'
    ];

    protected $casts = ['grade_id'=>'string'];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}

?>