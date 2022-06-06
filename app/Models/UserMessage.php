<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMessage extends Model
{
    use HasFactory;
    protected $table = "user_message";
    protected $fillable = [
        'sd_id',
        'rcv_id',
        'rcv_group_id',
        'msg_id',
        'type',
        'type_msg',
        'seen',
    ];
    public function message()
    {
        return $this->belongsTo('App\Models\Message',  'msg_id');
    }
    public function sender()
    {
        return $this->belongsTo('App\Models\User', 'sd_id');
    }
    public function images()
    {
        return $this->message()->where('type', 2);
    }
}
