<?php

use App\Events\HandleRequest;
use App\Events\HandleUser;
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
use App\Events\SenRqJoinGr;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessagesController;
use App\Models\MembersGroup;
use App\Models\RequestJoinGroup;
use App\Repositories\Groups\GroupsInterface;
use App\Repositories\Messages\MessagesInterface;
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
Route::get('update', function (MessagesInterface $dav2_message) {
    $test =   UserMessage::where(function ($q) {
        $q->where('sd_id', '=', Auth::id())
            ->where('rcv_id', '=', 2)
            ->where('type_msg', '=', 2)
            ->where('type', 0);
    })->orWhere(function ($q) {
        $q->where('sd_id', '=', 2)
            ->where('rcv_id', '=', Auth::id())
            ->where('type_msg', '=', 2)
            ->where('type', 0);
    })->get();
    $arrayImage = array();
    foreach ($test as $msg) {
        $array = explode(",", $msg->message->message);
        foreach ($array as $key => $value) {
            $arrayImage[] = ["image" => $value, "index" => $key, "msg_id" => $msg->message->id];
        }
    }
    return response()->json($arrayImage);
});
Route::group(['middleware' => ['guest']], function () {
    Route::get('/register', 'DavAuthController@showRegister')->name('register.show');
    Route::post('/register', 'DavAuthController@register')->name('register.perform');
});
Route::group(['middleware' => ['auth']], function () {
    Route::get('/logout', 'DavAuthController@logout_perform')->name('logout.perform');
});
Route::get('users', function (Request $request) {
    Carbon::setLocale('vi');
    $seen = 0;
    $query = User::with('count')->when($request->has('keyword'), function ($q) {
        return $q->where('name', 'LIKE', '%' . request('keyword', '') . '%');
    })->get()->except(Auth::id());
    $users = collect($query);
    $users = $users->each(function ($item) {
        return $item->offline_at = Carbon::create($item->offline_at)->diffForHumans();
    });
    return response()->json($users, 200);
})->name('users');

Route::controller(GroupController::class)->group(function () {
    Route::get('groups', 'index')->name('group.list');
});
Route::controller(MessagesController::class)->group(function () {
    Route::get('messages/{type}/{conversationId}', 'index')->name('messages.index');
    Route::get('media', 'messenger_media')->name('messages.media');
});
Route::get('receiver/{id}', function ($id, Request $request, GroupsInterface $hle_gr) {
    if ($request->type == 0) {
        $receiver = User::where('id', $id)->firstOrFail();
    } else {
        $receiver = $hle_gr->group($id);
    }
    return response()->json(['receiver' => $receiver], 200);
})->name('get.receiver');
Route::post('saveMessage', function (Request $request) {
    $message = new Message();
    $message_images = new Message();
    $user_message = new UserMessage();
    $haveImages = $request->has('images') ? true : false;
    $haveMessageText = $request->message != null && $request->message != "" ? true : false;
    $parent_id = $request->parent_id == 'null' || $request->parent_id == null ? NULL : (int) $request->parent_id;
    if ($request->type == 1) {
        if ($haveMessageText && !$haveImages) {
            $message->message = $request->message;
            $message->type = 1;
        } elseif ($haveImages && !$haveMessageText) {
            $images = $request->images;
            $arrayImages = [];
            foreach ($images as $image) {
                $urlImgUploaded =  $image->storeOnCloudinary("user-" . $request->from)->getSecurePath();
                $arrayImages[] = $urlImgUploaded;
            }
            $message->message = implode(",", $arrayImages);
            $message->type = 2;
        } elseif ($haveImages && $haveMessageText) {
            $message->message = $request->message;
            $message->type = 1;
            $images = $request->images;
            $arrayImages = [];
            foreach ($images as $image) {
                $urlImgUploaded =  $image->storeOnCloudinary("user-" . $request->from)->getSecurePath();
                $arrayImages[] = $urlImgUploaded;
            }
            $message_images->message = implode(",", $arrayImages);
            $message_images->parent_id =  $parent_id;
            $message_images->type = 2;
        }
    }
    if ($request->type == 3) {
        $audio = $request->audio;
        $urlAudioUploaded =  $audio->storeOnCloudinary("user-" . $request->from)->getSecurePath();
        $message->message = $urlAudioUploaded;
        $message->type = 3;
    }
    $message->parent_id = $parent_id;
    if ($message->save()) {
        try {
            $user_message->msg_id = (int)$message->id;
            $user_message->sd_id = (int)$request->from;
            if ($request->for == 0) {
                $user_message->rcv_id = (int) $request->to;
            } else {
                $user_message->rcv_group_id = (int) $request->to;
            }
            $user_message->seen = (int) $request->seen;
            $user_message->type = $request->for;
            $user_message->type_msg = $message->type;
            $user_message->save();
            $user_message->message = $message;
            if ($haveMessageText && $haveImages) {
                $user_message_images = new UserMessage();
                $message_images->save();
                $user_message_images->msg_id = (int) $message_images->id;
                $user_message_images->sd_id = (int)$request->from;
                if ($request->for == 0) {
                    $user_message_images->rcv_id = (int) $request->to;
                } else {
                    $user_message_images->rcv_group_id = (int) $request->to;
                }
                $user_message_images->seen = (int) $request->seen;
                $user_message_images->type = $request->for;
                $user_message_images->type_msg = 2;
                $user_message_images->save();
                $user_message_images->message = $message_images;
                $user_message->message_images = $user_message_images;
            }
            if ($request->for == 0) {
                broadcast(new SendMessage($user_message))->toOthers();
            } else {
                $user_message->sender = User::where('id',  $user_message->sd_id)->first();
                broadcast(new SendMessageGroup($user_message))->toOthers();
            }
            return response()->json(['data' => $user_message], 200);
        } catch (\Exception $e) {
            $message->delete();
            $message_images->delete();
            return response()->json(['error' => $e->getMessage()]);
        }
    } else {
        $message->delete();
        return response()->json(['error' => "Lỗi lưu dữ liệu"], 500);
    }
});
Route::post('saveGroup', function (Request $request, GroupsInterface $hrl_gr) {
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
            MembersGroup::create(
                [
                    'users_id' => Auth::id(),
                    'groups_id' => $group->id,
                    'role' => 0
                ]
            );
            foreach ($rqMembers as $mem) {
                MembersGroup::create(
                    [
                        'users_id' => $mem->id,
                        'groups_id' => $group->id,
                        'role' => 2
                    ]
                );
            }
            $group = $hrl_gr->group($group->id);
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
Route::post('saveRequest', function (Request $request, GroupsInterface $hle_gr) {
    Carbon::setLocale('vi');
    $reqJG = new RequestJoinGroup();
    $reqJG->users_id = Auth::id();
    $reqJG->groups_id = $request->group_id;
    if ($reqJG->save()) {
        $reqJG = RequestJoinGroup::with(['sender', 'group'])->where('id', $reqJG->id)->firstOrFail();
        $reqJG->newestGr = $hle_gr->group($request->group_id);
        $mod = MembersGroup::where('role', 1)->where('groups_id', $reqJG->groups_id)->get();
        broadcast(new SenRqJoinGr($reqJG, $reqJG->group->users_id))->toOthers();
        if ($mod) {
            foreach ($mod as $member_mod) {
                broadcast(new SenRqJoinGr($reqJG, $member_mod->users_id))->toOthers();
            }
        }
        return response()->json(['data' => $reqJG], 200);
    } else {
        $reqJG->delete();
        return response()->json(['error' => "Lỗi lưu dữ liệu"], 500);
    }
});
Route::prefix('handle/')->group(function () {
    Route::prefix('group/')->group(function () {
        Route::post('request/join', function (Request $request, GroupsInterface $hle_gr) {
            $req = json_decode($request->req);
            $status = $request->status == 'approved' ? 1 : 2;
            $data = (object) [];
            $data->status = $status;
            $data->action = "joinGr";
            $message = new Message();
            $user_message = new UserMessage();
            $create_member = new MembersGroup();
            if ($status == 1) {
                $create_member->users_id = $req->users_id;
                $create_member->groups_id = $req->groups_id;
                $create_member->role = 2;
                if ($create_member->save()) {
                    $data->member = MembersGroup::with(['info'])->where('users_id', $req->users_id)->where('groups_id', $req->groups_id)->first();
                    $founder = Groups::where('id', $req->groups_id)->first()->users_id;
                    $message_system = $data->member->info->name . " đã được thêm vào nhóm";
                    $message->message = $message_system;
                    $message->type = 4;
                    if ($message->save()) {
                        $user_message->msg_id = (int)$message->id;
                        $user_message->sd_id = (int)$founder;
                        $user_message->rcv_group_id = (int) $req->groups_id;
                        $user_message->seen = 0;
                        $user_message->type = 1;
                        $user_message->type_msg = 4;
                        if ($user_message->save()) {
                            $user_message->message = $message;
                            $user_message->sender = User::where('id',  $user_message->sd_id)->first();
                            RequestJoinGroup::where('id', $req->id)->delete();
                            $req->newestGr = $hle_gr->group($req->groups_id);
                            $data->request = $req;
                            broadcast(new SendMessageGroup($user_message));
                            broadcast(new HandleRequest($data, 'group-chat-' . $req->groups_id));
                            broadcast(new HandleRequest($data, 'notify-' . $req->users_id));
                            return response()->json($data, 200);
                        } else {
                            $user_message->delete();
                            return response()->json(['error' => "save data user message"], 500);
                        }
                    } else {
                        $message->delete();
                        return response()->json(['error' => "save data message"], 500);
                    }
                } else {
                    $create_member->delete();
                    return response()->json(['error' => "save data member"], 500);
                }
            } else {
                RequestJoinGroup::where('id', $req->id)->delete();
                $req->newestGr = $hle_gr->group($req->groups_id);
                $data->request = $req;
                broadcast(new HandleRequest($data, 'group-chat-' . $req->groups_id));
                broadcast(new HandleRequest($data, 'notify-' . $req->users_id));
                return response()->json($data, 200);
            }
        })->name('handle.gr.req.join');
        // end handle request join group of user
        Route::post('request/actions', function (Request $request, GroupsInterface $hle_gr) {
            $data = (object) [];
            $data->action = $request->action;
            $data->group_action = "reqActions";
            $hasUsersId = $request->has('users_id') ? $request->has('users_id') : false;
            if ($hasUsersId) {
                $data->users_id = $request->users_id;
            }
            $data->groups_id = $request->groups_id;
            if ($request->action == "setMod") {
                $updated =  MembersGroup::where('users_id', $request->users_id)->where('groups_id', $request->groups_id)->update(['role' => 1]);
                if (!$updated) {
                    return response()->json(['error' => "Update that bai"], 500);
                }
                $data->role = 1;
            } else if ($request->action == "kick") {
                $deleted = MembersGroup::where('users_id', $request->users_id)->where('groups_id', $request->groups_id)->delete();
                if (!$deleted) {
                    return response()->json(['error' => "Update that bai"], 500);
                }
            } else if ($request->action == "removeMod") {
                $updated =  MembersGroup::where('users_id', $request->users_id)->where('groups_id', $request->groups_id)->update(['role' => 2]);
                if (!$updated) {
                    return response()->json(['error' => "Update that bai"], 500);
                }
                $data->role = 2;
            }
            $data->newestGr = $hle_gr->group($request->groups_id);
            broadcast(new HandleRequest($data, 'group-chat-' . $request->groups_id));
            if ($hasUsersId) {
                broadcast(new HandleRequest($data, 'notify-' . $request->users_id));
            }
            return response()->json($data, 200);
        })->name('handle.gr.req.actions');
        // end actions group add + remove mod + kick member
        Route::post('save/data', function (Request $request, GroupsInterface $hle_group) {
            $data = (object) [];
            $data->group_action = "reqSaveData";
            $data->groups_id = (int) $request->groups_id;
            $rqMembers = array();
            if (Groups::where('id', '!=', $request->groups_id)->where('name', 'LIKE', $request->name)->first()) {
                return response()->json(['exist' => true], 400);
            }
            Groups::where('id',  $request->groups_id)->update(['name' => $request->name]);
            try {
                if (!empty($request->members)) {
                    foreach ($request->members as $member) {
                        $rqMembers[] = json_decode($member);
                    }
                }
                if (!empty($rqMembers)) {
                    foreach ($rqMembers as $mem) {
                        MembersGroup::create([
                            'users_id' => $mem->id,
                            'groups_id' => $request->groups_id,
                            'role' => 2,
                        ]);
                    }
                }
                $newestGroup = $hle_group->group($request->groups_id);
                $data->newestGr = $newestGroup;
                foreach ($newestGroup->members as $notify) {
                    broadcast(new HandleRequest($data, 'notify-' . $notify->users_id));
                }
                broadcast(new HandleRequest($data, 'group-chat-' . $request->groups_id));
                return response()->json($data, 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        })->name('handle.gr.req.saveData');
    });
});
Route::get('update_offline/{id}', function ($id) {
    try {
        $updated = User::where('id', $id)->update([
            'offline_at' => Carbon::now()
        ]);
        $user = User::where('id',  $id)->first();
        $user->offline_at = Carbon::create($user->offline_at)->diffForHumans();
        return response()->json($user);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
})->name('update.offline');
Route::post('update_seen', function (Request $request) {
    try {
        $updated = UserMessage::where('sd_id', $request->receiver)->where('rcv_id', Auth::id())->where('seen', false)->update(['seen' => true]);
        return response()->json(['update_seen' => true], 200);
    } catch (\Exception $e) {
        return response()->json(['errors' => $e->getMessage()]);
    }
});
Route::get('/{any}', 'AppController@index')->where('any', '.*')->middleware('auth');
