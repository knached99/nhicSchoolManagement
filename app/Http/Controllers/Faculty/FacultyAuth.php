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
use App\Models\Faculty;
use App\Models\LoginAttempts;

// Catch Exceptions 
use Illuminate\Auth\AuthenticationException; 
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\Banned;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Fortify;


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

        $ip = Faculty::where('email', $request->email)->value('client_ip');
        if($ip){
            $decryptedIP = Crypt::decryptString($ip);
        }
        else{
            $decryptedIP = null;
        }
      
        
        $request->validate([
            'email' => 'required|email|exists:faculty',
            'password' => 'required',
        ], [
            'email.required' => 'Your email is required',
            'email.email' => 'You\'ve entered an invalid email',
            'email.exists' => 'An account for that email does not exist',
            'password.required' => 'Your password is required',
        ]);

        $user = Faculty::where('email', $request->email)->first();
        $banned = $this->isBanned($user->faculty_id);

        if ($banned !== null) {
            return redirect()->back()->withErrors(['auth_error'=>$banned]);
        }
       
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
            
            $user = Auth::guard('faculty')->user();

            // if ($user->two_factor_secret && $user->two_factor_confirmed_at !== null) {
            //      return redirect('auth/two-factor-challenge');
            
            //   }

            if ($user->two_factor_secret && $user->two_factor_confirmed_at !== null) {
                // Return an Inertia redirect to the two-factor challenge page
                return Inertia::location('/auth/two-factor-challenge');
            }

           
            if ($rememberMe) {
                $encryptedEmail = Crypt::encryptString($request->input('email'));
                $encryptedPassword = Crypt::encryptString($request->input('password'));

                // Use secure cookies instead of regular cookies
                cookie()->queue('email', $encryptedEmail, 60); // 60 minutes
                cookie()->queue('password', $encryptedPassword, 60);
            }


            if ($ip !== null) {

                if ($decryptedIP !== $request->ip()) {

                    $saveIP = Faculty::where('email', $request->email)->update(['client_ip' => Crypt::encryptString($request->ip())]);

                }
            } else {
                $saveIP = Faculty::where('email', $request->email)->update(['client_ip' => Crypt::encryptString($request->ip())]);
            }
            

            RateLimiter::clear($rateLimitKey);
            $request->session()->regenerate();
            
            return redirect()->intended(RouteServiceProvider::DASH);
            
        } else {
            RateLimiter::hit($rateLimitKey, $lockoutDuration);

            // If decrypted IP is not equal to current IP, then log failed attempt with location 

            if($decryptedIP !== $request->ip()){

            $userAgent = $request->header('User-Agent');

         
            // Get Approximate Location 

        $url = "https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data&ip={$request->ip()}";

        // Fetch the JSON response using file_get_contents
        $response = file_get_contents($url);

        if ($response === false) {
            // Error fetching data
            $data = null;
        } else {
            // Parse JSON response
            $locationData = json_decode($response);
            $latitude = isset($locationData->coordinates) && is_object($locationData->coordinates) && isset($locationData->coordinates->latitude) ? $locationData->coordinates->latitude : '';
            $longitude = isset($locationData->coordinates) && is_object($locationData->coordinates) && isset($locationData->coordinates->longitude) ? $locationData->coordinates->longitude : '';
            // Build data array
            $data = [
                'email_used' => $request->email,
                'client_ip' => Crypt::encryptString($request->ip()),
                'user_agent' => $userAgent,
                'location_information' => $locationData ?
                    ($locationData->city ?? '') . ', ' .
                    ($locationData->region ?? '') . ', ' .
                    ($locationData->area_code ?? '') . ', ' .
                    ($locationData->country ?? '') . ', ' .
                    ($locationData->timezone ?? '') . ', '. 
                    ($latitude ?? '') . ', ' . 
                    ($longitude ?? '') : 
                    null,
                    'google_maps_link'=>"https://www.google.com/maps?q=$latitude,$longitude",
                    'google_earth_link'=>"https://earth.google.com/web/@$latitude,$longitude,1000a,41407.87820565d,1y,0h,0t,0r",
            ];
        }


            LoginAttempts::updateOrCreate(['client_ip' => Crypt::encryptString($request->ip())], $data);

        }

            return redirect()->back()->withErrors(['auth_error' => 'Your login credentials do not match our records. You have ' . $remainingAttempts . ' attempts remaining before your account gets locked out for 10 minutes']);
        }
    
    } catch (ValidationException $e) {
        return redirect()->back()->withErrors($e->errors())->withInput();
    } 
}


// public function authenticate(Request $request)
// {
//     try {
//         // Validate the request data
//         $request->validate([
//             'email' => 'required|email|exists:faculty',
//             'password' => 'required',
//         ], [
//             'email.required' => 'Your email is required',
//             'email.email' => 'You\'ve entered an invalid email',
//             'email.exists' => 'An account for that email does not exist',
//             'password.required' => 'Your password is required',
//         ]);

//         // Attempt to authenticate the user
//         $rememberMe = $request->input('remember');
//         if (Auth::guard('faculty')->attempt(['email' => $request->input('email'), 'password' => $request->input('password')], $rememberMe)) {
//             $user = Auth::guard('faculty')->user();

//            // Here, we check if two-factor authentication is enabled and redirect to the challenge
//            if ($user->two_factor_secret && $user->two_factor_confirmed_at !== null) {
//             \Log::info('2FA Enabled!');
//             \Log::info(Crypt::decryptString($user->two_factor_secret));
//             \Log::info('Redirecting to Auth/TwoFactorChallenge ....');
//             return redirect('auth/two-factor-challenge');
//             \Log::info('Redirect Success!');

//         }
        

//             // Update user's IP and set cookies if necessary
//             $this->updateIpAndSetCookies($request, $user, $rememberMe);

//             // Clear rate limit and regenerate session
//             RateLimiter::clear($request->ip());
//             $request->session()->regenerate();
//             return redirect()->route('faculty.dash');
           
//         }

//         // If authentication fails, handle accordingly
//         RateLimiter::hit($request->ip(), 600);
//         $userAgent = $request->header('User-Agent');

//             // Get Approximate Location 

//         $url = "https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data&ip={$request->ip()}";

//         // Fetch the JSON response using file_get_contents
//         $response = file_get_contents($url);

//         if ($response === false) {
//             // Error fetching data
//             $data = null;
//         } else {
//             // Parse JSON response
//             $locationData = json_decode($response);
//             $latitude = isset($locationData->coordinates) && is_object($locationData->coordinates) && isset($locationData->coordinates->latitude) ? $locationData->coordinates->latitude : '';
//             $longitude = isset($locationData->coordinates) && is_object($locationData->coordinates) && isset($locationData->coordinates->longitude) ? $locationData->coordinates->longitude : '';
//             // Build data array
//             $data = [
//                 'email_used' => $request->email,
//                 'client_ip' => Crypt::encryptString($request->ip()),
//                 'user_agent' => $userAgent,
//                 'location_information' => $locationData ?
//                     ($locationData->city ?? '') . ', ' .
//                     ($locationData->region ?? '') . ', ' .
//                     ($locationData->area_code ?? '') . ', ' .
//                     ($locationData->country ?? '') . ', ' .
//                     ($locationData->timezone ?? '') . ', '. 
//                     ($latitude ?? '') . ', ' . 
//                     ($longitude ?? '') : 
//                     null,
//                     'google_maps_link'=>"https://www.google.com/maps?q=$latitude,$longitude",
//                     'google_earth_link'=>"https://earth.google.com/web/@$latitude,$longitude,1000a,41407.87820565d,1y,0h,0t,0r",
//             ];
//             return redirect()->back()->withErrors(['auth_error' => 'Your login credentials do not match our records. You have ' . $remainingAttempts . ' attempts remaining before your account gets locked out for 10 minutes']);

//         }

//     } catch (ValidationException $e) {
//         \Log::error($e->getMessage());
//         // Handle validation errors
//         return response()->json($e->errors(), 422);
//     }
// }



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

    private function isBanned($userID)
    {

            $status = Banned::where('faculty_id', $userID)->first();
    
            if ($status && $status->ban_status === 1) {

                $banReason = isset($status->ban_reason) ? $status->ban_reason : null;
    
                // Construct the ban message
                $banMessage = '';
                if ($status->permanent_ban === 1) {
                    $banMessage = "You are permanently banned";
                } else {
                    $bannedUntil = isset($status->banned_until) ? Carbon::parse($status->banned_until)->format('l, F jS, Y') : null;
                    $banMessage = $bannedUntil ? "You are banned until $bannedUntil." : '';
                }
    
                // Add ban reason if available
                if ($banReason) {
                    $banMessage .= "The reason for the ban: $banReason";
                }
    
                return $banMessage;
            
        }
    
        return null;
    }
    

    private function updateIpAndSetCookies(Request $request, Faculty $user, bool $rememberMe)
{
    // Get the current IP address from the request
    $currentIP = $request->ip();
    
    // Retrieve the stored client IP address from the database
    $storedEncryptedIP = Faculty::where('email', $request->email)->value('client_ip');

    // Decrypt the stored IP address if it exists
    $storedIP = $storedEncryptedIP ? Crypt::decryptString($storedEncryptedIP) : null;

    // If the stored IP address is different from the current IP address, update the database
    if ($storedIP !== $currentIP) {
        Faculty::where('email', $request->email)->update([
            'client_ip' => Crypt::encryptString($currentIP)
        ]);
    }

    // If "remember me" is enabled, set cookies for email and password
    if ($rememberMe) {
        // Encrypt the email and password
        $encryptedEmail = Crypt::encryptString($request->input('email'));
        $encryptedPassword = Crypt::encryptString($request->input('password'));

        // Set the cookies with the encrypted email and password
        cookie()->queue('email', $encryptedEmail, 60); // Set a cookie for 60 minutes
        cookie()->queue('password', $encryptedPassword, 60); // Set a cookie for 60 minutes
    }
}

    
    
    

  

    
}
