<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    use HasFactory;

    protected $table='students';

    protected $fillable = [
        'first_name',
        'last_name',
        'parent_guardian_email',
        'date_of_birth',
        'address',
        'city',
        'state',
        'zip',
        'grade',
        'user_id',
    ];
    
    protected $dates = ['date_of_birth'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
