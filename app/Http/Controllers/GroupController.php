<?php

namespace App\Http\Controllers;

use App\Models\Groups;
use App\Models\MembersGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Groups\GroupsInterface;
use App\Repositories\Messages\MessagesInterface;

class GroupController extends Controller
{
    public function __construct(GroupsInterface $dav2_gr, MessagesInterface $dav2_msg)
    {
        $this->dav2_gr = $dav2_gr;
        $this->dav2_msg = $dav2_msg;
    }
    public function index(Request $request)
    {
        $groups = Groups::with(['members', 'founder', 'requestsJoin', 'requestsJoin.sender', 'members.info'])->when($request->has('keyword'), function ($q) use ($request) {
            return $q->where('name', 'LIKE', '%' . $request->keyword . '%');
        })->get();
        $my_groups_joined = MembersGroup::with(['group', 'group.members', 'group.founder', 'group.requestsJoin', 'group.requestsJoin.sender', 'group.members.info'])->where('users_id', Auth::id())->get();
        $my_groups = Groups::with(['members', 'founder', 'requestsJoin', 'requestsJoin.sender', 'members.info'])->where('users_id', Auth::id())->get();
        $keyBy = $my_groups_joined->keyBy('groups_id')->toArray();
        $sort1 = $groups->filter(function ($item, $key) use ($keyBy) {
            return array_key_exists($item->id, $keyBy);
        });
        $sort2 = $groups->filter(function ($item, $key) use ($keyBy) {
            return !array_key_exists($item->id, $keyBy);
        });
        $groups = collect($sort1)->merge(collect($sort2));
        return response()->json(['groups' => $groups, 'my_groups_joined' => $my_groups_joined, 'my_groups' => $my_groups], 200);
    }
}
