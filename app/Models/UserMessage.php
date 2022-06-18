<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    public function message_parent()
    {
        return $this->belongsTo('App\Models\Message',  'msg_reply_id');
    }
    public function sender()
    {
        return $this->belongsTo('App\Models\User', 'sd_id');
    }
    public function images()
    {
        return $this->message()->where('type', 2);
    }
    // public function getCreatedAtAttribute($date)
    // {
    //     return Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('Y-m-d H:i');
    // }
}
