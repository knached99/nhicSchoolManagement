<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Faculty extends Authenticatable
{
    use HasFactory, Notifiable;
    
    protected $table = "faculty";
    protected $primaryKey = "faculty_id";

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'profile_pic',
        'permissions',
        'status',
        'teacher_student_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
        'permissions' => 'json'
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