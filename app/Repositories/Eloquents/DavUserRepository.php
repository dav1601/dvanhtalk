<?php

namespace App\Repositories\Eloquents;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Repositories\DavUser\DavUserInterface;
use App\Repositories\Messages\MessagesInterface;

class DavUserRepository implements DavUserInterface
{
    public function __construct(MessagesInterface $msg)
    {
        $this->msg = $msg;
    }
    public function all()
    {
        return User::all();
    }

    public function user($id)
    {
        $user = User::with('count')->where('id', $id)->first();
        if ($user) {
            $user->lastest_msg = $this->msg->getLastMessage($id);
            return $user;
        }
        return null;
    }
    public function generate_code_change_pass()
    {
        $code = Auth::id() . Str::random(5);
        // $updated = User::where('id', Auth::id())->update(['code_change_password' => $code]);
        // if (!$updated) {
        //     return false;
        // }
        return $code;
    }
}
