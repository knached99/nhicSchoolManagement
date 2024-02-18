<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// Full Text Search using Scout
// use Laravel\Scout\Attributes\SearchUsingFullText;
// use Laravel\Scout\Attributes\SearchUsingPrefix;
// use Laravel\Scout\Searchable;

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
        'room_number',
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

    
    /**
 * Get the indexable data array for the model.
 *
 * @return array<string, mixed>
 */
// #[SearchUsingPrefix(['name', 'email', 'phone', 'role', 'room_number'])]
// #[SearchUsingFullText(['name', 'email', 'phone', 'role', 'room_number'])]
// public function toSearchableArray(): array
// {
//     return [
//         'name' => $this->name,
//         'email' => $this->email,
//         'phone' => $this->phone,
//         'role' => $this->role,
//         'room_number' => $this->room_number
//     ];
// }
}
?>