<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Events\Lobby;
use App\Events\NewUser;
use App\Models\Message;
use App\Helpers\DavClient;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Messages\MessagesInterface;


class AppController extends Controller
{
    public function index(Request $request)
    {
        // if (Session::has('successReg')) {
        //     broadcast(new NewUser(Auth::user()));
        // }
        // if (Auth::check()) {
        //     User::where('id', Auth::id())->update(['logged_in' => $request->ip()]);
        // }

        return view('app');
    }
    ////////////////////////////////////////

    public function test(Request $request)
    {
        $avatar = $request->file('avatar');
        $ext = $avatar->extension();
        $foder = "avatar/user";
    }
    ////////////////////////////////////////

    public function testview(Request $request, MessagesInterface $m)
    {
        try {
            $user_message = $m->store_message(27, "test 2", 1, NULL, 0, 0, Carbon::now());
            // $for = 0;
            // $user_message = new UserMessage();
            // $user_message->msg_id = (int) 1343;
            // $user_message->sd_id = (int) Auth::id();
            // if ($for == 0) {
            //     $user_message->rcv_id = (int) 27;
            // } else {
            //     $user_message->rcv_group_id = (int) 27;
            // }
            // $user_message->reply_msg_id = NULL;
            // $user_message->seen = (int) 0;
            // $user_message->type = $for;
            // $user_message->type_msg =  1;
            // $user_message->created_at =  Carbon::now();
            // $user_message->save();
            // $setupRelation = ["message", "message_parent"];
            // if ($for == 1) {
            //     $setupRelation[] = "sender";
            // }
            // $user_message->load($setupRelation);
            dd($user_message);
        } catch (\Exception $e) {
            return $e;
        }
    }

    ////////////////////////////////////////
    ////////////////////////////////////////
}
