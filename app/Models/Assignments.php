// app/Models/Assignment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

<?php 

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_name',
        'assignment_description',
        'assignment_due_date',
        'student_id',
        'admin_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
?>