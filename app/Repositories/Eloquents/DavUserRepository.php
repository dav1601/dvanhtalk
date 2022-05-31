<?php

namespace App\Repositories\Eloquents;

use App\Models\User;
use App\Repositories\DavUser\DavUserInterface;

class DavUserRepository implements DavUserInterface
{
    public function all()
    {
        return User::all();
    }

    public function user($id)
    {
        return User::where('id', $id)->firstOrFail();
    }
}
