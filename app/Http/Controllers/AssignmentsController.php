<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Assignments; 
use App\Models\AssignmentAnswers;
use App\Models\AssignmentStudents;
use App\Models\Students; 
use App\Models\Grades;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\InsufficientStudentsException; 
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

class AssignmentsController extends Controller
{
    public function myAssignments(){
        return Inertia::render('Faculty/Assignments',[
            'auth'=> Auth::guard('faculty')->user(),
        ]);
    }

    public function getAssignments()
    {
        try {
            $assignments = Assignments::with(['students'])->where('faculty_id', Auth::guard('faculty')->id())->get();
            return response()->json(['assignments' => $assignments]);
        } catch (QueryException $e) {
            \Log::error(['Query Exception: ', $e->getmessage()]);
            return response()->json(['errors' => 'Something went wrong']);
        }
    }
    public function assignmentDetails($assignment_id){
        try {
            $assignment = Assignments::with(['students'])->findOrFail($assignment_id);
            return Inertia::render('Faculty/AssignmentDetails', [
                'auth' => Auth::guard('faculty')->user(),
                'assignment' => $assignment
            ]);
        } catch (ModelNotFoundException $error) {
            \Log::error(['Model Exception Thrown: ', $error->getMessage()]);
            return redirect()->back()->withErrors(['errors' => 'Unable to get assignment details']);
        }
    }

    public function studentAssignment($student_id){
        $student = Students::where('student_id', $student_id)->first();

        $assignment = AssignmentStudents::with(['assignment'])->where('student_id', $student_id)->get();

        $answer = AssignmentAnswers::with(['grade'])->where('student_id', $student_id)->first();

        $grade = Grades::where('assignment_student_id', $student_id)->where('assignment_id', $assignment[0]->assignment_id)->first();

        return Inertia::render('Faculty/StudentAssignment', [
            'auth' => Auth::guard('faculty')->user(),
            'student'=>$student,
            'assignments' => $assignment, 
            'answer' => $answer ?? null,
            'grade' => $grade ?? null,
        ]);
    }
    
    

    public function uploadAssignment(Request $request)
    {
        try {
               
            $facultyId = Auth::guard('faculty')->id();
            $students = Students::where('faculty_id', $facultyId)->pluck('student_id')->toArray();

            $validate = Validator::make($request->only([
                'assignment_name',
                'assignment_due_date',
                'assignment_description'
            ]), [
                'assignment_name' => 'required',
                'assignment_due_date' => 'required|date',
                'assignment_description' => 'required'
            ]);
    
            if ($validate->fails()) {
                return response()->json(['errors' => $validate->errors()], 419);
            }
 
               if(empty($students)){
                   throw new InsufficientStudentsException();
               }
    
            $assignment = Assignments::create([
                'assignment_name' => $request->assignment_name,
                'assignment_due_date' => $request->assignment_due_date,
                'assignment_description' => $request->assignment_description,
                'faculty_id' => $facultyId,
            ]);
            
                // Assign to all students 
                $assignment->students()->attach($students); 
         
    
            return response()->json(['success' => 'Assignment uploaded successfully']);
        } catch (ValidationException $e) {
            \Log::error(['Validation Exception: ', $e->getMessage()]);
            return response()->json(['errors' => $e->getMessage()]);
        } 

        catch(InsufficientStudentsException $e){
            return response()->json(['errors'=>$e->getMessage()]);

        }
        
        catch (QueryException $e) {
            \Log::error(['Query Exception: ', $e->getMessage()]);
            return response()->json(['errors' => 'Unable to create assignment, something went wrong']);
        }
    }

    public function editAssignmentDetails(Request $request, $assignment_id){
        try{
            $data = $request->only([
                'assignment_name',
                'assignment_description',
                'assignment_due_date'
            ]);

            $assignment = Assignments::findOrFail($assignment_id);
            if(!$assignment){
                return response()->json(['errors' => 'Assignment not found'], 404);
            }

            $assignment->update($data);
            return response()->json(['success' => 'Assignment details updated successfully']);

        }

        catch(QueryException $error){
            \Log::error(['Query Exception: ', $error->getMessage()]);
            return response()->json(['errors'=>'Unable to update assignment details, something went wrong']);
        }
    }

    public function deleteAssignment($assignment_id)
    {
        try {
            $assignment = Assignments::findOrFail($assignment_id);
    
            // (remove associations)
            $assignment->students()->detach();
            $assignment->delete();
    
            return response()->json(['success' => 'Assignment with ID: ' . $assignment_id . ' was successfully deleted']);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e->getMessage()]);
        }
    }

    // Grading 

    public function submitGrade(Request $request, $assignment_student_id, $assignment_id){

         try{
        $validate = Validator::make($request->only([
            'grade',
            'feedback',
        ]), [
            'grade'=>'required|integer|min:0|max:100',
            'feedback'=>'nullable'
        ]);

        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 419);
        }

        $data = [
            'assignment_student_id' => $assignment_student_id,
            'assignment_id'=>$assignment_id, 
            'grade'=>$request->grade, 
            'feedback'=>$request->feedback ?? null 
        ];

        Grades::create($data);
        return response()->json(['success' => 'This assignment has successfully been graded']);
    }
    catch(QueryException $e){
        \Log::error('Grade Query Exception: '.$e->getMessage());
        return response()->json(['errors' => 'Something went wrong while grading this assignment']);
    }
    }
    
    
}
