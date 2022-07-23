<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallInfor extends Model
{
    use HasFactory;
    protected $table = "call_information";
    protected $fillable = [
        'user_message_id	',
        'process',
        'status',
        'duration',
        'file_save'
    ];
}
