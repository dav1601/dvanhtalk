<?php

namespace App\Repositories\Eloquents;

use App\Models\User;
use App\Repositories\DavUser\DavUserInterface;
use App\Repositories\Messages\MessagesInterface;

class DavUserRepository implements DavUserInterface
{
    public function __construct(MessagesInterface $msg)
    {
        $this->msg = $msg;
    }
    public function all()
    {
        return User::all();
    }

    public function user($id)
    {
        $user = User::with('count')->where('id', $id)->first();
        if ($user) {
            $user->lastest_msg = $this->msg->getLastMessage($id);
            return $user;
        }
        return null;
    }
}
