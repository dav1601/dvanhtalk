<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomCallChat extends Model
{
    use HasFactory;
    protected $table = "room_call_chat";
    protected $fillable = [
        'from',
        'to',
        'duration',
        'saved_audio',
        'saved_video'
    ];
}
