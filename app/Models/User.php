<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
// Full Text Search using Scout
// use Laravel\Scout\Attributes\SearchUsingFullText;
// use Laravel\Scout\Attributes\SearchUsingPrefix;
// use Laravel\Scout\Searchable; 

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $primaryKey= 'user_id';
    
          
//     /**
//  * Get the indexable data array for the model.
//  *
//  * @return array<string, mixed>
//  */


//  #[SearchUsingPrefix(['name', 'email', 'phone', 'address', 'address_2', 'city', 'state', 'zip'])]
//  #[SearchUsingFullText(['name', 'email', 'address', 'address_2', 'city', 'state', 'zip'])]
//  public function toSearchableArray(): array
// {
//     return [
//         'name' => $this->name,
//         'email' => $this->email,
//         'phone' => $this->phone,
//         'address' => $this->address,
//         'address_2' => $this->address_2,
//         'city'=>$this->city, 
//         'state' => $this->state,
//         'zip' => $this->zip,
//     ];
// }


    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'address_2',
        'city',
        'state',
        'zip',
        'password',
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

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function students()
{
    return $this->hasMany(Student::class, 'user_id');
}

}
