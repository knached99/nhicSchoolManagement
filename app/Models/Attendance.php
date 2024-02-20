<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// import models 
use App\Models\Student;
use App\Models\Faculty;

class Attendance extends Model
{
    use HasFactory;

    protected $table='attendance';

    protected $primaryKey='attendance_id';

    protected $fillable = [
        'student_id',
        'faculty_id',
        'is_present',
        'reason_for_absence'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
}
