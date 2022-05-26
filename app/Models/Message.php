<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $table = "message";
    protected $fillable = [
        'parent_id',
        'message',
        'type',
        'status'
    ];
    public function user()
    {
        return $this->hasOne('App\Models\UserMessage', 'msg_id');
    }
    
}
