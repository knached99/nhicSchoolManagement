<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banned extends Model
{
    use HasFactory;

    protected $table = 'banned_list';

    protected $primaryKey='banID';

    protected $fillable = [
        'user_id',
        'faculty_id',
        'client_ip',
        'ban_status',
        'banned_until',
        'ban_reason',
        'permanent_ban'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function faculty(){
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
}
