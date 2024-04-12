<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $primaryKey = 'form_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['form_id', 'faculty_id', 'name'];

    public function fields()
    {
        return $this->hasMany(Field::class, 'form_id', 'form_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id', 'faculty_id');
    }
}
