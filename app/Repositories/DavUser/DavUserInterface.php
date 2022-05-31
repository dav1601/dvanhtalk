<?php

namespace App\Repositories\DavUser;

interface DavUserInterface
{
    public function all();
    public function user($id);
}
