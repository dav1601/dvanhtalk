<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Events\NewUser;
use App\Events\HandleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class DavAuthController extends Controller
{
    public function showRegister()
    {
        return view('auth.register');
    }
    public function register(Request $request)
    {
        $valid =  Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if ($valid->fails()) {
            return redirect()->back()->withInput()->withErrors($valid);
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $credentials['email'] = $user->email;
        $credentials['password'] = $request->password;
        if (Auth::attempt($credentials)) {
            return redirect()->route('home')->with('successReg', true);
        } else {
            return redirect()->back()->with('login_fail', true);
        }
    }
    public function logout_perform()
    {
        broadcast(new HandleUser("lobby", Auth::user(), "user.loggout"))->toOthers();
        Session::flush();
        Auth::logout();
        return redirect()->route('login');
    }
}
