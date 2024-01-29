<?php

namespace App\Http\Controllers\Faculty;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class FacultyDash extends Controller
{
  public function loadDashboard(){
    return Inertia::render('Faculty/Dash');
  }
 /**
  * Different Roles 
  * Teacher -> Has ability to manage students (adding students, grades, attendence, export student data)
  * Admin -> Has ability to see everything and manage users 
  */
}
