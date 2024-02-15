<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Models\Students; 
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class UserDashboard extends Controller
{
   
    public function getStudents()
    {
        try {
            $students = Students::with('faculty')->where('user_id', Auth::id())->get();
            return response()->json(['students' => $students]);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Cannot load information, something went wrong']);
            \Log::error($e->getMessage());
        }
    }

    public function viewStudentDetails($student_id) {
        try {
            if (auth()->check()) {
                \Log::info(auth()->user());
                $student = Students::with('faculty', 'user')->findOrFail($student_id);
                return Inertia::render('StudentDetails', ['auth' => Auth::user(), 'student' => $student]);
            } else {
                // Handle unauthenticated user
                return redirect('login');
            }
        } catch (ModelNotFoundException $e) {
            return redirect('dashboard');
        }
    }
    
}

?>