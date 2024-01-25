<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'teacher_student_id',
    ];

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'faculty_id');
    }

    public function teacherStudent()
    {
        return $this->belongsTo(Student::class, 'teacher_student_id');
    }
}

?>