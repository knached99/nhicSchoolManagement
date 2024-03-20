<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\BanSystem;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;

class BanMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
   


     public function handle(Request $request, Closure $next)
     {
         // Check if the requested route is '/banned'
         if ($request->is('banned')) {

             return $next($request); // Skip redirection for /banned route
         }
 
         $banSystem = new BanSystem();
         $clientIP = $request->ip();

         $blocked = $banSystem->isBlocked($clientIP);

 
         $banMessage = $banSystem->isBanned($clientIP);

         if ($banMessage) {
             return redirect('/banned?message='.Crypt::encryptString($banMessage));
         }

         if($blocked){
            return redirect('/banned');
         }
 
         return $next($request);
     }

}
