<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestJoinGroup extends Model
{
    use HasFactory;
    protected $table = "request_join_group";
    protected $fillable = [
        'users_id',
        'groups_id',
        'status',
        'type'
    ];
    public function group()
    {
        return $this->belongsTo('App\Models\Groups', 'groups_id');
    }
    public function sender()
    {
        return $this->belongsTo('App\Models\User', 'users_id');
    }
}
