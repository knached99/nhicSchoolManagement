<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Students; 

class Assignments extends Model
{
    use HasFactory;

    protected $table = 'assignments';
    
    protected $primaryKey = 'assignment_id';

    protected $fillable = [
        'assignment_id',
        'assignment_name',
        'assignment_description',
        'assignment_due_date',
        'faculty_id', 
    ];

    protected $casts = ['assignment_id'=>'string', 'faculty_id'=>'string'];


    public function students()
    {
        return $this->belongsToMany(Students::class, 'assignment_student', 'assignment_id', 'student_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'faculty_id');
    }
}

?>