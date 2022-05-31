<?php

namespace App\Repositories\Groups;

interface GroupsInterface
{
    public function all();
    public function group($group_id);
}
