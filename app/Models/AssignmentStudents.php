<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentStudents extends Model
{
    use HasFactory;

    protected $table = 'assignment_student';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'assignment_id',
        'student_id',
    ];


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
