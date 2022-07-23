<template>
    <v-container
        class="m-auto call h-100 position-relative d-flex align-items-center"
    >
        <audio
            controls
            muted
            loop
            class="d-none"
            ref="ringCall"
            v-if="isBroadcaster"
        >
            <source
                :src="$helpers.getAssetsPath('audio/caller.mp3')"
                type="audio/mp3"
            />
        </audio>
        <div class="d-none" v-if="!hasVideo">
            <audio autoplay controls ref="localVoice"></audio>
            <audio
                autoplay
                controls
                ref="friendVoice"
                @timeupdate="updateTimeCall"
            ></audio>
        </div>
        <div class="d-none" v-else>
            <video
                v-if="hasVideo"
                autoplay
                playsinline
                ref="localVoice"
                class="localVoice"
            ></video>
            <video
                v-if="hasVideo"
                autoplay
                playsinline
                ref="friendVoice"
                class="friendVoice"
            ></video>
        </div>
        <div class="m-auto d-flex justify-content-center align-items-center">
            <div
                class="d-flex justify-content-center align-items-center flex-column"
                v-if="!loading"
            >
                <item-avatar
                    v-if="!loading"
                    :username="contactPerson.name"
                    :img="contactPerson.avatar"
                    :fullWH="false"
                    width="120px"
                    height="120px"
                ></item-avatar>
                <span class="d-block mt-2">{{
                    this.status != "connected" ? this.status : ""
                }}</span>
                <v-btn
                    v-if="denyOrMiss"
                    class="mt-2"
                    @click="startCall(true)"
                    color="primary"
                >
                    Gọi lại
                </v-btn>
                <span
                    class="d-block mt-2"
                    v-if="connected"
                    id="currentTime"
                    v-html="videoCallParams.duration"
                ></span>
            </div>
            <span v-else class="d-inline-block"> Đang load dữ liệu..... </span>
        </div>
        <div
            class="call__actions position-absolute d-flex justify-content-center align-items-center w-100"
        >
            <v-btn
                class="mx-3"
                fab
                dark
                small
                v-if="enabledAudio"
                @click="toggleMutedAudio(true)"
                :disabled="!connected"
            >
                <v-icon dark> mdi-microphone </v-icon>
            </v-btn>
            <v-btn
                class="mx-3"
                fab
                dark
                small
                color="pink"
                :disabled="!connected"
                @click="toggleMutedAudio(false)"
                v-else
            >
                <v-icon dark> mdi-microphone-off </v-icon>
            </v-btn>
            <v-btn class="mx-3" fab dark small :disabled="!connected">
                <v-icon dark> mdi-video </v-icon>
            </v-btn>
            <v-btn class="mx-3" fab dark small color="pink" @click="endCall">
                <v-icon dark> mdi-phone-hangup </v-icon>
            </v-btn>
        </div>
    </v-container>
</template>
<script>
// import Peer from "simple-peer";
import user from "../mixin/user";
import chatCall from "../mixin/servers/chatCall";
import ItemAvatar from "../components/users/ItemAvatar.vue";
import Peer from "simple-peer";
export default {
    components: { ItemAvatar },
    props: ["streamId", "auth", "myChannel"],
    mixins: [user, chatCall],
    data() {
        return {
            setting: {
                timeForCall: 300000,
                arrayStatus: {
                    missed: "Đã nhỡ cuộc gọi",
                    calling: "Đang gọi",
                    connecting: "Đang kết nối.....",
                    connected: "Đã kết nối",
                    unanswered: "Không trả lời",
                    accepted: "Đã chấp nhận",
                    deny: "Từ chối cuộc gọi",
                    reCalling: "Đang Gọi lại",
                    ended: "Kết thúc cuộc gọi",
                    haveCall: "Đang trong 1 cuộc gọi khác vui lòng gọi lại sau",
                },
            },
            isFocusMyself: true,
            callPlaced: true,
            mutedAudio: false,
            mutedVideo: false,
            enabledAudio: true,
            enabledVideo: true,
            connected: false,
            ended: false,
            denyOrMiss: false,
            timeOutCall: null,
            process: "",
            videoCallParams: {
                duration: "00:00",
                users: [],
                stream: null,
                receivingCall: false,
                caller: null,
                callerSignal: null,
                callAccepted: false,
                channel: null,
                peer1: null,
                peer2: null,
            },
            loading: true,
            contactPerson: null,
            localStream: null,
            friendStream: null,
            status: null,
            servers: {
                iceServer: [
                    {
                        urls: [
                            "stun1.l.google.com:19302",
                            "stun2.l.google.com:19302",
                        ],
                    },
                ],
            },
        };
    },
    created() {
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            return (event.returnValue = "Changes you made may not be saved");
        });
        if (this.isBroadcaster) {
            this.setCalling(true);
            this.setProcess("calling");
        } else {
            this.setProcess("connecting");
        }
    },
    mounted() {
        if (this.callPlaced) {
            const idPartner = this.isBroadcaster
                ? this.receiverId
                : this.broadcasterId;

            this.$store
                .dispatch("users/getSimpleUser", idPartner)
                .then(async (req) => {
                    this.contactPerson = req.data;
                    this.loading = false;
                    this.startCall();
                });
        }
    },
    computed: {
        callAccepted() {
            return this.videoCallParams.callAccepted;
        },
        channelName() {
            return `call-signal-channel-` + this.streamId;
        },
        isBroadcaster() {
            return this.id == this.broadcasterId;
        },
        broadcasterId() {
            return this.$route.query.broadcaster;
        },
        receiverId() {
            return this.$route.query.receiver;
        },
        hasVideo() {
            if (this.$route.query.hasVideo) {
                return this.$route.query.has_video;
            }
            return false;
        },

        //  Nếu như isbr thì xử lý broad còn không thì xử lý theo viewer
    },
    methods: {
        getStatus(status) {
            if (this.setting.arrayStatus[status]) {
                return this.setting.arrayStatus[status];
            }
            return "Not found Status";
        },
        setProcess(process) {
            this.process = process;
            this.status = this.getStatus(process);
        },
        updateTimeCall() {
            const time = this.$refs.friendVoice.currentTime;
            this.videoCallParams.duration = this.fancyTimeFormat(
                Math.floor(time)
            );
        },
        fancyTimeFormat(duration) {
            // Hours, minutes and seconds
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        },
        async startCall(reCall = false) {
            this.initChannel();
            if (this.isBroadcaster) {
                this.ring(true);
                if (reCall) {
                    await this.resetCall();
                    this.setProcess("reCalling");
                    this.setCalling(true);
                }
                this.$nextTick(async () => {
                    await this.offerCall();
                    this.timeOutCall = setTimeout(() => {
                        this.setProcess("unanswered");
                    }, this.setting.timeForCall);
                    await this.caller();
                });
            }
        },
        resetCall() {
            clearTimeout(this.timeOutCall);
            this.mutedAudio = false;
            this.mutedVideo = false;
            this.timeOutCall = null;
            this.enabledAudio = true;
            this.ended = false;
            this.denyOrMiss = false;
            this.connected = false;
            this.friendStream = null;
            this.localStream = null;
            this.videoCallParams.users = [];
            this.videoCallParams.stream = null;
            this.videoCallParams.receivingCall = false;
            this.videoCallParams.caller = null;
            this.videoCallParams.callerSignal = null;
            this.videoCallParams.callAccepted = false;
            this.videoCallParams.channel = null;
            this.videoCallParams.peer1 = null;
            this.videoCallParams.peer2 = null;
        },
        getMediaPermission() {
            return this.getPermissions()
                .then((stream) => {
                    this.videoCallParams.stream = stream;
                    this.$refs.localVoice.srcObject = stream;
                    this.$refs.localVoice.muted = true;
                    console.log("created stream");
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        initChannel() {
            this.videoCallParams.channel = Echo.join(this.channelName);
            this.videoCallParams.channel
                .here((users) => {
                    console.log(users);
                    this.videoCallParams.users = users;
                })

                .joining((user) => {
                    // check user availability
                    if (this.isBroadcaster) {
                        this.setProcess("connecting");
                        this.videoCallParams.callAccepted = true;
                    }

                    const joiningUserIndex =
                        this.videoCallParams.users.findIndex(
                            (data) => data.id === user.id
                        );
                    if (joiningUserIndex < 0) {
                        this.videoCallParams.users.push(user);
                    }
                })

                .leaving((user) => {
                    const leavingUserIndex =
                        this.videoCallParams.users.findIndex(
                            (data) => data.id === user.id
                        );
                    this.videoCallParams.users.splice(leavingUserIndex, 1);
                    this.endCall();
                })
                // listen to incomming call
                .listen("CallChat", (e) => {
                    console.log(e);
                    const data = e.data;
                    if (data.type == "incomingCall") {
                        const updatedSignal = {
                            ...data.signalData,
                            sdp: `${data.signalData.sdp}\n`,
                        };
                        this.acceptedCall(updatedSignal);
                    }
                    if (data.type == "toggleMic") {
                        console.log(data);
                        this.setMuteAudio(data.muted);
                    }
                    if (data.type == "callAccepted") {
                        if (data.signal.renegotiate) {
                            console.log("renegotating");
                        }
                        if (data.signal.sdp) {
                            const updatedSignal = {
                                ...data.signal,
                                sdp: `${data.signal.sdp}\n`,
                            };
                            this.videoCallParams.peer1.signal(updatedSignal);
                        }
                    }
                });
            if (this.isBroadcaster) {
                this.myChannel["notify"].listen("NotifyCall", (e) => {
                    const data = e.data;
                    console.log({
                        ans: data,
                    });
                    if (data.type == "answer") {
                        this.handleAnswer(data.answer);
                    }
                });
            }
        },
        handleAnswer(answer) {
            clearTimeout(this.timeOutCall);
            this.setProcess(answer);
        },
        async caller() {
            await this.getMediaPermission();
            this.videoCallParams.peer1 = new Peer({
                initiator: true,
                trickle: false,
                stream: this.videoCallParams.stream,
                config: this.servers,
            });
            this.videoCallParams.peer1.on("signal", async (data) => {
                if (
                    this.process == "calling" ||
                    (this.process == "reCalling" && this.isBroadcaster)
                ) {
                    await this.offerCall();
                }
                axios
                    .post(route("stream.offer"), {
                        to: this.contactPerson.id,
                        signal: data,
                        from: this.id,
                        streamId: this.streamId,
                    })
                    .then(() => {})
                    .catch((error) => {
                        console.log(error);
                    });
            });

            this.videoCallParams.peer1.on("stream", (remoteStream) => {
                console.log("call streaming of rcv");
                this.$refs.friendVoice.srcObject = remoteStream;
            });
            this.videoCallParams.peer1.on("connect", () => {
                this.setProcess("connected");
                this.connected = true;
                clearTimeout(this.timeOutCall);
                console.log("peer connected 1");
            });

            this.videoCallParams.peer1.on("error", (err) => {
                console.log(err);
            });

            this.videoCallParams.peer1.on("close", () => {
                this.endCall();
                console.log("call closed caller");
            });
        },
        ring(r = true) {
            const audio = this.$refs.ringCall;
            audio.currentTime = 0;
            if (r) {
                audio.play();
            } else {
                audio.pause();
            }
        },
        async offerCall(type = "offer") {
            const urlJoin = type == "offer" ? this.$route.fullPath : "";
            await this.$store.dispatch("message/offerCall", {
                receiver: this.receiverId,
                type: type,
                action: "call",
                urlJoin: urlJoin,
            });
        },
        async acceptedCall(peer1) {
            await this.setCalling(true);
            await this.getMediaPermission();
            this.videoCallParams.peer2 = new Peer({
                initiator: false,
                trickle: false,
                stream: this.videoCallParams.stream,
                config: this.servers,
            });
            this.videoCallParams.peer2.on("signal", (data) => {
                axios
                    .post(route("stream.answer"), {
                        signal: data,
                        to: this.broadcasterId,
                        streamId: this.streamId,
                    })
                    .then(() => {})
                    .catch((error) => {
                        console.log(error);
                    });
            });

            this.videoCallParams.peer2.on("stream", (remoteStream) => {
                console.log("broadter stream");
                this.$refs.friendVoice.srcObject = remoteStream;
            });

            this.videoCallParams.peer2.on("connect", () => {
                this.setProcess("connected");
                this.connected = true;
                clearTimeout(this.timeOutCall);
                console.log("peer 2 connected");
            });

            this.videoCallParams.peer2.on("error", (err) => {
                console.log(err);
            });

            this.videoCallParams.peer2.on("close", () => {
                this.endCall();
                console.log("call closed accepter");
            });
            this.videoCallParams.peer2.signal(peer1);
        },
        setMuteAudio(muted = false) {
            if (this.hasVideo) {
                this.$refs.friendVoice.srcObject.getAudioTracks()[0].enabled =
                    !muted;
            } else {
                this.$refs.friendVoice.muted = muted;
            }
            this.mutedAudio = muted;
        },
        toggleMutedAudio(muted = true) {
            this.enabledAudio = !muted;
            this.$nextTick(() => {
                axios.post(route("call.action.mic"), {
                    type: "toggleMic",
                    muted: muted,
                    streamId: this.streamId,
                });
            });
        },

        async endCall() {
            // if video or audio is muted, enable it so that the stopStreamedVideo method will work
            await this.setCalling(false);
            clearTimeout(this.timeOutCall);
            this.setProcess("ended");
            this.setMuteAudio(true);
            this.ended = true;
            this.connected = false;
            await this.offerCall("ended");
            if (this.isBroadcaster) {
                this.videoCallParams.peer1.destroy();
            } else {
                this.videoCallParams.peer2.destroy();
            }
            Echo.leave(this.channelName);
            setTimeout(() => {
                this.callPlaced = false;
            }, 2000);
        },
    },
    watch: {
        async process(process) {
            if (this.isBroadcaster) {
                clearTimeout(this.timeOutCall);
                if (
                    process == "unanswered" ||
                    process == "deny" ||
                    process == "cancel" ||
                    process == "missed" ||
                    process == "ended"
                ) {
                    await this.$store.dispatch("message/createMessageCall", {
                        process: process,
                        status: this.getStatus(process),
                        receiver: this.receiverId,
                    });
                }
                if (
                    process == "missed" ||
                    process == "deny" ||
                    process == "haveCall"
                ) {
                    this.videoCallParams.peer1.destroy();
                    this.denyOrMiss = true;
                }
                if (process != "calling" && process != "reCalling") {
                    this.ring(false);
                }
            }
        },
        callAccepted(accept) {
            if (accept) {
                clearTimeout(this.timeOutCall);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.call {
    &__actions {
        bottom: 10px;
    }
}
</style>
