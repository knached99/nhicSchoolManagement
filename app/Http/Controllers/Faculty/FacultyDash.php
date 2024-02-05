<?php

namespace App\Http\Controllers\Faculty;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AccountCreated;
use App\Models\Faculty;
use App\Models\Students;
use Illuminate\Notifications\NotificationException; 
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Imports\StudentsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class FacultyDash extends Controller
{
    public function loadDashboard()
    {
        return Inertia::render('Faculty/Dash', [
            'auth' => function () {
                return ['faculty' => auth('faculty')->user()];
            },
        ]);
    }

    public function loadProfile()
    {
        return Inertia::render('Faculty/Profile/FacultyEdit', [
            'auth' => function () {
                return ['faculty' => auth('faculty')->user()];
            },
        ]);
    }

    public function createFacultyRole(Request $request)
    {
        $rules = [
            'name' => 'required',
            'email' => 'required|email',
            'phone_number' => 'required|regex:/^\d{3}-\d{3}-\d{4}$/',
            'role' => 'required'
        ];
    
        $messages = [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'That is not a valid email',
            'phone_number.required' => 'Phone Number is required',
            'phone_number.regex' => 'Phone number must be a valid US number',
            'role.required' => 'Role is required'
        ];
    
        try {
            $this->validate($request, $rules, $messages);
    
            $password = Str::random(10);
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone_number,
                'password' => Hash::make($password),
                'role' => $request->role,
                'permissions' => ($request->role === 'Admin') ? null : $request->input('permissions', []),
            ];
    
            Faculty::create($data);
            Notification::route('mail', $data['email'])->notify(new AccountCreated($data['name'], $data['email'], $password, $data['role']));
    
            return response()->json(['success' => 'Account created for ' . $data['name'] . ' and instructions have been emailed to ' . $data['email']]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            \Log::error(['Query Exception: ', $e->errorInfo]);
            return response()->json(['errors' => 'Something went wrong creating that account']);
        } catch (NotificationException $e) {
            \Log::error(['Notification Exception: ', $e->getMessage()]);
            return response()->json(['errors' => 'Account created but unable to send email notification: ' . $e->getMessage()]);
        }
    }

public function deleteFacultyUser($faculty_id){
    try{
        Faculty::destroy($faculty_id);
        return response()->json(['success'=>'Successfully deleted that user from the system']);
    }
    catch(\Exception $e){
        return response()->json(['error'=>'Could not delete that user: '.$e->getMessage()]);
    }
}

public function fetchFacultyUsers()
{
    try {
        $admins = Faculty::all();
        return response()->json(['admins'=>$admins]);
    } catch (\Exception $e) {
      \Log::error('Cannot load faculty users: '.$e->getMessage());
        return response()->json(['error' => 'Error fetching faculty users: ' . $e->getMessage()], 500);
    }
}

public function viewFacultyUser($faculty_id){
  try{
    $user = Faculty::where('faculty_id',$faculty_id)->firstOrFail();
    return Inertia::render('Faculty/Profile/ViewProfile', ['auth'=> Auth::guard('faculty')->user(), 'user'=>$user]);
  }
  catch(ModelNotFoundException $e) {
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
    return redirect('faculty/dash');
  }
}

public function studentBatchImport(Request $request)
{
    try {
        $validator = Validator::make($request->only('file'), [
            'file' => 'required|mimes:xls,xlsx',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $file = $request->file('file');
        Excel::import(new StudentsImport, $file);

        return response()->json(['success' => 'Students successfully imported into the system']);
    } catch (\Exception $e) {
        \Log::error('Unable to import students excel spreadsheet: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

// Manually add student

public function addStudent(Request $request){
    try{
        $role = Auth::guard('faculty')->user()->role;
        $permissions = collect(Auth::guard('faculty')->user()->permissions);

        $validator = Validator::make($request->only([
            'first_name',
            'last_name',
            'parent_guardian_email',
            'date_of_birth',
            'address',
            'city',
            'state',
            'zip',
            'grade'
        ]), [
            'first_name' => 'required',
            'last_name' => 'required',
            'parent_guardian_email' => 'required|email',
            'date_of_birth' => 'required|date',
            'address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'zip' => 'required',
            'grade' => 'required'
        ]);
        
        if($validator->fails()){
            \Log::error('Validation Errors In Adding Student: '.$validator->errors());
            return response()->json(['error'=>$validator->errors()], 419);
        }

        $data = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'parent_guardian_email' => $request->parent_guardian_email,
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'grade' => $request->grade,
        ];
        
        // If the user has the role of Teacher and the permission to add a student, set faculty_id
        if ($role === 'Teacher' && $permissions->contains('can_add_student')) {
            $data['faculty_id'] = Auth::guard('faculty')->id();
        }
        
        Students::create($data);
        
        return response()->json(['success'=>$request->first_name. ' '.$request->last_name. ' was added to the system']);
    }
    catch(\Exception $e){
        \Log::error('Add Student Exception: '.$e->getMessage());
        return response()->json(['error'=>$e->getMessage()], 500);
    }
}

public function deleteStudent($student_id)
{
    try {
        // Retrieve the student with associated data
        $student = Students::with(['attendance', 'assignments', 'grades'])->findOrFail($student_id);

        if (!$student) {
            return response()->json(['errors'=>'Student not found']);
        }

        // Delete attendance records
        if ($student->attendance) {
            $student->attendance->each->delete();
        }

        // Delete assignment records
        if ($student->assignments) {
            $student->assignments->each->delete();
        }

        // Delete grade records
        if ($student->grades) {
            $student->grades->each->delete();
        }

        // Delete the student
        $student->delete();

        return response()->json(['success' => 'Student and associated data deleted successfully']);
    }
    catch (ModelNotFoundException $e) {
        \Log::error('Delete Student Exception: ' . $e->getMessage());

        return response()->json(['errors' => $e->getMessage()]);
    }
    catch (QueryException $e) {
        \Log::error('Delete Student Exception: ' . $e->getMessage());

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

        return response()->json(['success' => 'All of your students and associated data deleted successfully']);
    } catch (Exception $e) {
        \Log::error('Delete All Students Exception: ' . $e->getMessage());

        return response()->json(['errors' => $e->getMessage()]);
    }
}




public function showAllStudents()
{
    try {
        $students = Students::orderBy('created_at', 'desc')->get();
        return response()->json(['admins'=>$students]);
    } catch (\Exception $e) {
      \Log::error('Cannot load faculty users: '.$e->getMessage());
        return response()->json(['error' => 'Error fetching students: ' . $e->getMessage()], 500);
    }
}

public function getMyStudents()
{
    try {
        $students = Students::where('faculty_id', Auth::guard('faculty')->id())->orderBy('created_at', 'desc')->get();
        return response()->json(['admins'=>$students]);
    } catch (\Exception $e) {
      \Log::error('Cannot load faculty users: '.$e->getMessage());
        return response()->json(['error' => 'Error fetching students: ' . $e->getMessage()], 500);
    }
}

public function viewStudentDetails($student_id){
    try{
      $student = Students::where('student_id',$student_id)->firstOrFail();
      return Inertia::render('Student', ['auth'=> Auth::guard('faculty')->user(), 'student'=>$student]);
    }
    catch(ModelNotFoundException $e) {
          \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
      return redirect('faculty/dash');
    }
  }


    /**
     * Different Roles 
     * Teacher -> Has ability to manage students (adding students, grades, attendance, export student data)
     * Admin -> Has ability to see everything and manage users 
     */
}

?>