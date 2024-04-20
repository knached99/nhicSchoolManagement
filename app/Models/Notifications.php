<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Faculty;

class Notifications extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'type',
        'notifiable',
        'data',
        'read_at'
    ];

    // protected $casts = [
    //     // 'id' => 'uuid',
    //     'notifiable_id' => 'string',
    //     'read_at' => 'datetime',
    // ];


    public function notifiable(){
        return $this->morphTo();
    }
}

?>
