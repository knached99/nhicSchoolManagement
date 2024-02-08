<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Auth\AuthenticationException; // Catches Authentication Exceptions
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Cookie;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;


class FacultyAuth extends Controller
{
    public function viewLogin(){
        return Inertia::render('Faculty/Login', [ 
        'status' => session('status'),
        ]);
    }

    public function authenticate(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:faculty',
                'password' => 'required',
            ], [
                'email.required' => 'Your email is required',
                'email.email' => 'You\'ve entered an invalid email',
                'email.exists' => 'An account for that email does not exist',
                'password.required' => 'Your password is required',
            ]);
    
            $rateLimitKey = $request->ip();
            $remainingAttempts = 5 - RateLimiter::attempts($rateLimitKey);
    
            // Set the lockout duration to 10 minutes (600 seconds)
            $lockoutDuration = 600;
    
            if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
                $minutesRemaining = ceil(RateLimiter::availableIn($rateLimitKey) / 60);
                return $this->rateLimitExceededResponse($minutesRemaining);
            }
    
            $rememberMe = $request->input('remember');
    
            if (Auth::guard('faculty')->attempt(['email' => $request->input('email'), 'password' => $request->input('password')], $rememberMe)) {
                if ($rememberMe) {
                    $encryptedEmail = Crypt::encryptString($request->input('email'));
                    $encryptedPassword = Crypt::encryptString($request->input('password'));
    
                    // Use secure cookies instead of regular cookies
                    cookie()->queue('email', $encryptedEmail, 60); // 60 minutes
                    cookie()->queue('password', $encryptedPassword, 60);
                }
    
                RateLimiter::clear($rateLimitKey);
                session(['faculty' => Auth::guard('faculty')->user()]);
                return redirect()->intended(RouteServiceProvider::DASH);
            } else {
                RateLimiter::hit($rateLimitKey, $lockoutDuration);
                return redirect()->back()->withErrors(['auth_error' => 'Your login credentials do not match our records. You have ' . $remainingAttempts . ' attempts remaining before your account gets locked out for 10 minutes']);
            }
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['EXCEPTION' => $e->getMessage()]);
        }
    }


    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('faculty')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/faculty/login');
    }

    private function rateLimitExceededResponse($minutesRemaining)
    {
        return redirect()->back()->withErrors(['RATE_LIMIT_THRESHOLD_EXCEEDED' => 'Your account has been locked out due to too many failed login attempts. Please try again in ' . $minutesRemaining . ' minutes.']);
    }

    public function sendPasswordResetRequest(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            // Send password reset link
            $status = Password::sendResetLink($request->only('email'));

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json(['success' => $status]);
            }
        } catch (ValidationException $e) {

            \Log::error('Validation Errors: ' . $e->getMessage());

            return response()->json(['errors' => $e->getMessage()]);
        } catch (\Exception $e) {

            \Log::error('Exception Caught: ' . $e->getMessage());

            return response()->json(['errors' => 'Unexpected error occurred.']);
        }
    }

  

    
}
