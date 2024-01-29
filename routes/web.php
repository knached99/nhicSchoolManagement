<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Faculty\FacultyAuth;
use App\Http\Controllers\Faculty\FacultyDash;
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
});

Route::post('/faculty/logout', [FacultyAuth::class, 'logout'])->name('faculty.logout');


/* Faculty Auth Routes */

Route::get('/faculty/login', [FacultyAuth::class, 'viewLogin'])->name('login');
Route::post('/authenticate', [FacultyAuth::class, 'authenticate'])->name('authenticate');

require __DIR__.'/auth.php';
