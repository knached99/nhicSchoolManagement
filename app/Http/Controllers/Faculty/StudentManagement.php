<?php

namespace App\Http\Controllers\Faculty;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;

use App\Notifications\AccountCreated;
use App\Notifications\StudentAssigned;
use App\Notifications\NotifyUserOfStudentAssigned;
use App\Models\Faculty;
use App\Models\Students;
use App\Models\User;
use App\Models\Banned;
use App\Models\Grades;
use App\Models\LoginAttempts;
use App\Models\Attendance;
use App\Models\AssignmentStudents;
use App\Models\AssignmentAnswers; 

use Carbon\Carbon;

use Illuminate\Notifications\NotificationException; 
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Imports\StudentsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use Laravel\Scout\Searchable;


class StudentManagement extends Controller
{
    
    // Upload multiple students from an Excel spreadsheet
    public function studentBatchImport(Request $request)
    {
        try {
            $validator = Validator::make($request->only('file'), [
                'file' => 'required|mimes:xls,xlsx',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()]);
            }
    
            $file = $request->file('file');
            Excel::import(new StudentsImport, $file);
    
            return response()->json(['success' => 'Students successfully imported into the system']);
        } catch (\Exception $e) {
            \Log::error('Batch Import Error: '. $e->getMessage());
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    // Manually add a student 

public function addStudent(Request $request){
    try{
        $role = Auth::guard('faculty')->user()->role;
        $permissions = collect(Auth::guard('faculty')->user()->permissions);

        $validator = Validator::make($request->only([
            'first_name',
            'last_name',
            'date_of_birth',
            'address',
            'street_address_2',
            'city',
            'state',
            'zip',
            'level',
            'gender',
            'allergies_or_special_needs',
            'emergency_contact_person',
            'emergency_contact_hospital',
        ]), [
            'first_name' => 'required',
            'last_name' => 'required',
            'date_of_birth' => 'required|date_format:Y-m-d',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'zip' => 'required',
            'level' => 'required',
            'gender'=>'required'
        ]);
        
        if($validator->fails()){
            return response()->json(['error'=>$validator->errors()], 419);
        }

        $data = [
            'student_id'=>Str::uuid(),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'parent_guardian_email' => $request->parent_guardian_email,
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'street_address_2'=>$request->street_address_2,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'level' => $request->level,
            'gender'=>$request->gender,
            'allergies_or_special_needs'=>$request->allergies_or_special_needs,
            'emergency_contact_person'=>$request->emergency_contact_person,
            'emergency_contact_hospital'=>$request->emergency_contact_hospital,
            'user_id'=>$request->user_id,
            'faculty_id'=>$request->faculty_id
        ];
        
        // If the user has the role of Teacher
        // if ($role === 'Teacher') {
        //     $data['faculty_id'] = Auth::guard('faculty')->id();
        // }

        if(isset($data['user_id'])){
            $user = User::findOrFail($data['user_id']);
        Notification::route('mail', $user->email)->notify(new NotifyUserOfStudentAssigned(null, $data['first_name'], $data['last_name'], $user->name));
        }

        if(isset($data['faculty_id'])){
            $teacher = Faculty::findOrFail($data['faculty_id']);
            Notification::route('mail', $teacher->email)->notify(new StudentAssigned(null, $data['first_name'], $data['last_name'], $teacher->name));

        }
        
        Students::create($data);
        
        return response()->json(['success'=>$request->first_name. ' '.$request->last_name. ' was added to the system']);
    }
    
    catch(ValidationException $e){
        return response()->json(['error'=>$e->getMessage()]);
    }

    catch(ModelNotFoundException $e){
        return response()->json(['error'=>$e->getMessage()]);
    }
    catch(\Exception $e){
        return response()->json(['error'=>$e->getMessage()]);
    }
}

public function editStudentInformation(Request $request, $student_id){
    try{
        $student = Students::findOrFail($student_id);
        
        $student->update([
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'street_address_2' => $request->street_address_2,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'level' => $request->level,
            'gender' => $request->gender,
            'allergies_or_special_needs' => $request->allergies_or_special_needs,
            'emergency_contact_person' => $request->emergency_contact_person,
            'emergency_contact_hospital' => $request->emergency_contact_hospital
        ]);

        return response()->json(['success'=>'Changes Saved']);

    }
    catch(ModelNotFoundException $e){
        \Log::error(['Exception Caught: '=>$e->getMessage()]);
        return response()->json(['errors'=>'Unable to save information, are you sure this student exists?']);
    }

    catch(QueryException $e){
        \Log::error(['Exception Caught: '=>$e->getMessage()]);
        return response()->json(['errors'=>'Unable to save information, something went wrong']);   
    }
}

// public function deleteStudent($student_id)
// {
//     try {

//         if(Auth::guard('faculty')->user()->role !== 'Admin'){
//             return response()->json(['errors'=>'You do not have permission to perform this action']);
//         }

//         // Retrieve the student with associated data
//         $student = Students::with(['attendance', 'assignments', 'grades'])->findOrFail($student_id);

//         if (!$student) {
//             return response()->json(['errors'=>'Student not found']);
//         }

//         // Delete attendance records
//         if ($student->attendance) {
//             $student->attendance->each->delete();
//         }

//         // Delete assignment records
//         if ($student->assignments) {
//             $student->assignments->each->delete();
//         }

//         // Delete grade records
//         if ($student->grades) {
//             $student->grades->each->delete();
//         }

//         // Delete the student
//         $student->delete();

//         return response()->json(['success' => 'Student and associated data deleted successfully']);
//     }
//     catch (ModelNotFoundException $e) {

//         return response()->json(['errors' => $e->getMessage()]);
//     }
//     catch (QueryException $e) {
//         return response()->json(['errors' => $e->getMessage()]);
//     }

// }

public function deleteStudent($student_id)
{
    try {
        if(Auth::guard('faculty')->user()->role !== 'Admin'){
            return response()->json(['errors'=>'You do not have permission to perform this action']);
        }

        // Retrieve the student with associated data
        $student = Students::findOrFail($student_id);

        if (!$student) {
            return response()->json(['errors'=>'Student not found']);
        }

        // Delete associated grades records
        foreach ($student->assignmentStudents as $assignmentStudent) {
            $assignmentStudent->grades()->delete();
            $assignmentStudent->delete();
        }

        // Delete the student
        $student->delete();

        return response()->json(['success' => 'Student and associated data deleted successfully']);
    } catch (ModelNotFoundException $e) {
        \Log::error('Unable to find Student: '.$e->getMessage());
        return response()->json(['errors' => $e->getMessage()]);
    } catch (QueryException $e) {
        \Log::error('Query Exception Encountered: '.$e->getMessage());
        return response()->json(['errors' => $e->getMessage()]);
    }
}


public function deleteAllStudents()
{
    if(Auth::guard('faculty')->user()->role !== 'Admin'){
        return response()->json(['errors'=>'You do not have permission to perform this action']);
    }

    try {
        // Delete all students and associated data
        Students::with(['attendance', 'assignments', 'grades'])->delete();

        return response()->json(['success' => 'All students and their associated data has been deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['errors' => $e->getMessage()]);
    }
}

public function deleteMyStudents()
{
    $permissions = collect(Auth::guard('faculty')->user()->permissions);

    try {
        // Check if the user has the 'can_delete_students' permission
        if (!$permissions->contains('can_delete_students')) {
            return response()->json(['errors' => 'You do not have permission to perform this action']);
        }

        // Delete all students and associated data
        Students::with(['attendance', 'assignments', 'grades'])->where('faculty_id', Auth::guard('faculty')->id())->delete();

        return response()->json(['success' => 'All of your students and their associated data has been deleted successfully']);
    } catch (Exception $e) {
        return response()->json(['errors' => $e->getMessage()]);
    }
}




public function showAllStudents()
{
    try {
        $students = Students::with('user', 'faculty')->orderBy('created_at', 'desc')->get();
        
        return response()->json(['students'=>$students]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error getting students: ' . $e->getMessage()]);
    }
}


public function showStudentsForTeacher($faculty_id)
{
    try {
        $students = Students::with('user', 'faculty')->where('faculty_id', $faculty_id)->orderBy('created_at', 'desc')->get();
        return response()->json(['students' => $students]);
    } catch (\Exception $e) {
        // Log the error message
        error('Error getting students: ' . $e->getMessage());

        return response()->json(['error' => 'Error getting students: ' . $e->getMessage()]);
    }
}

public function showStudentsForParent($parent_id)
{
    try {
        $students = Students::with('user', 'faculty')->where('user_id', $parent_id)->orderBy('created_at', 'desc')->get();
        return response()->json(['students' => $students]);
    } catch (\Exception $e) {
        // Log the error message
        error('Error getting students: ' . $e->getMessage());

        return response()->json(['error' => 'Error getting students: ' . $e->getMessage()]);
    }
}




public function viewStudentDetails($student_id) {
    try {
        $currentYear = now()->format('Y');
      
        $assignmentStudentIDs = AssignmentStudents::where('student_id', $student_id)
        ->pluck('assignment_student_id');

        $grades = Grades::whereIn('assignment_student_id', $assignmentStudentIDs)
        ->whereYear('created_at', $currentYear)
        ->get();

        $totalGrade = $grades->sum('grade');
        $gradesCount = $grades->count();
    
        //Avg Grade: 
        $overallAverageGrade = $gradesCount > 0 ? $totalGrade / $gradesCount : 0;
        $overallAverageGrade = number_format($overallAverageGrade, 1);
        
        
        $student = Students::with('faculty', 'user',)->findOrFail($student_id);
        $assignments = AssignmentStudents::where('student_id', $student_id)->get();
       
        $assignmentStudentIDs = AssignmentStudents::where('student_id', $student_id)
        ->pluck('assignment_student_id');
        
        
        return Inertia::render('Student', ['auth' => Auth::guard('faculty')->user(), 'student' => $student, 'assignments'=>$assignments, 'overall_average_grade' => $overallAverageGrade]);
    } catch (ModelNotFoundException $e) {
        return redirect('faculty/dash');
    }
}

public function getAssignmentsForStudent($student_id){
    try{
    $assignments = AssignmentStudents::where('student_id', $student_id)->with(['assignment'])->get();

    return response()->json(['assignments' => $assignments]);
    }
    catch(QueryException $e){
        return response()->json(['errors'=>'Unable to get assignments, something went wrong']);
        \Log::error(['Unable to fetch assignments: ', $e->getMessage()]);
    }
} 


public function getAttendanceHistoryBystudentID($studentId){
    try{
        $attendanceHistory = Attendance::select('is_present', 'created_at')->where('student_id', $studentId)->get();

        return response()->json(['attendanceHistory' => $attendanceHistory]);
    }
    catch(QueryException $e){
        \Log::error($e->getMessage());
        return response()->json(['errors'=>'Cannot get attendance history']);
    }
}



  public function assignTeacherToStudent($student_id, $faculty_id){
    try{

      if(!isset($student_id, $faculty_id)){
        \Log::error('Student ID: '.$student_id. ' and Faculty ID: '.$faculty_id. ' not found');
        return response()->json(['error'=>'Student ID and Faculty ID are required']);
      }
      $student = Students::where('student_id', $student_id)->firstOrFail();
    //   if($student =  == null){
    //     \Log::info($student);
    //     return response()->json(['error'=>'Unable to find student']);
    //   }

      $assign = Students::where('student_id', $student_id)->update(['faculty_id'=>$faculty_id]);
      $faculty = Faculty::findOrFail($faculty_id);
      Notification::route('mail', $faculty->email)->notify(new StudentAssigned($student_id, $student->first_name, $student->last_name, $faculty->name));
      return response()->json(['success'=>'Teacher has been assigned to this student']);
    }
   
    catch(ModelNotFoundException $e){
        \Log::error($e->getMessage());
        return response()->json(['error'=>'Unable to assign teacher to this student: '. $e->getMessage()]);

    }
    catch(\Exception $e){
        \Log::error($e->getMessage());
        return response()->json(['error'=>'Unable to assign teacher to this student: '. $e->getMessage()]);
    }
  }



  public function assignParentToStudent($student_id, $user_id){
    try{

      if(!isset($student_id, $user_id)){
        \Log::error('Student ID: '.$student_id. ' and User ID: '.$user_id. ' not found');
        return response()->json(['error'=>'Student ID and User ID are required']);
      }
      $student = Students::where('student_id', $student_id)->firstOrFail();
      $assign = Students::where('student_id', $student_id)->update(['user_id'=>$user_id]);
      $user = User::findOrFail($user_id);
      Notification::route('mail', $user->email)->notify(new NotifyUserOfStudentAssigned($student_id, $student->first_name, $student->last_name, $user->name));
      return response()->json(['success'=>'Parent has been assigned to this student']);
    }
   
    catch(ModelNotFoundException $e){
        \Log::error($e->getMessage());
        return response()->json(['error'=>'Unable to assign parent to this student: '. $e->getMessage()]);

    }
    catch(\Exception $e){
        \Log::error($e->getMessage());
        return response()->json(['error'=>'Unable to assign parent to this student: '. $e->getMessage()]);
    }
  }

  public function getGradesForStudent($student_id){
    $currentYear = now()->format('Y');
    $currentMonth = now()->format('m');

    // Retrieve all assignment student IDs for the given student_id 
    $assignmentStudentIDs = AssignmentStudents::where('student_id', $student_id)
        ->pluck('assignment_student_id');


    // fetch the grades tied to the obtained assignment student IDs
    $grades = Grades::whereIn('assignment_student_id', $assignmentStudentIDs)
                    ->whereYear('created_at', $currentYear)
                    ->whereMonth('created_at', $currentMonth)
                    ->get();


    return response()->json(['grades' => $grades]);
}



public function getGradesForAllStudents() {
    $currentYear = now()->format('Y');

    // Fetch grades for all students for the current year
    $grades = DB::table('grades')
        ->whereYear('created_at', $currentYear)
        ->get();

    $gradesData = [];

    // Calculate average grade for each month
    $averageGrades = $grades->groupBy(function ($grade) {
        return Carbon::parse($grade->created_at)->format('F'); // Group by month name
    })->map(function ($monthGrades) {
        return $monthGrades->avg('grade'); // Calculate average grade for each month
    });

    // Store the average grades for each month
    $gradesData = $averageGrades->toArray();

    return response()->json(['grades' => $gradesData]);
}






}
