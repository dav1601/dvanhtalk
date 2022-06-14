<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Message;
use App\Events\SendMessage;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Laravel\Ui\Presets\React;
use App\Events\SendMessageGroup;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Groups\GroupsInterface;
use App\Repositories\Messages\MessagesInterface;
use stdClass;

class MessagesController extends Controller
{
    public function __construct(GroupsInterface $dav2_gr, MessagesInterface $dav2_msg)
    {
        $this->dav2_group = $dav2_gr;
        $this->dav2_messages = $dav2_msg;
    }
    // public function messenger_media(Request $request)
    // {
    //     // $validator = Validator::make($request->all(), [
    //     //     'thread_id' => 'required|numeric',
    //     //     'attachment_id' => 'required|numeric',
    //     //     'message_id' => 'required|numeric',
    //     //     'type' => 'required|numeric'
    //     // ]);
    //     // if ($validator->fails()) {
    //     //     return response()->json($validator->errors()->first(), 400);
    //     // }
    //     try {
    //         $rcv_id = $request->thread_id;
    //         $attachment_id = $request->attachment_id;
    //         $message_id = $request->message_id;
    //         $type = $request->type;
    //         $media =   UserMessage::where(function ($q) {
    //             $q->where('sd_id', '=', Auth::id())
    //                 ->where('rcv_id', '=', 2)
    //                 ->where('type', 0);
    //         })->orWhere(function ($q) {
    //             $q->where('sd_id', '=', 2)
    //                 ->where('rcv_id', '=', Auth::id())
    //                 ->where('type_msg', '=', 2)
    //                 ->where('type', 0);
    //         })->get();
    //         return $media;
    //         $arrayImage = array();
    //         foreach ($media as $msg) {
    //             $array = explode(",", $msg->message->message);
    //             foreach ($array as $key => $value) {
    //                 $arrayImage[] = ["url" => $value,  "index" => $key, "msg_id" => $msg->message->id];
    //             }
    //         }
    //         $start = collect($arrayImage)->filter(function ($item) use ($message_id, $attachment_id) {
    //             return $item['msg_id'] == $message_id && $item['index'] == $attachment_id;
    //         });
    //         foreach ($start as $key => $item) {
    //             $start = $key;
    //         }
    //         if (!$start) {
    //             $start = 0;
    //         }
    //         return response()->json(['arrayImage' => $arrayImage, 'start' => $start], 200);
    //     } catch (\Exception $e) {
    //         return response()->json($e->getMessage(), 500);
    //     }
    // }
    public function index($type, $conversationId, Request $request)
    {
        try {
            $type = $type;
            $item_page = 20;
            $end_page = 0;
            $arrayMessages = array();
            $page =  $request->has('page') && $request->page != null ? $request->page : 1;
            $limit = $page * $item_page;
            if ($type == 0) {
                $queryMsg = UserMessage::where(function ($q) use ($conversationId) {
                    $q->where('sd_id', '=', Auth::id())
                        ->where('rcv_id', '=', $conversationId)
                        ->where('type', 0);
                })->orWhere(function ($q) use ($conversationId) {
                    $q->where('sd_id', '=', $conversationId)
                        ->where('rcv_id', '=', Auth::id())
                        ->where('type', 0);
                });
                $count = $queryMsg->count();
                if ($limit >= $count) {
                    $end_page = 1;
                    $messages = $queryMsg->with('message')->get();
                } else {
                    $offset = $count - $limit;
                    $messages = $queryMsg->with('message')->offset($offset)->limit($limit)->get();
                }
                $messages->page = $page;
            } else {
                $queryMsg = UserMessage::with(['message', 'sender'])->where('rcv_group_id', $conversationId)->where('type', 1);
                $count = $queryMsg->count();
                if ($limit >= $count) {
                    $end_page = 1;
                    $messages = $queryMsg->get();
                } else {
                    $offset = $count - $limit;
                    $messages = $queryMsg->offset($offset)->limit($limit)->get();
                }
            }
            $messages = collect($messages)->groupBy('created_at');
            foreach ($messages as $key => $msg) {
                $obj = new stdClass();
                $obj->created_at = $key;
                $obj->messages = $msg;
                $arrayMessages[] = $obj;
                unset($obj);
            }
            $messages->arrayMessages = $arrayMessages;
            $messenger_media = $this->dav2_messages->getAllMessageMedia($conversationId, $type);
            return response()->json(['data' => $messages->arrayMessages,   'page' => $page, 'endPage' => $end_page, 'messenger_media' => $messenger_media,], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function store(Request $request)
    {
        $created_time = $this->dav2_messages->created_at();
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
        $message->created_at =  $created_time;
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
                $user_message->created_at = $created_time;
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
                    $user_message_images->created_at = $created_time;
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
    }
}
