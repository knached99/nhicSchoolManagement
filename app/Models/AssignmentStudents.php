<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentStudents extends Model
{
    use HasFactory;

    protected $table = 'assignment_student';
    protected $primaryKey = 'assignment_student_id';
    public $timestamps = true;

    protected $fillable = [
        'assignment_student_id',
        'assignment_id',
        'student_id',
    ];

    protected $casts = ['assignment_student_id'=>'string'];


    // Relationships 
    
    public function assignment()
    {
        return $this->belongsTo(Assignments::class, 'assignment_id', 'assignment_id');
    }

    public function student()
    {
        return $this->belongsTo(Students::class, 'student_id', 'student_id');
    }

}
