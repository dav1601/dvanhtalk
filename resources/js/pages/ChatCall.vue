<template>
    <div
        :class="[connected && hasVideo ? ['p-0', 'm-0'] : '']"
        class="call h-100 w-100 position-relative d-flex align-items-center"
        ref="ChatCall"
        :style="styleBgVidOff"
    >
        <!-- VIẾT SNACKBAR -->

        <v-slide-x-reverse-transition :group="true">
            <v-snackbar
                top
                right
                dark
                v-model="snackbar.audioConnected.open"
                :timeout="4000"
                key="snackbarAudio"
                style="margin-top: 20px"
            >
                {{ snackbar.audioConnected.text }}
            </v-snackbar>
            <v-snackbar
                style="margin-top: 100px"
                top
                right
                dark
                key="snackbarVideo"
                v-model="snackbar.videoConnected.open"
                :timeout="3000"
            >
                {{ snackbar.videoConnected.text }}
            </v-snackbar>
        </v-slide-x-reverse-transition>

        <div v-if="hasVideo">
            <video
                autoplay
                playsinline
                ref="localVoice"
                class="localVoice"
                id="localCam"
                :style="styleLocalCam"
            ></video>
            <video
                autoplay
                @timeupdate="updateTimeVidCall"
                :style="styleVidOff"
                playsinline
                ref="friendVoice"
                class="friendVoice"
                id="friendCam"
            ></video>
        </div>
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
                    :class="[connected && hasVideo ? ['d-none'] : '']"
                    width="120px"
                    height="120px"
                ></item-avatar>
                <span class="mt-2" :class="{ 'd-none': mutedVideo }">{{
                    this.status != "connected" ? this.status : ""
                }}</span>
                <v-btn
                    v-if="showRecall"
                    class="mt-2"
                    @click="startCall(true)"
                    color="primary"
                    style="z-index: 200"
                >
                    Gọi lại
                </v-btn>
                <span
                    class="d-block mt-2"
                    v-if="connected && !hasVideo"
                    id="currentTime"
                    v-html="videoCallParams.duration"
                ></span>
            </div>
            <span v-else class="d-inline-block"> Đang load dữ liệu..... </span>
        </div>
        <div
            id="call__actions"
            class="call__actions position-absolute d-flex justify-content-center align-items-center w-100 mb-8"
        >
            <v-btn
                class="mx-3"
                fab
                dark
                small
                v-if="enabledAudio"
                @click="enabledAudio = false"
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
                @click="enabledAudio = true"
                v-else
            >
                <v-icon dark> mdi-microphone-off </v-icon>
            </v-btn>
            <v-btn
                class="mx-3"
                v-if="isMobile"
                fab
                dark
                small
                @click="switchCam()"
                :disabled="!connected || !hasVideo"
            >
                <v-icon dark> mdi-camera-flip </v-icon>
            </v-btn>
            <v-btn
                class="mx-3"
                v-if="enabledVideo"
                fab
                dark
                small
                @click="enabledVideo = false"
                :disabled="!connected || !hasVideo"
            >
                <v-icon dark> mdi-video </v-icon>
            </v-btn>
            <v-btn
                class="mx-3"
                v-if="!enabledVideo"
                color="pink"
                fab
                dark
                small
                @click="enabledVideo = true"
                :disabled="!connected || !hasVideo"
            >
                <v-icon dark> mdi-video-off </v-icon>
            </v-btn>
            <v-btn class="mx-3" fab dark small color="pink" @click="endCall">
                <v-icon dark> mdi-phone-hangup </v-icon>
            </v-btn>
        </div>
    </div>
</template>
<script>
// import Peer from "simple-peer";
import chatCall from "../mixin/servers/chatCall";
import ItemAvatar from "../components/users/ItemAvatar.vue";
import Peer from "simple-peer";
export default {
    components: { ItemAvatar },
    props: ["streamId", "auth", "myChannel"],
    mixins: [chatCall],
    data() {
        return {
            setting: {
                timeForCall: 300000,
                arrayStatus: {
                    missed: "Đã nhỡ cuộc gọi",
                    calling: "Đang gọi",
                    connecting: "Đang kết nối.....",
                    connected: "Đã kết nối",
                    inCall: "Đang trong cuộc gọi",
                    connFail: "Kết nối thất bại",
                    unanswered: "Không trả lời",
                    accepted: "Đã chấp nhận",
                    deny: "Từ chối cuộc gọi",
                    reCalling: "Đang Gọi lại",
                    ended: "Kết thúc cuộc gọi",
                    haveCall: "Đang trong 1 cuộc gọi khác vui lòng gọi lại sau",
                },
            },
            facingMode: "user",
            showRecall: false,
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
            snackbar: {
                timeOut: 4000,
                audioConnected: {
                    open: false,
                    text: null,
                },
                videoConnected: {
                    open: false,
                    text: null,
                },
            },

            process: "",
            videoCallParams: {
                switchingCam: false,
                front: true,
                duration: "00:00",
                timeCall: null,
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
        if (this.isBroadcaster) {
            this.setProcess("calling");
        } else {
            const existBrd = this.videoCallParams.users.findIndex(
                (user) => user.id == this.broadcasterId
            );
            if (existBrd < 0) {
                this.setProcess("connecting");
            } else {
                this.setProcess("ended");
            }
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
        styleLocalCam() {
            const styleObj1 = {
                bottom: "15px",
                width: "300px",
                height: "200px",
            };
            const styleObj2 = {
                top: "65px",
                width: "170px",
                height: "225px",
            };
            if (this.isMobile || !this.isIpadProUp) {
                return styleObj2;
            }
            return styleObj1;
        },
        callAccepted() {
            return this.videoCallParams.callAccepted;
        },
        channelName() {
            return `call-signal-channel-` + this.streamId;
        },
        isBroadcaster() {
            return this.authId == this.broadcasterId;
        },
        broadcasterId() {
            return this.$route.query.broadcaster;
        },
        receiverId() {
            return this.$route.query.receiver;
        },
        hasVideo() {
            return this.$route.query.has_video == "true";
        },
        typeCall() {
            return this.$route.query.type;
        },

        styleBgVidOff() {
            if (this.hasVideo) {
                if (this.mutedVideo) {
                    return (
                        "background-image: url(" +
                        this.$helpers.getAssetsPath("images/video-off.png") +
                        ");" +
                        "background-repeat: no-repeat;" +
                        "background-attachment: fixed;" +
                        "background-position: center;"
                    );
                }
                return;
            }
            return;
        },
        styleVidOff() {
            if (this.hasVideo) {
                if (this.mutedVideo) {
                    return "width: 0 !important; height:0; !important";
                }
                return;
            }
            return;
        },
    },
    methods: {
        async switchCam() {
            this.switchingCam = true;
            if (this.facingMode == "user") {
                this.facingMode = "environment";
            } else {
                this.facingMode = "user";
            }
            this.$nextTick(async () => {
                if (this.isBroadcaster) {
                    await this.caller();
                } else {
                    await this.acceptedCall();
                }
            });
        },
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
            this.videoCallParams.timeCall = time;
            this.videoCallParams.duration = this.$helpers.fancyTimeFormat(
                Math.floor(time)
            );
        },
        updateTimeVidCall() {
            const time = this.$refs.friendVoice.currentTime;
            this.videoCallParams.timeCall = time;
        },
        async startCall(reCall = false) {
            this.initChannel();
            if (this.isBroadcaster) {
                this.ring(true);
                if (reCall) {
                    await this.resetCall();
                    this.setProcess("reCalling");
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
            if (this.videoCallParams.peer1) {
                this.videoCallParams.peer1.destroy();
            }
            if (this.videoCallParams.peer2) {
                this.videoCallParams.peer2.destroy();
            }
            this.setInCall(false);
            clearTimeout(this.timeOutCall);
            this.mutedAudio = false;
            this.mutedVideo = false;
            this.timeOutCall = null;
            this.enabledAudio = true;
            this.enabledVideo = true;
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
            this.videoCallParams.duration = "00:00";
            this.videoCallParams.timeCall = null;
            this.videoCallParams.front = true;
            this.videoCallParams.switchCam = false;
        },
        getMediaPermission() {
            return this.getPermissions(true)
                .then((stream) => {
                    this.videoCallParams.stream = stream;
                    this.$refs.localVoice.srcObject = stream;
                    this.$refs.localVoice.muted = true;
                })
                .catch((err) => {
                    console.log(err.message);
                });
        },
        setDeviceConnected() {
            const stream = this.videoCallParams.stream;
            if (!stream || this.isMobile) {
                return;
            }
            const label = stream.getAudioTracks()[0].label
                ? stream.getAudioTracks()[0].label
                : "";
            const label2 = stream.getVideoTracks()[0].label
                ? stream.getVideoTracks()[0].label
                : "";
            this.snackbar.audioConnected.text =
                "Microphone được kết nối: " + label;
            this.snackbar.audioConnected.open = true;
            if (this.hasVideo) {
                this.snackbar.videoConnected.text =
                    "Camera được kết nối: " + label2;
                this.snackbar.videoConnected.open = true;
            }
        },
        initChannel() {
            this.videoCallParams.channel = Echo.join(this.channelName);
            this.videoCallParams.channel
                .here((users) => {
                    this.videoCallParams.users = users;
                    if (!this.isBroadcaster) {
                        if (users.length < 2) {
                            this.setProcess("ended");
                        }
                    }
                    console.log(users);
                })

                .joining((user) => {
                    // check user availability
                    if (this.isBroadcaster) {
                        this.setProcess("connecting");
                        this.videoCallParams.callAccepted = true;
                        this.caller();
                    } else {
                        this.setIcmc(false);
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
                    if (this.process == "connecting") {
                        this.endCall();
                    } else {
                        this.setInCall(false);
                    }
                })
                // listen to incomming call
                .listen("CallChat", (e) => {
                    const data = e.data;
                    console.log(e);
                    if (data.type == "incomingCall") {
                        const updatedSignal = {
                            ...data.signalData,
                            sdp: `${data.signalData.sdp}\n`,
                        };
                        this.acceptedCall(updatedSignal);
                    }
                    if (data.type == "toggleMic") {
                        this.mutedAudio = !data.enable;
                    }
                    if (data.type == "toggleVideo") {
                        this.mutedVideo = !data.enable;
                    }
                    if (data.type == "callAccepted") {
                        if (this.process == "ended") {
                            this.offerCall(this.process);
                        }
                        if (data.signal.renegotiate) {
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

            this.myChannel["notify"].listen("NotifyCall", (e) => {
                const data = e.data;
                if (data.type == "answer" && this.isBroadcaster) {
                    this.handleAnswer(data.answer);
                }
                if (!this.isBroadcaster && data.type == "ended") {
                    this.endCall();
                }
            });
        },
        handleAnswer(answer) {
            clearTimeout(this.timeOutCall);
            this.setProcess(answer);
        },
        async caller() {
            await this.getMediaPermission(this.videoCallParams.front);
            if (!this.videoCallParams.switchCam) {
                this.setDeviceConnected();
            }
            this.videoCallParams.peer1 = new Peer({
                initiator: true,
                trickle: false,
                stream: this.videoCallParams.stream,
                config: this.servers,
            });
            this.videoCallParams.peer1.on("signal", async (data) => {
                if (this.isBroadcaster) {
                    if (
                        this.process == "calling" ||
                        this.process == "reCalling"
                    ) {
                        await this.offerCall();
                    }
                }
                axios
                    .post(route("stream.offer"), {
                        to: this.contactPerson.id,
                        signal: data,
                        from: this.authId,
                        streamId: this.streamId,
                    })
                    .then((req) => {
                        console.log(req);
                    })
                    .catch((error) => {});
            });

            this.videoCallParams.peer1.on("stream", (remoteStream) => {
                this.$refs.friendVoice.srcObject = remoteStream;
            });
            this.videoCallParams.peer1.on("connect", () => {
                this.setProcess("connected");
                this.connected = true;
                clearTimeout(this.timeOutCall);
                this.switchingCam = false;
            });

            this.videoCallParams.peer1.on("error", (err) => {
                console.log(err);
                this.setProcess("connFail");
            });

            this.videoCallParams.peer1.on("close", () => {
                this.endCall();
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
        async offerCall(type = "offer", rcv = this.receiverId) {
            const urlJoin = type == "offer" ? this.$route.fullPath : "";
            await this.$store.dispatch("message/offerCall", {
                receiver: rcv,
                type: type,
                action: "call",
                urlJoin: urlJoin,
            });
        },
        async acceptedCall(peer1) {
            await this.getMediaPermission(this.videoCallParams.front);
            if (!this.videoCallParams.switchCam) {
                this.setDeviceConnected();
            }
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
                    .then((req) => {})
                    .catch((error) => {});
            });

            this.videoCallParams.peer2.on("stream", (remoteStream) => {
                this.$refs.friendVoice.srcObject = remoteStream;
            });

            this.videoCallParams.peer2.on("connect", () => {
                this.setProcess("connected");
                this.connected = true;
                clearTimeout(this.timeOutCall);
                this.switchingCam = false;
            });

            this.videoCallParams.peer2.on("error", (err) => {
                console.log(err);
            });

            this.videoCallParams.peer2.on("close", () => {
                this.endCall();
            });
            this.videoCallParams.peer2.signal(peer1);
        },

        setMutedAudio(mute = false) {
            const friendStr = this.$refs.friendVoice;

            if (this.hasVideo) {
                friendStr.srcObject.getAudioTracks()[0].enabled = !mute;
            } else {
                friendStr.muted = mute;
            }
        },
        setEnabledVideo(enable) {
            const friendStr = this.$refs.friendVoice;
            friendStr.srcObject.getVideoTracks()[0].enabled = enable;
        },
        stopAll() {
            const friendStr = this.$refs.friendVoice;
            const myStr = this.$refs.localVoice;
            friendStr.currentTime = 0;
            myStr.currentTime = 0;
            if (!this.hasVideo) {
                friendStr.pause();
                myStr.pause();
            } else {
                friendStr.srcObject.getVideoTracks().forEach((track) => {
                    track.stop();
                    friendStr.srcObject.removeTrack(track);
                });
                myStr.srcObject.getVideoTracks().forEach((track) => {
                    track.stop();
                    myStr.srcObject.removeTrack(track);
                });

                friendStr.pause();
                myStr.pause();
                friendStr.src = "";
                myStr.src = "";
            }
        },
        toggleAuido(enable = true) {
            this.enabledAudio = enable;
            this.$nextTick(() => {
                axios.post(route("call.action.mic"), {
                    type: "toggleMic",
                    enable: enable,
                    streamId: this.streamId,
                });
            });
        },
        toggleVideo(enable = true) {
            this.enabledVideo = enable;
            this.$nextTick(() => {
                axios
                    .post(route("call.action.mic"), {
                        type: "toggleVideo",
                        enable: enable,
                        streamId: this.streamId,
                    })
                    .then((req) => {});
            });
        },
        async endCall() {
            this.setProcess("ended");
            clearTimeout(this.timeOutCall);
            this.stopAll();
            if (this.isBroadcaster) {
                await this.offerCall("ended");
                if (this.videoCallParams.peer1) {
                    this.videoCallParams.peer1.destroy();
                }
            } else {
                await this.offerCall("ended", this.broadcasterId);
                if (this.videoCallParams.peer2) {
                    this.videoCallParams.peer2.destroy();
                }
            }
            this.resetCall();
            Echo.leave(this.channelName);
            setTimeout(() => {
                this.callPlaced = false;
            }, 2000);
        },
    },
    watch: {
        async process(process) {
            if (
                process == "connected" ||
                process == "calling" ||
                process == "reCalling" ||
                process == "connecting"
            ) {
                this.setInCall(true);
            } else {
                this.setInCall(false);
            }
            if (
                process == "unanswered" ||
                process == "deny" ||
                process == "cancel" ||
                process == "missed" ||
                process == "ended" ||
                process == "connFail"
            ) {
                this.showRecall = true;
            } else {
                this.showRecall = false;
            }
            if (this.isBroadcaster) {
                clearTimeout(this.timeOutCall);
                if (
                    process == "unanswered" ||
                    process == "deny" ||
                    process == "missed" ||
                    process == "ended"
                ) {
                    await this.$store.dispatch("message/createMessageCall", {
                        process: process,
                        status: this.getStatus(process),
                        receiver: this.receiverId,
                        duration: this.videoCallParams.timeCall,
                        for: this.typeCall,
                        hasVideo: this.hasVideo,
                    });
                }
                if (
                    process == "missed" ||
                    process == "deny" ||
                    process == "haveCall"
                ) {
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
        enabledAudio(enable) {
            this.toggleAuido(enable);
        },
        mutedAudio(muteee) {
            this.setMutedAudio(muteee);
        },
        enabledVideo(enable) {
            this.toggleVideo(enable);
        },
        mutedVideo(muted) {
            this.setEnabledVideo(!muted);
        },
    },
};
</script>
<style lang="scss" scoped>
#friendCam {
    object-fit: cover;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;
}
#localCam {
    object-fit: cover;
    position: fixed;
    right: 15px;
    z-index: 100;
    border-radius: 8px;
}
.call {
    &__actions {
        bottom: 10px;
        z-index: 101;
    }
}
</style>
