<?php

namespace App\Http\Controllers;

use App\Models\UserMessage;
use Illuminate\Http\Request;
use Laravel\Ui\Presets\React;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Groups\GroupsInterface;
use App\Repositories\Messages\MessagesInterface;

class MessagesController extends Controller
{
    public function __construct(GroupsInterface $dav2_gr, MessagesInterface $dav2_msg)
    {
        $this->dav2_group = $dav2_gr;
        $this->dav2_messages = $dav2_msg;
    }
    public function messenger_media(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'thread_id' => 'required|numeric',
            'attachment_id' => 'required|numeric',
            'message_id' => 'required|numeric',
            'type' => 'required|numeric'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->first(), 400);
        }
        try {
            $rcv_id = $request->thread_id;
            $attachment_id = $request->attachment_id;
            $message_id = $request->message_id;
            $type = $request->type;
            $media =   UserMessage::where(function ($q) use ($rcv_id, $type) {
                $q->where('sd_id', '=', Auth::id())
                    ->where('rcv_id', '=', $rcv_id)
                    ->where('type_msg', '=', 2)
                    ->where('type', $type);
            })->orWhere(function ($q) use ($rcv_id, $type) {
                $q->where('sd_id', '=', $rcv_id)
                    ->where('rcv_id', '=', Auth::id())
                    ->where('type_msg', '=', 2)
                    ->where('type', $type);
            })->get();
            $arrayImage = array();
            foreach ($media as $msg) {
                $array = explode(",", $msg->message->message);
                foreach ($array as $key => $value) {
                    $arrayImage[] = ["url" => $value,  "index" => $key, "msg_id" => $msg->message->id];
                }
            }
            $start = collect($arrayImage)->filter(function ($item) use ($message_id, $attachment_id) {
                return $item['msg_id'] == $message_id && $item['index'] == $attachment_id;
            });
            foreach ($start as $key => $item) {
                $start = $key;
            }
            if (!$start) {
                $start = 0;
            }
            return response()->json(['arrayImage' => $arrayImage, 'start' => $start], 200);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }
    public function index($type, $conversationId, Request $request)
    {
        try {
            $type = $type;
            $item_page = 20;
            $end_page = 0;
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
            $messenger_media = $this->dav2_messages->getAllMessageMedia($conversationId, $type);
            return response()->json(['data' => $messages,   'page' => $page, 'endPage' => $end_page, 'messenger_media' => $messenger_media], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
