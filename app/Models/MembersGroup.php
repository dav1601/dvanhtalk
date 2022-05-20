<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembersGroup extends Model
{
    use HasFactory;
    protected $table = "members_group";
    protected $fillable = [
        'users_id',
        'groups_id',
        'role',
    ];
    public function user()
    {
        return $this->hasOne('App\Models\User', 'users_id');
    }
    public function info()
    {
        return $this->belongsTo('App\Models\User', 'users_id');
    }
    public function group()
    {
        return $this->belongsTo('App\Models\Groups', 'groups_id');
    }
}
