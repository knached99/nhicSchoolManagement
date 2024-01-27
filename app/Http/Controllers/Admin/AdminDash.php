<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminDash extends Controller
{
  public function loadDashboard(){
    return Inertia::render('admin/dash');
  }
 /**
  * Different Roles 
  * Teacher -> Has ability to manage students (adding students, grades, attendence, export student data)
  * Admin -> Has ability to see everything and manage users 
  */
}
