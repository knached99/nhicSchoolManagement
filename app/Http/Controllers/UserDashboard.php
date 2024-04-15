<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Students; 
use App\Models\Grades;
use App\Models\AssignmentStudents;
use App\Models\AssignmentAnswers;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class UserDashboard extends Controller
{
    public function studentWithHighestGradeAverage(){
        $students = Students::where('user_id', Auth::id())->get();
        $highestAverage = 0;
        $studentWithHighestAverage = null;
    
        foreach($students as $student){
            $assignmentStudentIDs = AssignmentStudents::where('student_id', $student->student_id)->pluck('assignment_student_id');
            $grades = Grades::whereIn('assignment_student_id', $assignmentStudentIDs)->pluck('grade');
    
            if($grades->count() > 0){
                $averageGrade = $grades->avg();
    
                if($averageGrade > $highestAverage){
                    $highestAverage = $averageGrade;
                    $studentWithHighestAverage = $student->first_name . ' '.$student->last_name;
                }
            }
        }

        return response()->json(['studentWithHighestAverage'=>$studentWithHighestAverage, 'highestAverage'=>$highestAverage]);
    }
    
    
    
    
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
                
                $assignmentStudentIDs = AssignmentStudents::where('student_id', $student_id)->pluck('assignment_student_id');

                $grades = Grades::whereIn('assignment_student_id', $assignmentStudentIDs)
                ->whereYear('created_at', now()->format('Y'))->get();

                $totalGrade = $grades->sum('grade');

                $gradesCount = $grades->count();
                $overallAverageGrade = $gradesCount > 0 ? $totalGrade / $gradesCount : 0;
                $overallAverageGrade = number_format($overallAverageGrade, 1);


            return Inertia::render('StudentDetails', ['auth' => Auth::user(), 'student' => $student, 'assignments'=>$assignments, 'overallAverageGrade'=>$overallAverageGrade]);
            
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

    public function studentAssignment($student_id, $assignment_id){
       try{
        $student = Students::where('student_id', $student_id)->first();
        $assignment = AssignmentStudents::with(['assignment'])->where('student_id', $student_id)->where('assignment_id', $assignment_id)->first();

        $answer = AssignmentAnswers::where('student_id', $student_id)->where('assignment_id', $assignment_id)->first();
        // Use assignment_id instead of assignment_student_id
        $grade = Grades::where('assignment_student_id', $assignment->assignment_student_id)->where('assignment_id', $assignment_id)->first();

        return Inertia::render('Student/StudentAssignment', [
            'student' => $student,
            'assignment' => $assignment, 
            'answer' => $answer ?? null,
            'grade' => $grade ?? null,
            
        ]);
    }
    catch(\Exception $e){
        return redirect('dashboard');
        \Log::info('Cannot find Model: '.$e->getMessage());
    }


    }

    public function submitAssignment(Request $request, $student_id, $assignment_id){
        $validate = Validator::make($request->only('assignment_answer'), [
            'assignment_answer' => 'required'
        ]);

        if($validate->fails()){
            return response()->json(['errors'=>$validate->errors()]);
        }
        $data = [
            'assignment_answer_id'=> Str::uuid(),
            'assignment_answer'=>$request->assignment_answer,
            'student_id'=>$student_id,
            'assignment_id'=>$assignment_id
        ];
        $assignmentDueDate = Carbon::parse($request->assignment_due_date);

        if (Carbon::now()->greaterThanOrEqualTo($assignmentDueDate)) {
            return response()->json(['errors' => 'You cannot submit this assignment as it is past due']);
        }
        

        AssignmentAnswers::create($data);
        return response()->json(['success' => 'You have successfully submitted your assignment']);
    }
    
}

?>