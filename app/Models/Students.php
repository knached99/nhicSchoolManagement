<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Faculty;
use App\Models\Attendance;
use App\Models\Assignments;
use App\Models\Grades;
// Full Text Search using Scout
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;

class Students extends Model
{
    use HasFactory, Searchable;

    protected $table='students';
    protected $primaryKey = 'student_id';

      
    /**
 * Get the indexable data array for the model.
 *
 * @return array<string, mixed>
 */

 #[SearchUsingPrefix(['first_name', 'last_name', 'date_of_birth', 'address', 'street_address_2', 'city', 'state', 'zip', 'level', 'gender', 'allergies_or_special_needs', 'emergency_contact_person', 'emergency_contact_hospital'])]
#[SearchUsingFullText(['first_name', 'last_name', 'date_of_birth', 'address', 'street_address_2', 'city', 'state', 'zip', 'level', 'gender', 'allergies_or_special_needs', 'emergency_contact_person', 'emergency_contact_hospital'])]
public function toSearchableArray(): array
{
    return [
        'first_name' => $this->first_name,
        'last_name' => $this->last_name,
        'date_of_birth' => $this->date_of_birth,
        'address' => $this->address,
        'street_address_2' => $this->street_address_2,
        'city'=>$this->city, 
        'state' => $this->state,
        'zip' => $this->zip,
        'level'=>$this->level,
        'gender'=>$this->gender, 
        'allergies_or_special_needs'=>$this->allergies_or_special_needs,
        'emergency_contact_person'=>$this->emergency_contact_person, 
        'emergency_contact_hospital'=>$this->emergency_contact_hospital 
    ];
}


    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'address',
        'street_address_2',
        'city',
        'state',
        'zip',
        'level',
        'gender', 
        'allergies_or_special_needs',
        'emergency_contact_person',
        'emergency_contact_hospital',
        'user_id',
        'faculty_id'
    ];
    
    protected $dates = ['date_of_birth'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function faculty(){

        return $this->belongsTo(Faculty::class, 'faculty_id');
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
