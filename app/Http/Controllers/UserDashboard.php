<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Models\Students; 
use App\Models\AssignmentStudents;
use App\Models\AssignmentAnswers;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UserDashboard extends Controller
{
   
    public function getStudents()
    {
        try {
            $students = Students::with('faculty')->where('user_id', Auth::id())->orderBy('created_at', 'DESC')->get();
            return response()->json(['students' => $students]);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Cannot load information, something went wrong']);
            \Log::error($e->getMessage());
        }
    }

    public function viewStudentDetails($student_id) {
        try {
            if (auth()->check()) {
                $student = Students::with('faculty', 'user', 'assignments')->findOrFail($student_id);
                $assignments = AssignmentStudents::where('student_id', $student_id)->get();
                return Inertia::render('StudentDetails', ['auth' => Auth::user(), 'student' => $student, 'assignments'=>$assignments]);
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

    public function fetchStudentAssignments($student_id){
        try{
            $assignments = AssignmentStudents::where('student_id', $student_id)->with(['assignment'])->get();
            return response()->json(['assignments' => $assignments]);
        }

        catch(QueryException $e){
            return response()->json(['errors'=>'Unable to get assignments, something went wrong']);
            \Log::error(['Unable to fetch assignments: ', $e->getMessage()]);
        }
    }

    public function studentAssignment($student_id){
        $student = Students::where('student_id', $student_id)->first();
        $assignment = AssignmentStudents::with(['assignment'])->where('student_id', $student_id)->get();
        $answer = AssignmentAnswers::where('student_id', $student_id)->first();
        $assignmentID = AssignmentStudents::with(['assignment'])->where('student_id', $student_id)->pluck('assignment_id')->toArray();
        return Inertia::render('Student/StudentAssignment', [
            'auth'=> Auth::user(),
            'student'=>$student, 
            'assignments'=>$assignment, 
            'answer'=>$answer 
        ]);
    }

    public function submitAssignment(Request $request, $student_id){
        $validate = Validator::make($request->only('assignment_answer'), [
            'assignment_answer' => 'required'
        ]);

        if($validate->fails()){
            return response()->json(['errors'=>$validate->errors()]);
        }
        $data = [
            'assignment_answer'=>$request->assignment_answer,
            'student_id'=>$student_id 
        ];

        AssignmentAnswers::create($data);
        return response()->json(['success' => 'You have successfully submitted your assignment']);
    }
    
}

?>