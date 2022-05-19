<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{
    use HasFactory;
    protected $table = "groups";
    protected $fillable = [
        'users_id',
        'name',
        'group_image',
    ];
    public function members()
    {
        return $this->hasMany('App\Models\MembersGroup', 'groups_id');
    }
    public function founder()
    {
        return $this->belongsTo('App\Models\User', 'users_id');
    }
    public function requestsJoin()
    {
        return $this->hasMany('App\Models\RequestjoinGroup', 'groups_id');
    }
}
