<?php

namespace App\Http\Controllers\Faculty;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class FacultyProfileController extends Controller {

    public function updateProfile(Request $request){
        try{
            $validated = $request->validate([
                'email'=>['required', 'email'],
            ]);
            $request->user('faculty')->update([
                'email'=>$validated['email'],
            ]);
            return response()->json(['success'=>'Your information has been saved']);
        }
        catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json(['errors'=>$e->getMessage()]);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'current_password' => ['required'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            if(!Hash::check($request->current_password, Auth::guard('faculty')->user()->password)){
                return response()->json(['errors'=>'Current password must be the one you are using now']);
            }
    
            $request->user('faculty')->update([
                'password' => Hash::make($validated['password']),
            ]);
    
            return response()->json(['success' => 'Password updated successfully']);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['errors' => $e->getMessage()]);
        }
    }
    
    
}

?>