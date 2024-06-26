<?php

namespace App\Http\Controllers\Faculty;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Validator;

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
                    'regex:/^\(\d{3}\) \d{3}-\d{4}$/',
                    Rule::unique('faculty')->ignore(Auth()->guard('faculty')->user()->phone, 'phone'),
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
    
            // Strip Exif data
            $this->stripExifData(storage_path('app/'.$saveImage));
    
            $user->profile_pic = $fileName;
            $savePfpToDb = $user->save();
    
            if (!$saveImage || !$savePfpToDb) {
                \Log::error(['Image Upload Errors: ', 'Unable to save picture, something went wrong']);
                return response()->json(['errors' => 'Unable to save picture, something went wrong']);
            }
    
            return response()->json(['success' => 'Image uploaded successfully']);
        } 
        catch(ValidationException $validationException){
            return response()->json(['errors' => $validationException->errors()]);
        }
        catch (\Exception $e) {
            \Log::error(['Exception Caught: ' . $e->getMessage()]);
            return response()->json(['errors' => $e->getMessage()]);
        }
    }


    public function uploadWallpaperPic(Request $request)
    {
        try {
            $user = Auth::guard('faculty')->user();
    
            $validated = $request->validate([
                'wallpaper_pic' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,avif|max:2048'],
            ]);
    
            if ($user->wallpaper_pic && Storage::exists('public/wallpaper_pics/' . basename($user->wallpaper_pic))) {
                Storage::delete('public/wallpaper_pics/' . basename($user->wallpaper_pic));
            }
    
            $file = $request->file('wallpaper_pic');
            $fileName = $file->hashName() . '.' . $file->extension();
    
            // Save the original image to storage without resizing
            $saveWallpaper = Storage::putFileAs('public/wallpaper_pics', $file, $fileName);
    
            // Strip Exif data
            $this->stripExifData(storage_path('app/'.$saveWallpaper));
    
            $user->wallpaper_pic = $fileName;
            $saveWallpaperDB = $user->save();
    
            if (!$saveWallpaper || !$saveWallpaperDB) {
                \Log::error(['Image Upload Errors: ', 'Unable to save picture, something went wrong']);
                return response()->json(['errors' => 'Unable to save picture, something went wrong']);
            }
    
            return response()->json(['success' => 'Image uploaded successfully']);
        } 
        catch(ValidationException $validationException){
            \Log::error(['Validation Exception Caught: ' . $validationException->getMessage()]);

            return response()->json(['errors' => $validationException->errors()]);
        }
        catch (\Exception $e) {
            \Log::error(['Exception Caught: ' . $e->getMessage()]);
            return response()->json(['errors' => $e->getMessage()]);
        }
    }

    public function removePfp()
    {
        try {
            $user = Auth::guard('faculty')->user();            
            // Get the path to the wallpaper file
            $pfpPath = $user->profile_pic;
        
            
            // Clear the wallpaper field in the database
            $user->profile_pic = '';
            $user->save();
            
            // Delete the wallpaper file from storage
            if ($pfpPath) {
                Storage::delete('public/profile_pics/' . basename($pfpPath));
            }
            
            return response()->json(['success' => 'Profile Picture Removed']);
        } catch (\Exception $e) {
            \Log::error('Error Removing profile pic: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong removing that profile pic']);
        }
    }
    

    public function removeWallpaper()
    {
        try {
            $user = Auth::guard('faculty')->user();            
            // Get the path to the wallpaper file
            $wallpaperPath = $user->wallpaper_pic;
        
            
            // Clear the wallpaper field in the database
            $user->wallpaper_pic = '';
            $user->save();
            
            // Delete the wallpaper file from storage
            if ($wallpaperPath) {
                Storage::delete('public/wallpaper_pics/' . basename($wallpaperPath));
            }
            
            return response()->json(['success' => 'Wallpaper removed']);
        } catch (\Exception $e) {
            \Log::error('Error Removing Wallpaper: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong removing that wallpaper']);
        }
    }
    
    private function stripExifData($filePath)
    {
        $supportedFileTypes = ['image/jpeg']; // Only process JPEG files for Exif data removal
        $fileMimeType = mime_content_type($filePath);
    
        if (!in_array($fileMimeType, $supportedFileTypes)) {
            // Skip exif stripping for unsupported file types
            return;
        }
    
        // Read Exif data
        $exifBefore = exif_read_data($filePath);
    
        // Remove specific Exif sections containing metadata
        if ($fileMimeType === 'image/jpeg' && $exifBefore !== false) {
            // List of known Exif sections containing metadata to be removed
            $exifSectionsToRemove = ['COMMENT', 'GPS', 'MakerNote', 'IFD0'];
    
            foreach ($exifSectionsToRemove as $section) {
                if (isset($exifBefore[$section])) {
                    unset($exifBefore[$section]);
                }
            }
    
            // Save the image without Exif data
            $image = imagecreatefromjpeg($filePath);
            imagejpeg($image, $filePath);
            imagedestroy($image);
        }
    
        // Read Exif data after stripping
        // $exifAfter = exif_read_data($filePath);
    
        // // Log Exif information before and after stripping
        // \Log::info(['Exif Before Stripping' => $exifBefore, 'Exif After Stripping' => $exifAfter]);
    }
    
    

}

?>