<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Faculty;
use App\Models\Attendance;
use App\Models\Assignments;
use App\Models\Grades;


class Students extends Model
{
    use HasFactory;

    protected $table='students';
    protected $primaryKey = 'student_id';

    protected $fillable = [
        'first_name',
        'last_name',
        'parent_guardian_email',
        'date_of_birth',
        'address',
        'street_address_2',
        'city',
        'state',
        'zip',
        'grade',
        'user_id',
        'faculty_id'
    ];
    
    protected $dates = ['date_of_birth'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function faculty(){
        return $this->belongsTo(Faculty::class);
    }
  
    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'student_id', 'student_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignments::class, 'student_id', 'student_id');
    }

    public function grades()
    {
        return $this->hasMany(Grades::class, 'student_id', 'student_id');
    }
}
