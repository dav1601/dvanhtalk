<?php

use Carbon\Carbon;
use App\Models\User;
use App\Models\Message;
use Mockery\Expectation;
use App\Events\SendMessage;
use App\Models\UserMessage;
use App\Events\QueueMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Intervention\Image\Facades\Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
Route::get('users', function () {
    Carbon::setLocale('vi');
    $seen = 0;
    $users = collect(User::all()->except(Auth::id()));
    $users = $users->each(function ($item) {
        return $item->offline_at = Carbon::create($item->offline_at)->diffForHumans();
    });
    return response()->json($users, 200);
});
Route::get('user/{id}', function ($id) {
    $user = User::where('id', $id)->firstOrFail();
    return response()->json($user, 200);
});
Route::get('messages/{to}', function ($to) {
    $messages =  UserMessage::with('message')->where(function ($q) use ($to) {
        $q->where('sd_id', '=', Auth::id())
            ->where('rcv_id', '=', $to);
    })->orWhere(function ($q) use ($to) {
        $q->where('sd_id', '=', $to)
            ->where('rcv_id', '=', Auth::id());
    })->get();
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
            $user_message->save();
            $user_message->message = $message;
            broadcast(new SendMessage($user_message))->toOthers();
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
