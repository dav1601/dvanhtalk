<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Mail\SendCodeOtp;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Groups\GroupsInterface;
use App\Repositories\DavUser\DavUserInterface;
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
        $users = $users->map(function ($item) {
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
    public function simple__user($id)
    {
        $user = User::where('id', $id)->first();
        return response()->json($user);
    }
    public function send__otp(Request $request)
    {
        try {
            $arrayRules['email'] = 'required|string|email';
            $array__invalid['email.required'] = text__err__request("Email", "required");
            $array__invalid['email.string'] = text__err__request("Email", "string");
            $array__invalid['email.email'] = text__err__request("Email", "email");
            $validator = Validator::make(
                $request->all(),
                $arrayRules,
                $array__invalid
            );
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->first()], 500);
            }
            if (!User::where('email', 'LIKE', $request->email)->first()) {
                return response()->json(['error' => "Email không tồn tại vui lòng thử lại"], 500);
            }

            $code = $this->dav2_user->generate_code_change_pass();
            $data = [
                "code" => $code
            ];
            Mail::to($request->email)->send(new SendCodeOtp($data));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json(['code' => $code, 'fail' => false], 200);
    }
    public function change__password(Request $request)
    {
        try {
            $arrayRules['password'] = 'required|string|min:8|confirmed';
            $array__invalid['password.required'] = text__err__request("Mật khẩu", "required");
            $array__invalid['password.string'] = text__err__request("Mật khẩu", "string");
            $array__invalid['password.min'] = text__err__request("Mật khẩu", "min", "8");
            $validator = Validator::make(
                $request->all(),
                $arrayRules,
                $array__invalid
            );
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->first()], 500);
            }
            if ($request->type == 1) {
                $old_pass = $request->old_password;
                $current_password = User::where('id', Auth::id())->first()->password;
                if (!Hash::check($old_pass, $current_password)) {
                    return response()->json(['error' => "Mật khẩu cũ không chính xác vui lòng thử lại"], 500);
                }
            }
            if ($request->type == 2) {
                User::where('email', 'LIKE', $request->email)->update(['password' => Hash::make($request->password)]);
            } else {
                User::where('id', Auth::id())->update(['password' => Hash::make($request->password)]);
            }
            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
