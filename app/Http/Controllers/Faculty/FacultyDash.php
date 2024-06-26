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
use App\Models\LoginAttempts;
use App\Models\Attendance;
use App\Models\Assignments;
use App\Models\Grades;
use App\Models\AssignmentStudents; 
use App\Models\Notifications;

use Carbon\Carbon;
use Illuminate\Contracts\Encryption\DecryptException;
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
        $facultyCount = Faculty::count();
        $studentsCount = Students::count();
        $parentsCount = User::count();
        $user = Auth::guard('faculty')->user();
        $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [$user->faculty_id])->get();
    
        // Directly pass `notifications` as a top-level prop alongside other props
        return Inertia::render('Faculty/Dash', [
            'auth' => [
                'faculty' => $user,
            ],
            'facultyCount' => $facultyCount,
            'studentsCount' => $studentsCount,
            'parentsCount' => $parentsCount,
            'notifications' => $notifications, // Passing the `notifications` directly
        ]);
    }

    public function massDeleteNotifications()
    {
    
        try {
            $user = auth('faculty')->user();
    
            if (!$user) {
                throw new \Exception('User not found');
            }
    
            // We need to access the notifications relationship
            // and delete each notification individually
            $user->notifications->each(function ($notification) {
                $notification->delete();
            });
    
            return response()->json(['success' => 'Notifications deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to delete notifications because: ' . $e->getMessage());
            return response()->json(['errors' => 'Failed to delete notifications']);
        }
    }
    
    
    
    
    
    public function failedLoginAttempts(){
        try{
            $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [auth('faculty')->id()])->get();

            if(Auth::guard('faculty')->user()->role !== 'Admin'){
                return redirect('faculty/dash', [
                    'notifications'=>$notifications
                ]);
            }
            
        $attempts = LoginAttempts::all();
        

        foreach($attempts as $attempt){
            $attempt->client_ip = Crypt::decryptString($attempt->client_ip);
        }
        
    }

        catch(QueryException $e){
            \Log::error(['Login Attempts Query Error: ', $e->getMessage()]);
            return redirect('faculty/dash');
        }
        return Inertia::render('Faculty/LoginAttempts', [
            'auth' => auth('faculty')->user(),
            'attempts'=>$attempts
        ]);
    }

    public function analytics()
    {
        if(auth('faculty')->user()->role !=='Admin'){
            return redirect('faculty/dash');
        }
        $currentMonth = Carbon::now()->format('m');
        $currentYear = Carbon::now()->format('Y');
        $facultyData = [];
        $studentData = [];
        $parentData = [];
        // Count faculty members
        $facultyCount = Faculty::count();
        $facultyData[] = $facultyCount;

        // Count students
        $studentCount = Students::count();
        $studentData[] = $studentCount;

        // Count parents
        $parentCount = User::count();
        $parentData[] = $parentCount;
    

        $storage = $this->calculateStorageUsed(); // Calculates Storage Usage
        $filesCount = $this->countFilesInDirectories(); // Calculates number of files within 3 folders
        $storageLeft = $this->calculateStorageLeft(); // Calculates the amount of storage left 

        // Storage Usage 
        $logsSize = isset($storage['logs']) ? $storage['logs'] : 0;
        $wallpaperSize = isset($storage['wallpaper']) ? $storage['wallpaper'] : 0;
        $profilePicsSize = isset($storage['profile']) ? $storage['profile'] : 0;
        $totalSize = isset($storage['total']) ? $storage['total'] : 0;

        // file counts 
        $totalFiles = isset($filesCount['total']) ? $filesCount['total'] : 0;
        $logFiles = isset($filesCount['logs']) ? $filesCount['logs'] : 0;
        $wallpaperFiles = isset($filesCount['wallpaper']) ? $filesCount['wallpaper'] : 0;
        $profileFiles = isset($filesCount['profile']) ? $filesCount['profile'] : 0;
        $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [auth('faculty')->id()])->get();


        return Inertia::render('Faculty/Analytics', [
            'auth'=>Auth::guard('faculty')->user(),
            'facultyData'=>$facultyData, 
            'studentsData'=>$studentData, 
            'parentsData'=>$parentData, 
            'totalSize'=>$totalSize, 
            'logsSize'=>$logsSize, 
            'wallpaperSize'=>$wallpaperSize,
            'profilePicsSize'=>$profilePicsSize,
            'storageLeft' =>$storageLeft,
            'totalFiles' =>$totalFiles, 
            'logFiles' =>$logFiles, 
            'wallpaperFiles'=>$wallpaperFiles, 
            'profileFiles'=>$profileFiles,
            'notifications'=>$notifications
        ]);


    }
    


    public function loadProfile()
    {
        $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [Auth::guard('faculty')->id()])->get();
        
        return Inertia::render('Faculty/Profile/FacultyEdit', [
            'auth' => [
                'faculty' => auth('faculty')->user(),
            ],

            'notifications' => $notifications, // Passing the `notifications` directly
        ]);
    }


    public function createFacultyRole(Request $request)
    {
        $rules = [
            'name' => 'required',
            'email' => 'required|email|unique:faculty',
            'phone' => 'required|regex:/^\(\d{3}\) \d{3}-\d{4}$/|unique:faculty',
            'role' => 'required'
        ];
    
        $messages = [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'That is not a valid email',
            'email.unique'=>'That email is already taken',
            'phone.required' => 'Phone Number is required',
            'phone.regex' => 'Phone number must be a valid US number',
            'phone.unique'=>'That number is already taken',
            'role.required' => 'Role is required'
        ];
    
        try {
        $this->validate($request, $rules, $messages);
    
            $password = Str::random(10);
            $data = [
                'faculty_id'=>Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($password),
                'role' => $request->role,
                'permissions' => ($request->role === 'Admin') ? null : $request->input('permissions', []),
            ];
    
            Faculty::create($data);
            Notification::route('mail', $data['email'])->notify(new AccountCreated($data['name'], $data['email'], $password, $data['role']));
    
            return response()->json(['success' => 'Account created for ' . $data['name'] . ' and instructions have been emailed to ' . $data['email']]);
        } catch (ValidationException $e) {
            \Log::error(['Validation Exception: '. $e->getMessage()]);
            return response()->json(['errors' =>$e->getMessage()]);
        } catch (QueryException $e) {
            \Log::error(['Query Exception: '. $e->getMessage()]);
            return response()->json(['errors' => 'Something went wrong creating that account']);
        } catch (NotificationException $e) {
            \Log::error(['Notification Exception: '.$e->getMessage()]);
            return response()->json(['errors' => 'Account created but unable to send email notification. Have user reset their password']);
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
        $admins = Faculty::with(['banned' => function ($query) {
            // Use withDefault to ensure the relationship is always loaded
            $query->withDefault();
        }])->get();
        return response()->json(['admins' => $admins]);
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

public function viewParentDetails($parent_id) {
    $parent = User::with(['students'])->where('user_id', $parent_id)->first();
    $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [auth('faculty')->id()])->get();

    if (!$parent) {
        return redirect()->route('faculty.dash');
    }
    try{
    // Decrypt client_ip, latitude, and longitude
    $decryptedClientIp = Crypt::decryptString($parent->client_ip);
    $decryptedLatitude = Crypt::decryptString($parent->latitude);
    $decryptedLongitude = Crypt::decryptString($parent->longitude);
    }
    catch(DecryptException $e){
        $decryptedClientIp = null;
        $decryptedLatitude = null;
        $decryptedLongitude = null;
        \Log::error(['Decryption Failed: '.$e->getMessage()]);
    }

    $auth = Auth::guard('faculty')->user();
    // list -> assigns variables as if they were in an array
    list($studentWithHighestAverage, $highestAverage) = $this->studentWithHighestGradeAverage($parent_id);
    
    return Inertia::render('Faculty/Parent', [
        'auth' => $auth, 
        'parent' => $parent,
        'decryptedClientIp' => $decryptedClientIp,
        'decryptedLatitude' => $decryptedLatitude,
        'decryptedLongitude' => $decryptedLongitude,
        'studentWithHighestAverage' => $studentWithHighestAverage,
        'highestAverage' => $highestAverage,
        'notifications' => $notifications
    ]);
}



private function studentWithHighestGradeAverage($user_id){
    $students = Students::where('user_id', $user_id)->orWhere('faculty_id', $user_id)->get();
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
    return [$studentWithHighestAverage, $highestAverage];

}




public function viewFacultyUser($faculty_id){
  try{
    if(Auth::guard('faculty')->id() === $faculty_id){
        return redirect('faculty/profile');
    }
    
    $user = Faculty::where('faculty_id',$faculty_id)->firstOrFail();
    $students = Students::where('faculty_id', $faculty_id)->get();
    $assignmentsCount = Assignments::where('faculty_id',$faculty_id)->count();
    $bannedDetails = Banned::where('faculty_id', $faculty_id)->get();
    $decryptedIP = isset($user->client_ip) ? Crypt::decryptString($user->client_ip) : null;
    list($studentWithHighestAverage, $highestAverage) = $this->studentWithHighestGradeAverage($faculty_id);

    $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [auth('faculty')->id()])->get();


return Inertia::render('Faculty/Profile/ViewProfile', 

['auth'=> Auth::guard('faculty')->user(),
  'user'=>$user,
   'students'=>$students,
   'bannedDetails'=>$bannedDetails, 
   'clientIP'=>$decryptedIP, 
   'assignmentsCount'=>$assignmentsCount,
   'studentWithHighestAverage'=>$studentWithHighestAverage,
   'highestAverage'=>$highestAverage,
   'notifications'=>$notifications
],

);
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

        
        if (!preg_match('/^\(\d{3}\) \d{3}-\d{4}$/', $request->phone_number)) {
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




  public function getAttendance($faculty_id)
{
    try {
        $todayDate = Carbon::now()->toDateString();

        $attendance = Attendance::where('faculty_id', $faculty_id)
            ->whereDate('created_at', $todayDate)
            ->get();
        return response()->json(['attendance' => $attendance]);
    } catch (QueryException $e) {
        \Log::error($e->getMessage());
        return response()->json(['error' => 'Cannot get attendance data']);
    }
}

// Submit Attendance
public function submitAttendance(Request $request, $faculty_id)
{
    try {
        $request->validate([
            'attendanceData' => 'required|array'
        ]);

        $currentDate = Carbon::now()->startOfDay(); // Get the current date at midnight 

        foreach ($request->attendanceData as $attendanceRecord) {
            $conditions = [
                'student_id' => $attendanceRecord['student_id'],
                'faculty_id' => $faculty_id,
                'created_at' => $currentDate,
            ];

            $values = [
                'attendance_id' => Str::uuid(), 
                'is_present' => $attendanceRecord['is_present'],
                // 'reason_for_absence' => $attendanceRecord['reason_for_absence'] ?? null,
            ];

            Attendance::updateOrCreate($conditions, $values);
        }

        return response()->json(['success' => 'Attendance data submitted']);
    } catch (ValidationException $e) {
        return response()->json(['error' =>$e->getMessage()]);
    }
}

  

  // AutoComplete Search  

  public function autocompleteSearch(Request $request)
  {
      try {
          $query = $request->input('query');
          $authenticatedUser = Auth::guard('faculty')->user(); 


          $facultyResults = Faculty::where('name', 'LIKE', "%$query%")
              ->orWhere('email', 'LIKE', "%$query%")
              ->orWhere('phone', 'LIKE', "%$query%")
              ->orWhere('role', 'LIKE', "%$query%")
              ->orWhere('room_number', 'LIKE', "%$query%")
              ->select('faculty_id', 'name', 'email', 'phone', 'role', 'room_number', 'profile_pic')
              ->get()
              ->toArray();

        if($authenticatedUser->role === 'Admin'){
            $studentResults = Students::where('first_name', 'LIKE', "%$query%")
            ->orWhere('last_name', 'LIKE', "%$query%")
            ->orWhere('address', 'LIKE', "%$query%")
            ->orWhere('street_address_2', 'LIKE', "%$query%")
            ->orWhere('city', 'LIKE', "%$query%")
            ->orWhere('state', 'LIKE', "%$query%")
            ->orWhere('zip', 'LIKE', "%$query%")
            ->orWhere('level', 'LIKE', "%$query%")
            ->orWhere('gender', 'LIKE', "%$query%")
            ->orWhere('allergies_or_special_needs', 'LIKE', "%$query%")
            ->orWhere('emergency_contact_person', 'LIKE', "%$query%")
            ->orWhere('emergency_contact_hospital', 'LIKE', "%$query%")
            ->select('student_id', 'first_name', 'last_name', 'date_of_birth', 'address', 'street_address_2', 'city', 'state', 'zip', 'level', 'gender', 'allergies_or_special_needs', 'emergency_contact_person', 'emergency_contact_hospital')
            ->get()
            ->toArray();
        }
     

        else if($authenticatedUser->role === 'Teacher' || $authenticatedUser === 'Assistant Teacher'){
            $studentResults = Students::where('faculty_id', $authenticatedUser->faculty_id)
            ->where('first_name', 'LIKE', "%$query%")
            ->orWhere('last_name', 'LIKE', "%$query%")
            ->orWhere('address', 'LIKE', "%$query%")
            ->orWhere('street_address_2', 'LIKE', "%$query%")
            ->orWhere('city', 'LIKE', "%$query%")
            ->orWhere('state', 'LIKE', "%$query%")
            ->orWhere('zip', 'LIKE', "%$query%")
            ->orWhere('level', 'LIKE', "%$query%")
            ->orWhere('gender', 'LIKE', "%$query%")
            ->orWhere('allergies_or_special_needs', 'LIKE', "%$query%")
            ->orWhere('emergency_contact_person', 'LIKE', "%$query%")
            ->orWhere('emergency_contact_hospital', 'LIKE', "%$query%")
            ->select('student_id', 'first_name', 'last_name', 'date_of_birth', 'address', 'street_address_2', 'city', 'state', 'zip', 'level', 'gender', 'allergies_or_special_needs', 'emergency_contact_person', 'emergency_contact_hospital')
            ->get()
            ->toArray();

        }

        $assignmentsResults = Assignments::where(function ($q) use ($authenticatedUser) {
            if ($authenticatedUser->role === 'Teacher') {
                $q->where('faculty_id', $authenticatedUser->faculty_id);
            }
        })
        ->where(function ($q) use ($query) {
            $q->where('assignment_name', 'LIKE', "%$query%")
            ->orWhere('assignment_description', 'LIKE', "%$query%");
        })
        ->get()
        ->toArray();
        
  
        
  
          $userResults = User::where('name', 'LIKE', "%$query%")
              ->orWhere('email', 'LIKE', "%$query%")
              ->orWhere('phone', 'LIKE', "%$query%")
              ->orWhere('address', 'LIKE', "%$query%")
              ->orWhere('address_2', 'LIKE', "%$query%")
              ->orWhere('city', 'LIKE', "%$query%")
              ->orWhere('state', 'LIKE', "%$query%")
              ->orWhere('zip', 'LIKE', "%$query%")
              ->select('user_id', 'name', 'email', 'phone', 'address', 'address_2', 'city', 'state', 'zip')
              ->get()
              ->toArray();
  
          // Merge the results and remove duplicates
          $results = array_unique(array_merge($facultyResults, $studentResults, $userResults, $assignmentsResults), SORT_REGULAR);

          return response()->json(['results' => $results]);
        
      } catch (\Exception $e) {
          \Log::error('Search Error: ' . $e->getMessage());
          return response()->json(['error' => 'An error occurred during the search.']);
      }
  }
  
  // Calculate Storage Usage 

  private function calculateStorageUsed()
  {
      // Define the paths to the directories
      $wallpaperPath = storage_path('app/public/wallpaper_pics');
      $profilePath = storage_path('app/public/profile_pics');
      $laravelLogPath = storage_path('logs/laravel.log');
  
      // Calculate the size of each directory
      $wallpaperSize = $this->calculateDirectorySize($wallpaperPath);
      $profileSize = $this->calculateDirectorySize($profilePath);
  
      // Get the size of laravel.log file
      if (file_exists($laravelLogPath)) {
          $laravelLogSize = filesize($laravelLogPath);

        } else {
          $laravelLogSize = 0; // Set size to 0 if file doesn't exist
        }
  
      // Calculate the total size used
      $totalSize = $wallpaperSize + $profileSize + $laravelLogSize;
  
      // Convert bytes to human-readable format
      $totalSizeHumanReadable = $this->formatBytes($totalSize);
      $wallpaperSizeHumanReadable = $this->formatBytes($wallpaperSize);
      $profilePicsSizeHumanReadable = $this->formatBytes($profileSize);
      $laravelLogSizeHumanReadable = $this->formatBytes($laravelLogSize);
  
      // Return the storage data
      return [
          'total' => $totalSizeHumanReadable,
          'wallpaper' => $wallpaperSizeHumanReadable,
          'profile' => $profilePicsSizeHumanReadable,
          'logs' => $laravelLogSizeHumanReadable,
      ];
  }
  
  


private function calculateDirectorySize ($dir)
{
    $size = 0;

    foreach (glob(rtrim($dir, '/').'/*', GLOB_NOSORT) as $each) {
        $size += is_file($each) ? filesize($each) : folderSize($each);
    }

    return $size;
}



private function formatBytes($bytes, $precision = 2)
{
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];

    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);

    // Uncomment one of the following alternatives
    // $bytes /= pow(1024, $pow);
    $bytes /= (1 << (10 * $pow));

    return round($bytes, $precision) . ' ' . $units[$pow];
}


private function calculateStorageLeft()
{
    // Define the paths to the directories
    // $wallpaperPath = storage_path('app/public/wallpaper_pics');
    // $profilePath = storage_path('app/public/profile_pics');
    // $logsPath = storage_path('logs');

    $totalStorageLimit = disk_free_space(storage_path());

    // Make sure $totalStorageLimit is in bytes
    if (!is_numeric($totalStorageLimit)) {
        // Handle the case where total storage limit couldn't be determined
        // You might want to set a default value or throw an error
        return 'Unable to calculate storage left. Non-numeric total storage limit encountered.';
    } else {
        // Convert the total storage limit to human-readable format
        $totalStorageLimitHumanReadable = $this->formatBytes($totalStorageLimit);

        // Get the current storage usage
        $storageUsed = $this->calculateStorageUsed();

        // Convert the human-readable storage used to bytes
        $storageUsedBytes = $this->convertHumanReadableToBytes($storageUsed['total']);

        // Calculate the storage left
        $storageLeft = $totalStorageLimit - $storageUsedBytes;

        // Convert bytes to human-readable format
        $storageLeftHumanReadable = $this->formatBytes($storageLeft);

        // Now you have the accurate total storage limit and storage left
        return $storageLeftHumanReadable;
    }
}


// Function to convert human-readable size (e.g., "1.83 MB") to bytes
private function convertHumanReadableToBytes($sizeString)
{
    // Extract numeric part
    $numericPart = (float) $sizeString;
    // Extract unit part
    $unit = strtoupper(trim(preg_replace('/[0-9\. ]/', '', $sizeString)));

    switch ($unit) {
        case 'GB':
            return $numericPart * 1024 * 1024 * 1024;
        case 'MB':
            return $numericPart * 1024 * 1024;
        case 'KB':
            return $numericPart * 1024;
        default:
            return $numericPart;
    }
}


private function countFilesInDirectories() {
    // Define the paths to the directories
    $wallpaperPath = storage_path('app/public/wallpaper_pics');
    $profilePath = storage_path('app/public/profile_pics');
    $logsPath = storage_path('logs');

    // Count files in each directory recursively
    $wallpaperCount = $this->countFilesRecursive($wallpaperPath);
    $profileCount = $this->countFilesRecursive($profilePath);
    $logFiles = glob($logsPath . '/*.log');
    $logsCount = count($logFiles);
    $totalCount = $wallpaperCount + $profileCount + $logsCount;
    

    // Return the counts
    return [
        'wallpaper' => $wallpaperCount,
        'profile' => $profileCount,
        'logs' => $logsCount,
        'total' => $totalCount,
    ];
}


private function countFilesRecursive($directory) {
    // Initialize count to 0
    $fileCount = 0;

    // Open the directory
    $dir = opendir($directory);

    // Loop through each file and directory
    while (($file = readdir($dir)) !== false) {
        // Skip . and .. directories
        if ($file == '.' || $file == '..') {
            continue;
        }

        // Get the full path of the file or directory
        $filePath = $directory . '/' . $file;

        // If it's a directory, recursively count files in it
        if (is_dir($filePath)) {
            $fileCount += $this->countFilesRecursive($filePath);
        } else {
            // If it's a file, increment the count
            $fileCount++;
        }
    }

    // Close the directory
    closedir($dir);

    return $fileCount;
}


  
}

?>