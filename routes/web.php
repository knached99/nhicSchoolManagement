<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Faculty\FacultyAuth;
use App\Http\Controllers\Faculty\FacultyDash;
use App\Http\Controllers\Faculty\FacultyProfileController;
use App\Http\Middleware\FacultyMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/* Faculty Middlware Routes 
These are protected routes and can only be 
accessed if the faculty user is authenticated  
*/ 
Route::group(['middleware' => [FacultyMiddleware::class]], function () {
    Route::get('/faculty/dash', [FacultyDash::class, 'loadDashboard'])->name('faculty.dash');
    Route::get('/faculty/profile', [FacultyDash::class, 'loadProfile'])->name('faculty.profile');
    Route::post('/createFacultyRole', [FacultyDash::class, 'createFacultyRole'])->name('createFacultyRole');
    Route::delete('/deleteFacultyUser/{faculty_id}', [FacultyDash::class, 'deleteFacultyUser'])->name('deleteFacultyUser');
    Route::get('/fetchFacultyUsers', [FacultyDash::class, 'fetchFacultyUsers'])->name('fetchFacultyUsers');
    Route::get('/faculty/profile/{faculty_id}/view', [FacultyDash::class, 'viewFacultyUser'])->name('faculty.profile.view');
    Route::post('/studentBatchImport', [FacultyDash::class, 'studentBatchImport'])->name('studentBatchImport');
    Route::post('/addStudent', [FacultyDash::class, 'addStudent'])->name('addStudent');
    Route::delete('/deleteStudent/{student_id}', [FacultyDash::class, 'deleteStudent'])->name('deleteStudent');
    Route::delete('/deleteAllStudents', [FacultyDash::class, 'deleteAllStudents'])->name('deleteAllStudents');
    Route::delete('/deleteMyStudents', [FacultyDash::class, 'deleteMyStudents'])->name('deleteMyStudents');
    Route::get('/showAllStudents', [FacultyDash::class, 'showAllStudents'])->name('showAllStudents');
    Route::get('/getMyStudents', [FacultyDash::class, 'getMyStudents'])->name('getMyStudents');
    Route::get('/student/{student_id}', [FacultyDash::class, 'viewStudentDetails'])->name('viewStudentDetails');
    // Profile Update Routes
    Route::put('/updateProfile', [FacultyProfileController::class, 'updateProfile'])->name('updateProfile');
    Route::put('/updateFacultyPassword', [FacultyProfileController::class, 'updatePassword'])->name('updateFacultyPassword');
    Route::post('/uploadProfilePic', [FacultyProfileController::class, 'uploadProfilePic'])->name('uploadProfilePic');
});

Route::post('/faculty/logout', [FacultyAuth::class, 'logout'])->name('faculty.logout');


/* Faculty Auth Routes */

Route::get('/faculty/login', [FacultyAuth::class, 'viewLogin'])->name('login');
Route::post('/authenticate', [FacultyAuth::class, 'authenticate'])->name('authenticate');

require __DIR__.'/auth.php';
