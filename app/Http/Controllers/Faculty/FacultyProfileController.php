<?php

namespace App\Http\Controllers\Faculty;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Image;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class FacultyProfileController extends Controller {

    public function updateProfile(Request $request){
        try{
            $validated = $request->validate([
                'email' => [
                    'required',
                    'email',
                    Rule::unique('faculty')->ignore(Auth()->guard('faculty')->user()->email, 'email'),
                ],
                'phone'=> [
                    'required',
                    'regex:/^\d{3}-\d{3}-\d{4}$/'
                ],
            ]);
            $request->user('faculty')->update([
                'email'=>$validated['email'],
                'phone'=>$validated['phone']
            ]);
            return response()->json(['success'=>'Your information has been saved']);
        }
        catch(ValidationException $e){
            return response()->json(['errors'=>$e->getMessage()]);
        }
        catch(\Exception $e){
            //\Log::error($e->getMessage());
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
    
    public function uploadProfilePic(Request $request)
    {
        try {
            $user = Auth::guard('faculty')->user();
    
            $validated = $request->validate([
                'profile_pic' => ['required', 'image', 'mimes:jpeg,png,jpg|max:2048'],
            ]);
    
            if ($user->profile_pic && Storage::exists('public/profile_pics/' . basename($user->profile_pic))) {
                Storage::delete('public/profile_pics/' . basename($user->profile_pic));
            }
    
            $file = $request->file('profile_pic');
            $fileName = $file->hashName() . '.' . $file->extension();
    
            // Save the original image to storage without resizing
            $saveImage = Storage::putFileAs('public/profile_pics', $file, $fileName);
    
            $user->profile_pic = $fileName;
            $savePfpToDb = $user->save();
    
            if (!$saveImage || !$savePfpToDb) {
                \Log::error(['Image Upload Errors: ', 'Unable to save picture, something went wrong']);
                return response()->json(['errors' => 'Unable to save picture, something went wrong']);
            }
    
            return response()->json(['success' => 'Image uploaded successfully']);
        } catch (\Exception $e) {
            \Log::error(['Exception Caught: ' . $e->getMessage()]);
            return response()->json(['errors' => $e->getMessage()]);
        }
    }


}

?>