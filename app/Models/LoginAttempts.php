<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginAttempts extends Model
{
    use HasFactory;

    protected $primaryKey = 'loginID';

    protected $table = 'failed_login_attempts';


    protected $fillable = [
        'email_used',
        'client_ip',
        'user_agent',
        'location_information',
        'google_maps_link',
        'google_earth_link',
        'created_at'
    ];

}
