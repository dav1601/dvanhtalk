<?php

namespace App\Http\Controllers;

use App\Events\Lobby;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    public function index()
    {
        $me = Auth::user();
        broadcast(new Lobby);
        return view('app', compact('me'));
    }
}
