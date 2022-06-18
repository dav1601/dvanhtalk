<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReactionMessage extends Model
{
    use HasFactory;
    protected $table = "reaction_message";
    protected $fillable = [
        'users_id',
        'message_id',
        'reaction',
    ];
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'users_id', 'id');
    }
}
