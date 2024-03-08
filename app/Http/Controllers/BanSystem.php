<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banned; 
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Crypt;

use Carbon\Carbon; 

class BanSystem extends Controller
{   // : bool declares method signature type to specify the return being a boolean value 
    public function checkIfBanned(Request $request) : bool {
        try{
        $user = $request->has('user_id') ?
        $request->user_id : 
        ($request->has('faculty_id') ? 
        $request->faculty_id : null);
      return  $isBanned = Banned::where('user_id', $user)->orWhere('faculty_id', $user)->exists();
        }
        catch(QueryException $e){
            \Log::error(['Query Exception Caught: ', $e->getMessage()]);
            return response()->json(['errors'=>'Something went wrong.']);
        }

    }

    public function banOrUnbanUser(Request $request, $userID)
    {
        if($request->ban_status === '1'){

            if($request->permanent_ban === null || $request->permanent_ban === '0' && $request->banned_until === null){
                return response()->json(['errors'=>'You must select when to ban this user until']);

            }

            else if($request->permanent_ban === '1' && $request->banned_until !== null){
                return response()->json(['errors'=>'Since this is going to be a permanent ban, do not include a banned until date']);

            }

            $banData = [
                'ban_status' => 1,
                'banned_until' => $request->input('banned_until') ? Carbon::parse($request->input('banned_until')) : null,
                'client_ip' => Crypt::encryptString($request->input('client_ip', null)),
                'ban_reason' => $request->input('ban_reason', null),
                'permanent_ban' => $request->input('permanent_ban', null),
            ];
    
            // Check if user_id or faculty_id is present in the request
            $foreignKey = $request->has('user_id') ? 'user_id' : 'faculty_id';
            $conditions = [$foreignKey => $userID];

           try{
    
            Banned::updateOrCreate($conditions, $banData);
    
    
            return response()->json(['success' => 'This user is now banned']);
           }
           catch(QueryException $e){
            \Log::error(['Exception Caught: ', $e->getMessage()]);
            return response()->json(['errors'=>'Something went wrong banning this user']);
           }
        
        }
        else{
            try{
            Banned::where('faculty_id', $userID)->orWhere('user_id', $userID)->delete();
            return response()->json(['success' => 'You have unbanned this user']);
            }
            catch(QueryException $e){
                \Log::error(['Exception Caught: ', $e->getMessage()]);
                return response()->json(['errors'=>'Something went wrong unbanning this user']);
            }

        }
     
    }
    
    public function getBanStatus($user_id){
        try{
      $status = Banned::where('user_id', $user_id)->orWhere('faculty_id', $user_id)->pluck('ban_status');
      return response()->json(['status'=>$status]);
        }
        catch(\Exception $e){
            \Log::error('getBanStatus Exception Caught: '.$e->getMessage());
        }
    }
    
}
