<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAuth extends Controller
{
    public function viewLogin(){
        return Inertia::render('Admin/Login');
    }
}
