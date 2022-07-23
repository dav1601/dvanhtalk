<?php

namespace App\Repositories\Eloquents;

use App\Models\User;
use App\Models\Groups;
use App\Models\Message;
use App\Models\UserMessage;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Messages\MessagesInterface;
use Carbon\Carbon;

class MessagesRepository implements MessagesInterface
{

    public function createMessageSystemGroup($group_id, $user_id, $action)
    {
        $group = Groups::with('founder')->where('id', $group_id)->first();
        $username =  User::select('name')->where('id', $user_id)->first()->name;
        $message = new Message();
        $user_message = new UserMessage();
        $arrayMessage = [
            "kick" => " đã bị quản trị viên xoá khỏi nhóm",
            "add" => " đã được quản trị viên thêm vào nhóm",
            "out" => " đã rời khỏi nhóm",
        ];
        if (!$group || !$username || !array_key_exists($action, $arrayMessage))
            return false;
        $message_system = $username . $arrayMessage[$action];
        $user_message = $this->store_message($group_id, $message_system, 4, null, 1, 1);
        if (!$user_message) {
            return false;
        }
        $user_message->sender = $group->founder;
        return $user_message;
    }
    public function getAllMessageMedia($partnerId = 0, $type = 0)
    {
        try {
            $rcv_id = $partnerId;
            $type = $type;
            $media = array();
            if ($type == 0) {
                $media =  UserMessage::with('message')->where(function ($q) use ($rcv_id, $type) {
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
            } else {
                $media =  UserMessage::with('message')->where('rcv_group_id', $partnerId)->where('type_msg', '=', 2)->where('type', $type)->get();
            }
            $arrayImage = array();
            foreach ($media as $msg) {
                $array = explode(",", $msg->message->message);
                foreach ($array as $key => $value) {
                    $arrayImage[] = ["url" => $value, "alt" => "image message", "msg_id" => $msg->message->id, "index" => $key];
                }
            }
            return $arrayImage;
        } catch (\Exception $e) {
            return false;
        }
    }
    public function created_at()
    {
        return Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d H:i');
    }
    public function format_created_at($created_at)
    {
        return (string) Carbon::parse($created_at)->format('Y-m-d H:i:s');
    }
    public function getLastMessage($friendId)
    {
        return UserMessage::with('message')->where(function ($q) use ($friendId) {
            $q->where('sd_id', '=', Auth::id())
                ->where('rcv_id', '=', $friendId)
                ->where('type', 0);
        })->orWhere(function ($q) use ($friendId) {
            $q->where('sd_id', '=', $friendId)
                ->where('rcv_id', '=', Auth::id())
                ->where('type', 0);
        })->latest()->take(1)->first();
    }
    public function store_message($rcv_id, $message = null, $type_msg = 1, $parent_id = null, $seen = 0, $for = 0)
    {
        $store_message = new Message();
        $user_message = new UserMessage();
        $created_at = $this->created_at();
        $store_message->message = $message;
        $store_message->type = $type_msg;
        $store_message->created_at =  $created_at;
        $store_message->updated_at =  $created_at;
        if ($store_message->save()) {
            try {
                $user_message->msg_id = (int) $store_message->id;
                $user_message->sd_id = (int) Auth::id();
                if ($for == 0) {
                    $user_message->rcv_id = (int) $rcv_id;
                } else {
                    $user_message->rcv_group_id = (int) $rcv_id;
                }
                $user_message->seen = (int) $seen;
                $user_message->type = $for;
                $user_message->type_msg =  $store_message->type;
                $user_message->created_at =  $created_at;
                $user_message->msg_reply_id = $parent_id;
                $user_message->save();
                $setupRelation = ["message", "message_parent" , "call_infor"];
                if ($for == 1) {
                    $setupRelation[] = "sender";
                }
                $user_message->load($setupRelation);
                $user_message->group_created_at = $this->format_created_at($created_at);
                return $user_message;
            } catch (\Exception $e) {
                $store_message->delete();
                $user_message->delete();
                return false;
            }
        }
        $store_message->delete();
        return false;
    }
}
