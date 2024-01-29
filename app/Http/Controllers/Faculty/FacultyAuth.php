<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\FacultyLoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class FacultyAuth extends Controller
{
    public function viewLogin(){
        return Inertia::render('Faculty/Login');
    }

    // public function authenticate(FacultyLoginRequest $request) : RedirectResponse
    // {
    //     $request->authenticate();
    //     $request->session()->regenerate();
    //     $user = Auth::guard('faculty')->user(); // Get the authenticated faculty user 

    //     return redirect()->intended(RouteServiceProvider::DASH)->with('auth', $user);
    // }

    public function authenticate(FacultyLoginRequest $request) : RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    $user = Auth::guard('faculty')->user();

    // Pass the user data to the frontend directly
    return redirect()->intended(RouteServiceProvider::DASH)->with('auth', $user);
}

    


    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('faculty')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/faculty/login');
    }
    
}
