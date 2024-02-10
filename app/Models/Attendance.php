<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table='attendance';

    protected $fillable = [
        'student_id',
        'attendance_date',
        'is_present'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
