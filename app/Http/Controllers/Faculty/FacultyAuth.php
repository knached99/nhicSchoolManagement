<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Auth\AuthenticationException; // Catches Authentication Exceptions
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Cookie;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;


class FacultyAuth extends Controller
{
    public function viewLogin(){
        return Inertia::render('Faculty/Login');
    }

    public function authenticate(Request $request)
    {
        try {
            $rules = [
                'email' => 'required|email|exists:faculty',
                'password' => 'required',
            ];

            $messages = [
                'email.required' => 'Your email is required',
                'email.email' => 'You\'ve entered an invalid email',
                'email.exists' => 'An account for that email does not exist',
                'password.required' => 'Your password is required',
            ];

            $this->validate($request, $rules, $messages);

            $rateLimitKey = $request->ip();
            $remainingAttempts = 5 - RateLimiter::attempts($rateLimitKey);

            if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
                $minutesRemaining = ceil(RateLimiter::availableIn($rateLimitKey) / 60);
                throw ValidationException::withMessages([
                    'RATE_LIMIT_THRESHOLD_EXCEEDED' => 'Your account has been locked out due to too many failed login attempts. Please try again in ' . $minutesRemaining . ' minutes.',
                ]);
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
               // dd('User Authenticated: '.Auth::guard('faculty')->user());

                session(['faculty' => Auth::guard('faculty')->user()]);

                return redirect()->intended(RouteServiceProvider::DASH);
            } else {
                dd('User Authentication failed, remaining attempts: '.$remainingAttempts);
                RateLimiter::hit($rateLimitKey, 3600);
                throw ValidationException::withMessages([
                    'auth_error' => 'Your login credentials do not match our records. You have ' . $remainingAttempts . ' attempts remaining before the account gets locked out for 1 hour.',
                ]);
            }
        } catch (ValidationException $e) {
            \Log::info('Validation Exception: ',$e->errors());
            \Log::info(['Email: '.$request->email, ' Password: '.$request->password]);
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::info('Auth Exception: ', $e->getMessage());
            return redirect()->back()->with('EXCEPTION', $e->getMessage());
        }
    }


    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('faculty')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/faculty/login');
    }
    
}
