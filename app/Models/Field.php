<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory;

    protected $primaryKey = 'field_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['field_id', 'form_id', 'name', 'type', 'options'];

    public function form()
    {
        return $this->belongsTo(Form::class, 'form_id', 'form_id');
    }

    
}
