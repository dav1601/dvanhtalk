<template>
    <v-dialog v-model="openDialog" max-width="500" :fullscreen="!isIpadProUp">
        <v-card dark class="p-5">
            <v-card-title class="text-uppercase"
                >Cài đặt thiết bị cho cuộc gọi</v-card-title
            >
            <div ref="inputDevs">
                <v-card-text class="text-uppercase"
                    >Thiết bị microphone đầu vào</v-card-text
                >
                <div>
                    <!-- Làm select cho thiết bị -->
                    <v-select
                        v-model="selectAuInp"
                        :items="arrayAudioInput"
                        item-text="label"
                        item-value="deviceId"
                        label="Thiết bị microphone đầu vào"
                        return-object
                        dark
                    ></v-select>
                </div>
            </div>
            <div ref="videoINP" class="my-2">
                <v-card-text class="text-uppercase"
                    >Thiết bị video đầu vào</v-card-text
                >
                <div>
                    <!-- Làm select cho thiết bị -->
                    <v-select
                        v-model="selectVidInp"
                        :items="arrayVideoInput"
                        item-text="label"
                        item-value="deviceId"
                        label="Thiết bị video đầu vào"
                        return-object
                        dark
                    ></v-select>
                </div>
            </div>
            <div ref="audioOUTP">
                <v-card-text class="text-uppercase"
                    >Thiết bị âm thanh đầu ra</v-card-text
                >
                <div>
                    <!-- Làm select cho thiết bị -->
                    <v-select
                        v-model="selectAuOutp"
                        :items="arrayAudioOutput"
                        item-text="label"
                        item-value="deviceId"
                        label="Thiết bị âm thanh đầu ra"
                        return-object
                        dark
                    ></v-select>
                </div>
            </div>

            <v-card-actions class="pl-0">
                <v-btn color="primary" class="mr-2" @click="saveDevice"
                    >Lưu</v-btn
                >
                <v-btn color="pink" @click="openDialog = false">Đóng</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import chatCall from "../../mixin/servers/chatCall";
export default {
    props: ["dialogSettingCall"],
    mixins: [chatCall],
    data() {
        return {
            openDialog: false,
            arrayAudioInput: [],
            arrayAudioOutput: [],
            arrayVideoInput: [],
            selectAuInp: null,
            selectAuOutp: null,
            selectVidInp: null,
            loadedDevices: false,
        };
    },
    methods: {
        async start() {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                    video: true,
                })
                .then((stream) => {
                    this.getCameraSelection();
                })
                .catch((err) => console.log("no"));
            this.getCameraSelection();
        },
        async getCameraSelection() {
            this.loadedDevices = false;
            const devices = await navigator.mediaDevices.enumerateDevices();
            const def = this.getDefDevice(devices);
            const audioOutput = this.getSaveDevice(this.kind.a_o, def);
            const audioInput = this.getSaveDevice(this.kind.a_i, def);
            const videoInput = this.getSaveDevice(this.kind.v_i, def);
            let existAOP = false;
            let existAIP = false;
            let existVIP = false;
            if (audioOutput) {
                if (this.checkDeviceExist(devices, audioOutput.deviceId)) {
                    existAOP = true;
                    this.arrayAudioOutput.push(audioOutput);
                    this.selectAuOutp = audioOutput;
                }
            }
            if (audioInput) {
                if (this.checkDeviceExist(devices, audioInput.deviceId)) {
                    existAIP = true;
                    this.arrayAudioInput.push(audioInput);
                    this.selectAuInp = audioInput;
                }
            }
            if (videoInput) {
                if (this.checkDeviceExist(devices, videoInput.deviceId)) {
                    existVIP = true;
                    this.arrayVideoInput.push(videoInput);
                    this.selectVidInp = videoInput;
                }
            }
            devices.forEach((device, index) => {
                if (device.kind == "audioinput") {
                    let d_a_i = null;
                    if (existAIP) {
                        if (device.deviceId != audioInput.deviceId) {
                            this.arrayAudioInput.push(device);
                        }
                    } else {
                        d_a_i = def[this.kind.a_i];
                        if (d_a_i) {
                            this.storageDevice(d_a_i, this.kind.a_i);
                            this.arrayAudioInput.push(d_a_i);
                            if (device.deviceId != d_a_i.deviceId) {
                                this.arrayAudioInput.push(device);
                            }
                            this.selectAuOutp = d_a_i;
                        } else {
                            this.arrayAudioInput.push(device);
                            this.selectAuOutp = this.arrayAudioInput[0];
                            this.storageDevice(
                                this.arrayAudioInput[0],
                                this.kind.a_i
                            );
                        }
                    }
                }
                if (device.kind == "videoinput") {
                    if (existVIP) {
                        if (device.deviceId != videoInput.deviceId) {
                            this.arrayVideoInput.push(device);
                        }
                    } else {
                        const d_v_i = def[this.kind.v_i];
                        if (d_v_i) {
                            this.storageDevice(d_v_i, this.kind.v_i);
                            this.arrayVideoInput.push(d_v_i);
                            if (device.deviceId != d_v_i.deviceId) {
                                this.arrayVideoInput.push(device);
                            }
                            this.selectVidInp = d_v_i;
                        } else {
                            this.arrayVideoInput.push(device);
                            this.selectVidInp = this.arrayVideoInput[0];
                            this.storageDevice(
                                this.arrayVideoInput[0],
                                this.kind.v_i
                            );
                        }
                    }
                }
                if (device.kind == "audiooutput") {
                    if (existAOP) {
                        if (device.deviceId != audioOutput.deviceId) {
                            this.arrayAudioOutput.push(device);
                        }
                    } else {
                        const d_a_o = def[this.kind.a_o];
                        if (d_a_o) {
                            this.storageDevice(d_a_o, this.kind.a_o);
                            this.arrayAudioOutput.push(d_a_o);
                            if (device.deviceId != d_a_o.deviceId) {
                                this.arrayAudioOutput.push(device);
                            }
                            this.selectAuOutp = d_a_o;
                        } else {
                            this.arrayAudioOutput.push(device);
                            this.selectAuOutp = this.arrayAudioOutput[0];
                            this.storageDevice(
                                this.arrayAudioOutput[0],
                                this.kind.a_o
                            );
                        }
                    }
                }

                this.loadedDevices = true;
            });
        },
        storageDevice(device, kind) {
            localStorage.setItem(kind, JSON.stringify(device));
            return;
        },

        saveDevice() {
            this.storageDevice(this.selectAuInp, this.kind.a_i);
            this.storageDevice(this.selectVidInp, this.kind.v_i);
            this.storageDevice(this.selectAuOutp, this.kind.a_o);
        },
    },
    watch: {
        dialogSettingCall() {
            this.openDialog = this.dialogSettingCall;
        },
        openDialog(open) {
            this.$emit("setting-call", open);
            if (open) {
                this.start();
            }
        },
    },
};
</script>
<style lang="scss" scoped></style>
