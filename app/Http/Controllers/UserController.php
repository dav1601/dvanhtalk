<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\UserMessage;
use App\Repositories\DavUser\DavUserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Groups\GroupsInterface;
use App\Repositories\Messages\MessagesInterface;

class UserController extends Controller
{
    public function __construct(GroupsInterface $dav2_gr, MessagesInterface $dav2_msg, DavUserInterface $dav2_user)
    {
        $this->dav2_gr = $dav2_gr;
        $this->dav2_msg = $dav2_msg;
        $this->dav2_user = $dav2_user;
    }
    public function index(Request $request)
    {
        Carbon::setLocale('vi');
        $seen = 0;
        $endUsers = [];
        $query = User::with('count')->when($request->has('keyword'), function ($q) {
            return $q->where('name', 'LIKE', '%' . request('keyword', '') . '%');
        })->get()->except(Auth::id());
        $users = collect($query);
        $users = $users->each(function ($item) {
            $item->offline_at = Carbon::create($item->offline_at)->diffForHumans();
            $id = $item->id;
            $item->lastest_msg = UserMessage::with('message')->where(function ($q) use ($id) {
                $q->where('sd_id', '=', Auth::id())
                    ->where('rcv_id', '=', $id)
                    ->where('type', 0);
            })->orWhere(function ($q) use ($id) {
                $q->where('sd_id', '=', $id)
                    ->where('rcv_id', '=', Auth::id())
                    ->where('type', 0);
            })->latest()->take(1)->first();
            return $item;
        });
        $sort1 = $users->filter(function ($item, $key) {
            return $item->lastest_msg === null;
        });
        $sort2 = $users->filter(function ($item, $key) {
            return $item->lastest_msg !== null;
        });
        $sort2 = $sort2->sort(function ($a, $b) {
            if ($a->lastest_msg->created_at === $b->lastest_msg->created_at) {
                return 0;
            }
            return ($a->lastest_msg->created_at < $b->lastest_msg->created_at) ? 1 : -1;
        });
        $users = $sort2->merge($sort1);
        return response()->json($users, 200);
    }
    public function user($id, Request $request)
    {
        $user = $this->dav2_user->user($id);
        if ($user != null) {
            return response()->json($user, 200);
        }
        return response()->json("Lỗi xuất dữ liệu từ máy chủ", 500);
    }
    public function update()
    {
    }
}
