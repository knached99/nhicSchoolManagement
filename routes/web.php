<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Faculty\FacultyAuth;
use App\Http\Controllers\Faculty\FacultyDash;
use App\Http\Controllers\Faculty\StudentManagement;
use App\Http\Controllers\BanSystem;
use App\Http\Controllers\AssignmentsController;
use App\Http\Controllers\UserDashboard;
use App\Http\Controllers\Faculty\FacultyProfileController;
use App\Http\Middleware\FacultyMiddleware;
use App\Http\Middleware\BanMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\TwoStepVerification;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/* Parents Routes */
Route::middleware(['web','banMiddleware'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Home', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });
});



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['web', 'auth', 'verified', 'banMiddleware'])->name('dashboard');

Route::middleware(['web', 'auth', 'banMiddleware'])->group(function () {
    Route::get('/getStudents', [UserDashboard::class, 'getStudents'])->name('getStudents');
    Route::get('/studentDetails/{student_id}/view', [UserDashboard::class, 'viewStudentDetails'])->name('viewStudentDetails');
    Route::put('/updateStudentInformation/{student_id}', [UserDashboard::class, 'updateStudentInformation'])->name('updateStudentInformation');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/* Faculty Middlware Routes 
These are protected routes and can only be 
accessed if the faculty user is authenticated  
*/ 

Route::group(['middleware' => [FacultyMiddleware::class, BanMiddleware::class]], function () {
    Route::get('/faculty/dash', [FacultyDash::class, 'loadDashboard'])->name('faculty.dash');
    Route::get('/faculty/profile', [FacultyDash::class, 'loadProfile'])->name('faculty.profile');
    // Failed login attempts 
    Route::get('/faculty/loginattempts', [FacultyDash::class, 'failedLoginAttempts'])->name('faculty.loginattempts');
    Route::get('/faculty/analytics', [FacultyDash::class, 'analytics'])->name('faculty.analytics');
    Route::post('/createFacultyRole', [FacultyDash::class, 'createFacultyRole'])->name('createFacultyRole');
    Route::get('/search', [FacultyDash::class, 'autocompleteSearch'])->name('faculty.autocomplete.search');
    Route::delete('/deleteFacultyUser/{faculty_id}', [FacultyDash::class, 'deleteFacultyUser'])->name('deleteFacultyUser');
    Route::get('/fetchFacultyUsers', [FacultyDash::class, 'fetchFacultyUsers'])->name('fetchFacultyUsers');
    Route::get('/fetchTeachers', [FacultyDash::class, 'fetchTeachers'])->name('fetchTeachers');
    Route::get('/fetchParents', [FacultyDash::class, 'fetchParents'])->name('fetchParents');
    Route::get('/getVerifiedParents', [FacultyDash::class, 'getVerifiedParents'])->name('getVerifiedParents');
    Route::delete('/deleteAllParents', [FacultyDash::class, 'deleteAllParents'])->name('deleteAllParents');
    Route::delete('/deleteParent/{user_id}', [FacultyDash::class, 'deleteParent'])->name('deleteParent');
    Route::get('/faculty/profile/{faculty_id}/view', [FacultyDash::class, 'viewFacultyUser'])->name('faculty.profile.view');
    Route::post('/studentBatchImport', [StudentManagement::class, 'studentBatchImport'])->name('studentBatchImport');
    Route::post('/addStudent', [StudentManagement::class, 'addStudent'])->name('addStudent');
    Route::put('/editStudentInformation/{student_id}', [StudentManagement::class, 'editStudentInformation'])->name('editStudentInformation');
    Route::delete('/deleteStudent/{student_id}', [StudentManagement::class, 'deleteStudent'])->name('deleteStudent');
    Route::delete('/deleteAllStudents', [StudentManagement::class, 'deleteAllStudents'])->name('deleteAllStudents');
    Route::delete('/deleteMyStudents', [StudentManagement::class, 'deleteMyStudents'])->name('deleteMyStudents');
    Route::delete('/deleteParents', [FacultyDash::class, 'deleteParents'])->name('deleteParents');
    Route::delete('/deleteParent/{user_id}', [FacultyDash::class, 'deleteParent'])->name('deleteParent');
    Route::get('/showAllStudents', [StudentManagement::class, 'showAllStudents'])->name('showAllStudents');
    Route::get('/showStudentsForTeacher/{faculty_id}', [StudentManagement::class, 'showStudentsForTeacher'])->name('showStudentsForTeacher');
    Route::get('/student/{student_id}/view', [StudentManagement::class, 'viewStudentDetails'])->name('studentDetails');
    Route::get('/getAttendanceHistoryBystudentID/{student_id}', [StudentManagement::class, 'getAttendanceHistoryBystudentID'])
    ->name('getAttendanceHistoryBystudentID');
    Route::get('/getAssignmentsForStudent/{student_id}', [StudentManagement::class, 'getAssignmentsForStudent'])->name('getAssignmentsForStudent');
    Route::put('/assignTeacherToStudent/{student_id}/{faculty_id}', [StudentManagement::class, 'assignTeacherToStudent'])->name('assignTeacherToStudent');
    Route::put('/assignParentToStudent/{student_id}/{user_id}', [StudentManagement::class, 'assignParentToStudent'])->name('assignParentToStudent');
    Route::put('/updateUserInformation/{faculty_id}', [FacultyDash::class, 'updateUserInformation'])->name('updateUserInformation');
    // Profile Update Routes
    Route::put('/updateProfile', [FacultyProfileController::class, 'updateProfile'])->name('updateProfile');
    Route::put('/updateFacultyPassword', [FacultyProfileController::class, 'updatePassword'])->name('updateFacultyPassword');
    Route::post('/uploadProfilePic', [FacultyProfileController::class, 'uploadProfilePic'])->name('uploadProfilePic');
    Route::post('/uploadWallpaperPic', [FacultyProfileController::class, 'uploadWallpaperPic'])->name('uploadWallpaperPic');
    Route::delete('/removeWallpaper', [FacultyProfileController::class, 'removeWallpaper'])->name('removeWallpaper');
    
    // Get Attendance Data 
    Route::get('/getAttendance/{faculty_id}', [FacultyDash::class, 'getAttendance'])->name('getAttendance');
    // Submit Attendance 
    Route::post('/submitAttendance/{faculty_id}', [FacultyDash::class, 'submitAttendance'])->name('submitAttendance');

    // User Routes 
    Route::get('/getBanStatus/{user_id}', [BanSystem::class, 'getBanStatus'])->name('getBanStatus');
    Route::put('/banOrUnbanUser/{userID}', [BanSystem::class, 'banOrUnbanUser'])->name('banOrUnbanUser');
    Route::post('/blockAttempt/{loginID}', [BanSystem::class, 'blockAttempt'])->name('blockAttempt');
    Route::delete('/deleteFailedAttempt/{loginID}', [BanSystem::class, 'deleteFailedAttempt'])->name('deleteFailedAttempt');

    // Assignments Routes 

    Route::get('/faculty/assignments', [AssignmentsController::class, 'myAssignments'])->name('faculty.assignments');
    Route::get('/faculty/assignmentDetails/{assignment_id}', [AssignmentsController::class, 'assignmentDetails'])->name('faculty.assignmentDetails');
    Route::get('/faculty/studentassignment/{student_id}', [AssignmentsController::class, 'studentAssignment'])->name('faculty.studentassignment');
    Route::get('/getAssignments', [AssignmentsController::class, 'getAssignments'])->name('getAssignments');
    Route::post('/uploadAssignment', [AssignmentsController::class, 'uploadAssignment'])->name('uploadAssignment');
    Route::put('/editAssignmentDetails/{assignment_id}', [AssignmentsController::class, 'editAssignmentDetails'])->name('editAssignmentDetails');
    Route::delete('/deleteAssignment/{assignment_id}', [AssignmentsController::class, 'deleteAssignment'])->name('deleteAssignment');

    // Two-Step Verification 
    // Route::get('/faculty/profile/two-factor-authentication', [TwoStepVerification::class, 'display'])->name('two-factor-authentication.show');
    // Route::post('/faculty/profile/enable-two-factor-authentication', [TwoStepVerification::class, 'enable']);
    // Route::delete('/faculty/profile/disable-two-factor-authentication', [TwoStepVerification::class, 'disable']);
    // Route::post('/faculty/profile/confirm-two-factor-authentication', [TwoStepVerification::class, 'confirm']);
    // Route::get('/faculty/profile/two-factor-recovery-codes', [TwoStepVerification::class, 'showRecoveryCodes']);
    // Route::post('/faculty/profile/regenerate-recovery-codes', [TwoStepVerification::class, 'regenerateRecoveryCodes']);
});

Route::post('/faculty/logout', [FacultyAuth::class, 'logout'])->name('faculty.logout');


/* Faculty Auth Routes */

Route::get('/faculty/login', [FacultyAuth::class, 'viewLogin'])->name('faculty.login')->middleware('web', 'banMiddleware');
Route::post('/authenticate', [FacultyAuth::class, 'authenticate'])->name('authenticate');


// Route for banned users

Route::get('/banned', [BanSystem::class, 'banView'])->name('banned');

require __DIR__.'/auth.php';
