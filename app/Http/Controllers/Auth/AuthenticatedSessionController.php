<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
    
        $request->session()->regenerate();
    
        // Get the encrypted client IP from the database
        $encryptedIP = User::where('email', $request->email)->value('client_ip');
    
        if ($encryptedIP) {
            // Decrypt the client IP
            try {
                $decryptedIP = Crypt::decryptString($encryptedIP);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {

                $decryptedIP = null;
            }
    
            // Update the client IP if it's different from the current IP
            if ($request->ip() !== $decryptedIP) {
                $encryptedCurrentIP = Crypt::encryptString($request->ip());
                $saveIP = User::where('email', $request->email)->update(['client_ip' => $encryptedCurrentIP]);
            }
        } else {
            // Encrypt and store the current IP if no client IP is stored
            $encryptedCurrentIP = Crypt::encryptString($request->ip());
            $saveIP = User::where('email', $request->email)->update(['client_ip' => $encryptedCurrentIP]);
        }
    
        return redirect()->intended(RouteServiceProvider::HOME);
    }
    

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
