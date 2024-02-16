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

    public function updateStudentInformation(Request $request, $student_id) {
        try{
        $data = $request->only([
            'address',
            'street_address_2',
            'city',
            'state',
            'zip',
            'gender',
            'date_of_birth',
            'allergies_or_special_needs',
            'emergency_contact_person',
            'emergency_contact_hospital'
        ]);
    
        $sql = Students::where('student_id', $student_id)->update($data);
        
        return response()->json(['success'=>'Your changes have been saved']);
    }
    catch(QueryException $e){
        \Log::error('Query Exception: '.$e->getMessage());
        return response()->json(['errors'=>'Something went wrong updating your student\'s information']);
    }
    }
    
}

?>