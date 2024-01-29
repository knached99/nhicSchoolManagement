<?php

namespace App\Http\Controllers\Faculty;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

use App\Models\Faculty;

class FacultyDash extends Controller
{
    public function loadDashboard()
    {
        return Inertia::render('Faculty/Dash', [
            'auth' => function () {
                return ['faculty' => auth('faculty')->user()];
            },
        ]);
    }

    public function loadProfile()
    {
        return Inertia::render('Faculty/Profile/FacultyEdit', [
            'auth' => function () {
                return ['faculty' => auth('faculty')->user()];
            },
        ]);
    }

    public function createFacultyRole(Request $request){
      $rules = [
        'name'=>'required',
        'email' => 'required|email',
        'phone_number'=>'required|regex:/^\d{3}-\d{3}-\d{4}$/'
      ];

      $messages = [
        'name.required'=>'Name is required',
        'email.required'=>'Email is required',
        'email.email'=>'That is not a valid email',
        'phone_number.required'=>'Phone Number is required',
        'phone_number.regex'=>'Phone number must be a valid US number'
      ];

      $this->validate();
      Faculty::create([
        'name'=>$request->name, 
        'email'=>$request->email,
        'phone_number'=>$request->phone_number
      ]);
    }

    /**
     * Different Roles 
     * Teacher -> Has ability to manage students (adding students, grades, attendance, export student data)
     * Admin -> Has ability to see everything and manage users 
     */
}

?>