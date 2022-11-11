<?php

namespace App\Repositories\DavUser;

interface DavUserInterface
{
    public function all();
    public function user($id);
    public function generate_code_change_pass();
    
}
