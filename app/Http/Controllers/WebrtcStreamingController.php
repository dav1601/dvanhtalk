<?php

namespace App\Http\Controllers;

use App\Events\CallChat;
use stdClass;
use App\Events\NotifyCall;
use App\Events\StreamOffer;
use App\Events\StreamAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WebrtcStreamingController extends Controller
{
    public function makeStreamOffer(Request $request)
    {
        $data['to'] = $request->to;
        $data['signalData'] = $request->signal;
        $data['from'] = Auth::id();
        $data['type'] = 'incomingCall';
        $data['streamId'] = $request->streamId;
        broadcast(new CallChat($data))->toOthers();
    }

    public function makeStreamAnswer(Request $request)
    {
        $data['streamId'] = $request->streamId;
        $data['signal'] = $request->signal;
        $data['to'] = $request->to;
        $data['type'] = 'callAccepted';
        broadcast(new CallChat($data))->toOthers();
    }
    public function offer__call(Request $request)
    {
        $data = new stdClass();
        $data->broadcaster = Auth::user();
        $data->to = (int)$request->to;
        $data->type = $request->type;
        $data->action = $request->action;
        $data->urlJoin = $request->urlJoin;
        broadcast(new NotifyCall($data));
    }
    public function ans__call(Request $request)
    {
        $data = new stdClass();
        $data->to = (int)$request->callerId;
        $data->type = $request->type;
        $data->answer = $request->answer;
        broadcast(new NotifyCall($data));
    }
    public function toggle__voice(Request $request)
    {
        $data['type'] = "toggleMic";
        $data['muted'] = $request->muted;
        $data['streamId'] = $request->streamId;
        broadcast(new CallChat($data))->toOthers();
    }
}
