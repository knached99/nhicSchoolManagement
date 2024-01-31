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
            'phone_number' => $request->phone_number,
            'password' => Hash::make($password),
            'role' => $request->role
        ];

        Faculty::create($data);
        Notification::route('mail', $data['email'])->notify(new AccountCreated($data['name'], $data['email'], $password, $data['role']));

        return response()->json(['success' => 'Account created for ' . $data['name'] . ' and instructions have been emailed to ' . $data['email']]);
    } catch (ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    } catch (NotificationException $e) {
        return response()->json(['error' => $e->getMessage()], 500);
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
   // dd($user, Auth::guard('faculty')->user());
    return Inertia::render('Faculty/Profile/ViewProfile', ['auth'=> Auth::guard('faculty')->user(), 'user'=>$user]);
  }
  catch(ModelNotFoundException $e) {
    \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());

    return Inertia::render('Faculty/Dash', ['error'=>' Cannot find information on that user, it is possible that user does not exist.']);
  }
}

public function studentBatchImport(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
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

public function showAllStudents()
{
    try {
        $students = Students::orderBy('created_at', 'desc')->take(10)->get();
        return response()->json(['admins'=>$students]);
    } catch (\Exception $e) {
      \Log::error('Cannot load faculty users: '.$e->getMessage());
        return response()->json(['error' => 'Error fetching students: ' . $e->getMessage()], 500);
    }
}


    /**
     * Different Roles 
     * Teacher -> Has ability to manage students (adding students, grades, attendance, export student data)
     * Admin -> Has ability to see everything and manage users 
     */
}

?>