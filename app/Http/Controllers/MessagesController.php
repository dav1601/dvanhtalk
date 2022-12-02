<?php

namespace App\Http\Controllers;

use stdClass;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Message;
use App\Models\CallInfor;
use App\Events\CustomEvent;
use App\Events\SendMessage;
use App\Models\UserMessage;
use App\Models\RoomCallChat;
use Illuminate\Http\Request;
use Laravel\Ui\Presets\React;
use App\Models\ReactionMessage;
use App\Events\SendMessageGroup;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Storage;
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
    public function index($type, $conversationId, Request $request)
    {
        try {
            $type = $type;
            $item_page = 20;
            $end_page = 0;
            $messenger_media = [];
            $arrayMessages = array();
            $page =  $request->has('page') && $request->page != null ? $request->page : 1;
            $msg_id = $request->has('msg_id') ? (int) $request->msg_id : NULL;
            $setupRelation = ['message', 'message_parent', 'message.reaction', 'message.reaction.user', 'call_info'];
            if ($msg_id != NULL) {
                $countMsg =  UserMessage::where('msg_id', '>=', $msg_id)->count();
                $page = (int) ceil($countMsg / $item_page);
            }
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
                })->with($setupRelation);
                $count = $queryMsg->count();
                if ($limit >= $count) {
                    $end_page = true;
                    $messages = $queryMsg->get();
                } else {
                    $offset = $count - $limit;
                    $messages = $queryMsg->offset($offset)->limit($limit)->get();
                }
                $messages->page = $page;
            } else {
                $setupRelation[] = "sender";
                $queryMsg = UserMessage::with($setupRelation)->where('rcv_group_id', $conversationId)->where('type', 1);
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
                $msg->map(function ($item, $key) {
                    return collect($item->message->reaction)->groupBy('reaction');
                });
                $obj->messages = $msg;
                $arrayMessages[] = $obj;
                unset($obj);
            }
            $messages->arrayMessages = $arrayMessages;
            $messenger_media = $this->dav2_messages->getAllMessageMedia($conversationId, $type);
            return response()->json(['data' => $messages->arrayMessages,   'page' => $page, 'endPage' => $end_page, 'messenger_media' => $messenger_media, 'msg_id' => $msg_id], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function store(Request $request, MessagesInterface $vamsg)
    {
        $user_message = new UserMessage();
        $created_time = $vamsg->created_at();
        $message = $request->message ? $request->message : "";
        $rcv_id = (int) $request->to;
        $for = (int) $request->for;
        $seen = $request->has('seen') ? $request->seen : 0;
        $parent_id = (int) $request->parent_id == 0 ? NULL : (int) $request->parent_id;
        $type_msg = $request->type_msg ? $request->type_msg : 0;
        $user_message = $vamsg->store_message($rcv_id, $message, $type_msg, $parent_id, $seen, $for, $created_time);
        if ($user_message) {
            try {
                if ($for == 0) {
                    broadcast(new SendMessage($user_message))->toOthers();
                } else {
                    broadcast(new SendMessageGroup($user_message))->toOthers();
                }
                return response()->json(['payload' => $user_message], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => "Gửi tin nhắn thất bại bạn vui lòng gửi lại"], 500);
        }
    }
    public function storeReaction(Request $request)
    {
        $action = $request->action;
        $type = $request->type;
        $rcv_id = $request->rcvId;
        $reactionIcon = $request->has('reaction') ? $request->reaction : null;
        $msg_id = $request->msgId;
        $reaction = new ReactionMessage();
        try {
            if ($action == "store") {
                $reaction->reaction = $reactionIcon;
                $reaction->users_id = Auth::id();
                $reaction->message_id = $msg_id;
                $existReaction = ReactionMessage::with('user')->where('message_id', $msg_id)->where('users_id', Auth::id())->first();
                if (!$existReaction) {
                    $existReaction = $reaction->save();
                } else {
                    ReactionMessage::where('message_id', $msg_id)->where('users_id', Auth::id())->update(['reaction' => $reactionIcon]);
                }
            }
            if ($action == "delete") {
                ReactionMessage::where('message_id', $msg_id)->where('users_id', Auth::id())->delete();
            }
            $data = new stdClass();
            $data->action = $action;
            $data->message = $this->dav2_messages->getUserMessage($msg_id, $type);
            $data->created_at =  $this->dav2_messages->format_created_at($data->message->created_at);
            $event = "reaction.message";
            if ($type == 0) {
                $channel = "chat-" . $rcv_id;
            } else {
                $channel = "group-chat-" . $rcv_id;
            }
            broadcast(new CustomEvent($data, $event, $channel))->toOthers();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function message_delete_reaction(Request $request)
    {
        $type = $request->type;
        $rcv_id = $request->rcvId;
        $msg_id = $request->msgId;
        $deleted = ReactionMessage::where('message_id', $msg_id)->where('users_id', Auth::id())->delete();
        if ($deleted) {
            $data = new stdClass();
            $data->message = UserMessage::with(['message', 'message_parent', 'message.reaction', 'message.reaction.user'])->where('msg_id', $msg_id)->first();
            $data->created_at =  $this->dav2_messages->format_created_at($data->message->created_at);
            $data->reaction = ReactionMessage::with('user')->where('message_id', $msg_id)->get();
            $event = "reaction.message.delete";
            if ($type == 0) {
                $channel = "chat-" . $rcv_id;
            } else {
                $channel = "group-chat-" . $rcv_id;
            }
            broadcast(new CustomEvent($data, $event, $channel))->toOthers();
            return response()->json($data);
        }
        return response()->json(['error' => "Gỡ cảm xúc thất bại"], 500);
    }
    public function store__message__call(Request $request)
    {
        $process = $request->process;
        $status = $request->status;
        $duration = $request->duration;
        $rcv = $request->receiverId;
        $for = $request->for;
        $message = $request->hasVideo ? "Cuộc gọi video" : "Cuộc gọi thoại";
        $call_info = new CallInfor();
        $user_message = $this->dav2_messages->store_message($rcv, $message, 5, null, 1, $for, null);
        if (!$user_message) {
            return response()->json(['error' => "Lưu tin nhắn cuộc gọi thất bại"], 500);
        }
        try {
            $call_info->user_message_id = $user_message->id;
            $call_info->duration = $duration;
            $call_info->process = $process;
            $call_info->status = $status;
            $call_info->save();
            $user_message->call_info = $call_info;
            if ($for == 0) {
                broadcast(new SendMessage($user_message));
            } else {
                broadcast(new SendMessageGroup($user_message));
            }
            return response()->json($user_message, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => "Lưu tin nhắn cuộc gọi thất bại"], 500);
        }
    }
}
