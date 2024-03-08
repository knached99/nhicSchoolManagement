<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Assignments; 

class AssignmentsController extends Controller
{
    public function myAssignments(){
        
        $assignments = Assignments::where('faculty_id', Auth::guard('faculty')->id())->get();

        return Inertia::render('Faculty/Assignments',[
            'auth'=> Auth::guard('faculty')->user(),
            'assignments'=>$assignments
        ]);
    }
}
