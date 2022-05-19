<?php

use Carbon\Carbon;
use App\Models\User;
use App\Events\Lobby;
use App\Events\NewGroup;
use App\Models\Groups;
use App\Models\Message;
use Mockery\Expectation;
use App\Events\SendMessage;
use App\Models\UserMessage;
use App\Events\QueueMessage;
use App\Events\SendMessageGroup;
use App\Models\MembersGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Intervention\Image\Facades\Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use PHPUnit\TextUI\XmlConfiguration\Group;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();
Route::get('/', 'AppController@index')->middleware('auth')->name('home');
Route::get('me', function () {
    return response()->json(['me' => Auth::user()]);
});

Route::get('message_unseen', function (Request $request) {
    $count = UserMessage::where('seen', false)->where('rcv_id', Auth::id())->where('sd_id', $request->sd_id)->count();
    return response()->json(['count' => $count], 200);
});
Route::get('users', function (Request $request) {
    Carbon::setLocale('vi');
    $seen = 0;
    $query = User::when($request->has('keyword'), function ($q) {
        return $q->where('name', 'LIKE', '%' . request('keyword', '') . '%');
    })->get()->except(Auth::id());
    $users = collect($query);
    $users = $users->each(function ($item) {
        return $item->offline_at = Carbon::create($item->offline_at)->diffForHumans();
    });
    return response()->json($users, 200);
});
Route::get('fake_data', function () {
    $message = new Message();
    $user_message = new UserMessage();
    $message->message = "fake 1";
    $message->parent_id = NULL;
    $message->type = (int) 1;
    if ($message->save()) {
        try {
            $user_message->msg_id = (int)$message->id;
            $user_message->sd_id = (int) 12;
            $user_message->rcv_id = (int) 4;
            $user_message->seen = (int) 1;
            $user_message->type = 1;
            $user_message->save();
            return response()->json(['data' => $user_message], 200);
        } catch (\Exception $e) {
            $message->delete();
            return response()->json(['error' => $e->getMessage()]);
        }
    } else {
        $message->delete();
        return response()->json(['error' => "Lỗi lưu dữ liệu"], 500);
    }
});
Route::get('groups', function (Request $request) {
    $groups = Groups::with(['members', 'founder', 'requestsJoin', 'members.info'])->when($request->has('keyword'), function ($q) {
        return $q->where('name', 'LIKE', '%' . request('keyword', '') . '%');
    })->get();
    $my_groups = Groups::with(['members', 'founder', 'requestsJoin', 'members.info'])->where('users_id', Auth::id())->get();
    return response()->json(['groups' => $groups, 'my_groups' => $my_groups], 200);
});

Route::get('user/{id}', function ($id, Request $request) {
    if ($request->type == 0) {
        $user = User::where('id', $id)->firstOrFail();
    } else {
        $user = Groups::with(['members', 'founder', 'requestsJoin', 'members.info'])->where('id', $id)->firstOrFail();
    }
    return response()->json($user, 200);
});
Route::get('messages/{to}', function ($to, Request $request) {
    $type = $request->type;
    if ($type == 0) {
        $messages =  UserMessage::with('message')->where(function ($q) use ($to) {
            $q->where('sd_id', '=', Auth::id())
                ->where('rcv_id', '=', $to)
                ->where('type', '=', 0);
        })->orWhere(function ($q) use ($to, $type) {
            $q->where('sd_id', '=', $to)
                ->where('rcv_id', '=', Auth::id())
                ->where('type', '=', 0);
        })->get();
    } else {
        $messages = UserMessage::with(['message', 'sender'])->where('rcv_id', $to)->where('type', '=', 1)->get();
    }
    return response()->json(['data' => $messages], 200);
});
Route::post('saveMessage', function (Request $request) {
    $message = new Message();
    $user_message = new UserMessage();
    if ($request->type == 2) {
        $file = $request->file;
        $urlImgUploaded =  $file->storeOnCloudinary("user-" . $request->from)->getSecurePath();
        $message->message = $urlImgUploaded;
    } elseif ($request->type == 1) {
        $message->message = $request->message;
    } elseif ($request->type == 3) {
        $audio = $request->audio;
        $urlAudioUploaded =  $audio->storeOnCloudinary("user-" . $request->from)->getSecurePath();
        $message->message = $urlAudioUploaded;
    }
    if ($request->parent_id == 'null' || $request->parent_id == null) {
        $request->parent_id = NULL;
    } else {
        $message->parent_id = (int) $request->parent_id;
    }

    $message->type = (int) $request->type;
    if ($message->save()) {
        try {
            $user_message->msg_id = (int)$message->id;
            $user_message->sd_id = (int)$request->from;
            $user_message->rcv_id = (int) $request->to;
            $user_message->seen = (int) $request->seen;
            $user_message->type = $request->for;
            $user_message->save();
            $user_message->message = $message;
            if ($request->for == 0) {
                broadcast(new SendMessage($user_message))->toOthers();
            } else {
                $user_message->sender = User::where('id',  $user_message->sd_id)->first();
                broadcast(new SendMessageGroup($user_message))->toOthers();
            }
            return response()->json(['data' => $user_message], 200);
        } catch (\Exception $e) {
            $message->delete();
            return response()->json(['error' => $e->getMessage()]);
        }
    } else {
        $message->delete();
        return response()->json(['error' => "Lỗi lưu dữ liệu"], 500);
    }
});
Route::post('saveGroup', function (Request $request) {
    $rqMembers = array();
    if (!empty($request->members)) {
        foreach ($request->members as $member) {
            $rqMembers[] = json_decode($member);
        }
    }
    $group = new Groups();
    $members = new MembersGroup();
    $listMembers = $rqMembers;
    $group->name = $request->name;
    $imageGroup = $request->file;
    $urlImgUploaded =  $imageGroup->storeOnCloudinary("user-group-" . Auth::id())->getSecurePath();
    $group->group_image = $urlImgUploaded;
    $group->users_id = Auth::id();
    if ($group->save()) {
        try {
            foreach ($rqMembers as $mem) {
                MembersGroup::create(
                    [
                        'users_id' => $mem->id,
                        'groups_id' => $group->id,
                        'role' => 2
                    ]
                );
            }
            broadcast(new NewGroup($group))->toOthers();
            return response()->json(['data' => $group], 200);
        } catch (\Exception $e) {
            $group->delete();
            return response()->json(['error' => $e->getMessage()]);
        }
    } else {
        $group->delete();
        return response()->json(['error' => "Lỗi lưu dữ liệu"], 500);
    }
});
Route::get('update_offline/{id}', function ($id) {
    try {
        $updated = User::where('id', $id)->update([
            'offline_at' => Carbon::now()
        ]);

        return response()->json(['offline' => true], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});
Route::post('update_seen', function (Request $request) {
    try {
        $updated = UserMessage::where('sd_id', $request->receiver)->where('rcv_id', Auth::id())->where('seen', false)->update(['seen' => true]);
        return response()->json(['update_seen' => true], 200);
    } catch (\Exception $e) {
        return response()->json(['errors' => $e->getMessage()]);
    }
});
Route::get('/{any}', 'AppController@index')->where('any', '.*')->middleware('auth');
