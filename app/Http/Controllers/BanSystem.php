<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banned; 
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

use Carbon\Carbon; 

class BanSystem extends Controller
{  
  
    public function blockIP($client_ip){
        try{
            Banned::create($client_ip);
            return response()->json(['success'=>'IP '.$client_ip.' is now blocked']);
        }
        catch(\Exception $e){
            return response()->json(['errors'=>'Unable to block IP '.$client_ip]);
            \Log::critical(['Unable to block IP', $e->getMessage()]);
        }
    }

    public function isBanned($clientIP)
    {
        $banMessages = ''; // Initialize an empty string to accumulate ban messages
    
        $bannedIPs = Banned::all();
        foreach ($bannedIPs as $bannedIP) {
            $decryptedDBIP = Crypt::decryptString($bannedIP->client_ip);
            if ($decryptedDBIP === $clientIP && $bannedIP->ban_status === 1) {
                $banReason = isset($bannedIP->ban_reason) ? $bannedIP->ban_reason : null;
                if ($bannedIP->permanent_ban === 1) {
                    $banMessages .= "You are permanently banned";
                } else {
                    $bannedUntil = isset($bannedIP->banned_until) ? Carbon::parse($bannedIP->banned_until)->format('l, F jS, Y') : null;
                    $banMessages .= $bannedUntil ? "You are banned until $bannedUntil." : '';
                }
                if ($banReason) {
                    $banMessages .= " The reason for the ban: $banReason";
                }
            }
        }
    
        // Check if any ban messages were accumulated
        if (!empty($banMessages)) {
            return $banMessages; // Return accumulated ban messages
        }
    
        return null; // Return null if no ban messages were found
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

    // Display this page to banned users 

    public function banView(Request $request)
    {
        // Retrieve the encrypted message from the URL query parameter
        $encryptedMessage = $request->query('message');
    
        // Decrypt the message
        $bannedMessage = $encryptedMessage ? Crypt::decryptString($encryptedMessage) : null;
    
        // Pass the message to the view
        return Inertia::render('Banned', [
            'message' => $bannedMessage
        ]);
    }
    
    
}
