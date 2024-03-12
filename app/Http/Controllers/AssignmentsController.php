<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Assignments; 
use App\Models\Students; 

use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
    

    public function uploadAssignment(Request $request)
    {
        try {
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
    
            $facultyId = Auth::guard('faculty')->id();
    
            $assignment = Assignments::create([
                'assignment_name' => $request->assignment_name,
                'assignment_due_date' => $request->assignment_due_date,
                'assignment_description' => $request->assignment_description,
                'faculty_id' => $facultyId,
            ]);
    
            if ($request->student_id == 'none') {
                $assignment->students()->detach(); // Remove all students
            } elseif ($request->student_id == 'all_students') {
                $students = Students::where('faculty_id', $facultyId)->pluck('student_id')->toArray();
                $assignment->students()->attach($students); // Attach all students
            } else {
                $assignment->students()->attach($request->student_id); // Attach the selected student
            }
    
            return response()->json(['success' => 'Assignment uploaded successfully']);
        } catch (ValidationException $e) {
            \Log::error(['Validation Exception: ', $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()]);
        } catch (QueryException $e) {
            \Log::error(['Query Exception: ', $e->getMessage()]);
            return response()->json(['error' => 'Unable to create assignment, something went wrong']);
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
    
}
