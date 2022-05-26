<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Events\Lobby;
use App\Helpers\DavClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::check()) {
            User::where('id', Auth::id())->update(['logged_in' => $request->ip()]);
        }
        return view('app');
    }
}
