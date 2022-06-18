<?php

namespace App\Repositories\Messages;

interface MessagesInterface
{
    public function createMessageSystemGroup($groups_id, $user_id, $action);
    public function getAllMessageMedia($partnerId, $type = 0);
    public function created_at();
    public function format_created_at($created_at);
    public function getLastMessage($friendId);
}
