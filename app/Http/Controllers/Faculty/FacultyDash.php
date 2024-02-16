<?php

namespace App\Http\Controllers\Faculty;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AccountCreated;
use App\Notifications\StudentAssigned;
use App\Notifications\NotifyUserOfStudentAssigned;
use App\Models\Faculty;
use App\Models\Students;
use App\Models\User;
use Illuminate\Notifications\NotificationException; 
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Imports\StudentsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use Laravel\Scout\Searchable;

class FacultyDash extends Controller
{
    use Searchable;

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
            'email' => 'required|email|unique:faculty',
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
            return response()->json(['errors' =>$e->getMessage()]);
        } catch (QueryException $e) {
            return response()->json(['errors' => 'Something went wrong creating that account']);
        } catch (NotificationException $e) {
            return response()->json(['errors' => 'Account created but unable to send email notification: ' . $e->getMessage()]);
        }
    }

public function deleteFacultyUser($faculty_id){
    try{

        if(Auth::guard('faculty')->user()->role !== 'Admin'){
            return response()->json(['error'=>'You do not have permission to perform this action']);
        }

        $user = Faculty::findOrFail($faculty_id);
        if($user->profile_pic && Storage::exists('public/profile_pics/'.basename($user->profile_pic))){
            Storage::delete('public/profile_pics/'.basename($user->profile_pic));
        }
        $user->delete();
        return response()->json(['success'=>'Successfully deleted that user from the system']);
    }

    catch(ModelNotFoundException $e){
        return Inertia::render('Faculty/Dash');
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
        return response()->json(['error' => 'Error getting faculty users: ' . $e->getMessage()]);
    }
}



public function fetchParents()
{
    try {
        $parents = User::all();
        return response()->json(['parents'=>$parents]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error getting parents: ' . $e->getMessage()]);
    }
}

public function getVerifiedParents(){
    try{
        $verifiedParents = User::whereNotNull('email_verified_at')->get();
        return response()->json(['parents'=>$verifiedParents]);
    }
    catch(QueryException $e){
        return response()->json(['error' => 'Error getting parents: ' . $e->getMessage()]);
    }
}

public function deleteParents()
{
    if(Auth::guard('faculty')->user()->role !== 'Admin'){
        return response()->json(['errors'=>'You do not have permission to perform this action']);
    }

    try {
        // Delete all parents and associated data
        User::with(['students'])->delete();


        return response()->json(['success' => 'All parents and their associated data has been deleted successfully']);
    } catch (\Exception $e) {
        \Log::error('Exception Encountered: '.$e->getMessage());
        return response()->json(['errors' => $e->getMessage()]);
    }
}

public function deleteParent($user_id){
    try{
        
        if(Auth::guard('faculty')->user()->role !== 'Admin'){
            return response()->json(['error'=>'You do not have permission to perform this action']);
        }

        User::destroy($user_id);
        return response()->json(['success'=>'Successfully deleted that user from the system']);
    }

    catch(ModelNotFoundException $e){
        return Inertia::render('Faculty/Dash');
    }
    catch(\Exception $e){
        return response()->json(['error'=>'Could not delete that user: '.$e->getMessage()]);
    }
}

public function fetchTeachers(){
    try{
        $teachers = Faculty::select('faculty_id', 'name', 'email')->where('role', 'Teacher')->get();
        return response()->json(['teachers'=>$teachers]);
    }
    catch(\Exception $e){
        return response()->json(['error' => 'Error getting teachers: ' . $e->getMessage()]);
    }
}

public function viewFacultyUser($faculty_id){
  try{
    $user = Faculty::where('faculty_id',$faculty_id)->firstOrFail();
    $students = Students::where('faculty_id', $faculty_id)->get();
    return Inertia::render('Faculty/Profile/ViewProfile', ['auth'=> Auth::guard('faculty')->user(), 'user'=>$user, 'students'=>$students]);
  }
  catch(ModelNotFoundException $e) {
    return redirect('faculty/dash');
  }
}

public function updateUserInformation(Request $request, $faculty_id){
    try{
        $request->only([
            'email',
            'phone_number', 
            'role'
        ]);

        
        if (!preg_match('/^\d{3}-\d{3}-\d{4}$/', $request->phone_number)) {
            return response()->json(['errors'=>'Phone number must be a valid US number']);
        }

        $data = [
            'email'=>$request->email, 
            'phone'=>$request->phone_number, 
            'role'=>$request->role
        ]; 

        Faculty::where('faculty_id', $faculty_id)->update($data);
        return response()->json(['success'=>'Your changes have been saved']);
    }
    catch(\Exception $e){
        return response()->json(['errors'=> $e->getMessage()]);
        \Log::error('Query Exception: '.$e->getMessage());
    }
    catch(QueryException $e){
        return response()->json(['errors'=> 'Something went wrong saving your changes']);
        \Log::error('Query Exception: '.$e->getMessage());
    }
}

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

// Manually add student

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
            'user_id'=>$request->user_id
        ];
        
        // If the user has the role of Teacher
        if ($role === 'Teacher') {
            $data['faculty_id'] = Auth::guard('faculty')->id();
        }

        if(isset($data['user_id'])){
            $user = User::findOrFail($data['user_id']);
            Notification::route('mail', $user->email)->notify(new NotifyUserOfStudentAssigned($data['user_id'], $data['first_name'], $data['last_name'], $user->name));
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

public function deleteStudent($student_id)
{
    try {

        if(Auth::guard('faculty')->user()->role !== 'Admin'){
            return response()->json(['errors'=>'You do not have permission to perform this action']);
        }

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

        return response()->json(['errors' => $e->getMessage()]);
    }
    catch (QueryException $e) {
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
        $students = Students::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json(['students'=>$students]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error getting students: ' . $e->getMessage()]);
    }
}

public function getMyStudents()
{
    try {
        $students = Students::with('user')->where('faculty_id', Auth::guard('faculty')->id())->orderBy('created_at', 'desc')->get();
        return response()->json(['students'=>$students]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error getting students: ' . $e->getMessage()]);
    }
}


public function showStudentsForTeacher($faculty_id)
{
    try {
        $students = Students::with('user')->where('faculty_id', $faculty_id)->orderBy('created_at', 'desc')->get();

        return response()->json(['students' => $students]);
    } catch (\Exception $e) {
        // Log the error message
        error('Error getting students: ' . $e->getMessage());

        return response()->json(['error' => 'Error getting students: ' . $e->getMessage()]);
    }
}


public function viewStudentDetails($student_id) {
    try {
        $student = Students::with('faculty', 'user')->findOrFail($student_id);
        return Inertia::render('Student', ['auth' => Auth::guard('faculty')->user(), 'student' => $student]);
    } catch (ModelNotFoundException $e) {
        return redirect('faculty/dash');
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

  // AutoComplete Search  

  public function autocompleteSearch(Request $request)
  {
      try {
          $query = $request->input('query');
  
          // Use Scout's search method for full-text search
          $facultyResults = Faculty::search($query)->get(['faculty_id', 'name', 'email', 'phone', 'role', 'room_number'])->toArray();
          $studentResults = Students::search($query)->get(['student_id', 'first_name', 'last_name', 'date_of_birth', 'address', 'street_address_2', 'city', 'state', 'zip', 'level', 'gender', 'allergies_or_special_needs', 'emergency_contact_person', 'emergency_contact_hospital'])->toArray();
          $userResults = User::search($query)->get(['id', 'name', 'email', 'phone', 'address', 'address_2', 'city', 'state', 'zip'])->toArray();
  
          // You can customize the result structure based on your needs
          $results = [
              'faculty' => $facultyResults,
              'students' => $studentResults,
              'users' => $userResults,
          ];
  
          \Log::info(['Search Results' => $results]);
          return response()->json(['results' => $results]);
      } catch (\Exception $e) {
          \Log::error('Search Error: ' . $e->getMessage());
          return response()->json(['error' => 'An error occurred during the search.']);
      }
  }
  
  
}

?>