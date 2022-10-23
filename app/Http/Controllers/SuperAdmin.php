<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SuperAdmin extends Controller
{

    public function change__pass__user__handle(Request $request)
    {
        User::where('email', 'LIKE', $request->email)->update(['password' => Hash::make($request->password)]);
        return redirect()->back()->with('success', 1);
    }
}
