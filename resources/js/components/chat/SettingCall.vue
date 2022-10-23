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
export default {
    props: ["dialogSettingCall"],
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
            console.log("get");
            const devices = await navigator.mediaDevices.enumerateDevices();
            // localStorage.removeItem("audioOutput");
            // localStorage.removeItem("audioInput");
            // localStorage.removeItem("videoInput");
            const audioOutput = this.$helpers.isEmpty(
                localStorage.getItem("audioOutput")
            )
                ? null
                : JSON.parse(localStorage.getItem("audioOutput"));

            const audioInput = this.$helpers.isEmpty(
                localStorage.getItem("audioInput")
            )
                ? null
                : JSON.parse(localStorage.getItem("audioInput"));

            const videoInput = this.$helpers.isEmpty(
                localStorage.getItem("videoInput")
            )
                ? null
                : JSON.parse(localStorage.getItem("videoInput"));

            let existAOP = false;
            let existAIP = false;
            let existVIP = false;
            console.log({
                dev1: audioOutput,
                dev2: audioInput,
                dev3: videoInput,
                devices: devices,
            });
            if (audioOutput && !this.$helpers.isEmpty(audioOutput)) {
                if (this.checkExist(devices, audioOutput.deviceId)) {
                    existAOP = true;
                    this.arrayAudioOutput.push(audioOutput);
                    this.selectAuOutp = audioOutput;
                }
            }
            if (audioInput && !this.$helpers.isEmpty(audioInput)) {
                if (this.checkExist(devices, audioInput.deviceId)) {
                    existAIP = true;
                    this.arrayAudioInput.push(audioInput);
                    this.selectAuInp = audioInput;
                }
            }
            if (videoInput && !this.$helpers.isEmpty(videoInput)) {
                if (this.checkExist(devices, videoInput.deviceId)) {
                    existVIP = true;
                    this.arrayVideoInput.push(videoInput);
                    this.selectVidInp = videoInput;
                }
            }

            let hdef1 = false;
            let hdef2 = false;
            let hdef3 = false;
            devices.forEach((device, index) => {
                if (device.kind == "audioinput") {
                    if (audioInput && existAIP) {
                        if (device.deviceId != audioInput.deviceId) {
                            this.arrayAudioInput.push(this.createObj(device));
                        }
                    } else {
                        if (device.deviceId == "default") {
                            localStorage.setItem(
                                "audioInput",
                                this.createObj(device, true)
                            );
                            this.selectAuInp = device.deviceId;
                        }
                        this.arrayAudioInput.push(this.createObj(device));
                    }
                    if (device.deviceId == "default") {
                        hdef1 = true;
                    }
                }
                if (device.kind == "videoinput") {
                    if (videoInput && existVIP) {
                        if (device.deviceId != videoInput.deviceId) {
                            this.arrayVideoInput.push(this.createObj(device));
                        }
                    } else {
                        if (device.deviceId == "default") {
                            localStorage.setItem(
                                "videoInput",
                                this.createObj(device, true)
                            );
                            this.selectVidInp = device.deviceId;
                        }
                        this.arrayVideoInput.push(this.createObj(device));
                    }
                    if (device.deviceId == "default") {
                        hdef2 = true;
                    }
                }
                if (device.kind == "audiooutput") {
                    if (audioOutput && existAOP) {
                        if (device.deviceId != audioOutput.deviceId) {
                            this.arrayAudioOutput.push(this.createObj(device));
                        }
                    } else {
                        if (device.deviceId == "default") {
                            localStorage.setItem(
                                "audioOutput",
                                this.createObj(device, true)
                            );
                            this.selectAuOutp = device.deviceId;
                        }
                        this.arrayAudioOutput.push(this.createObj(device));
                    }
                    if (device.deviceId == "default") {
                        hdef3 = true;
                    }
                }
                if (
                    (!hdef1 && !audioOutput) ||
                    this.$helpers.isEmpty(audioInput)
                ) {
                    if (this.arrayAudioInput.length > 0) {
                        localStorage.setItem(
                            "audioInput",
                            this.createObj(this.arrayAudioInput[0], true)
                        );
                        this.selectAuInp = this.arrayAudioInput[0];
                    } else {
                        localStorage.setItem("audioInput", null);
                        this.selectAuInp = null;
                    }
                }
                if (
                    (!hdef2 && !videoInput) ||
                    this.$helpers.isEmpty(videoInput)
                ) {
                    if (this.arrayVideoInput.length > 0) {
                        localStorage.setItem(
                            "videoInput",
                            this.createObj(this.arrayVideoInput[0], true)
                        );
                        this.selectVidInp = this.arrayVideoInput[0];
                    } else {
                        localStorage.setItem("videoInput", null);
                        this.selectVidInp = null;
                    }
                }
                if (
                    (!hdef3 && !audioOutput) ||
                    this.$helpers.isEmpty(audioOutput)
                ) {
                    if (this.arrayAudioOutput.length > 0) {
                        localStorage.setItem(
                            "videoInput",
                            this.createObj(this.arrayAudioOutput[0], true)
                        );
                        this.selectAuOutp = this.arrayAudioOutput[0];
                    } else {
                        localStorage.setItem("audioOutput", null);
                        this.selectAuOutp = null;
                    }
                }
                this.loadedDevices = true;
            });
        },
        createObj(device, stringify = false) {
            const data = {
                deviceId: device.deviceId,
                kind: device.kind,
                label: device.label,
                groupId: device.groupId,
            };
            if (stringify) {
                return JSON.stringify(data);
            }
            return data;
        },
        checkExist(devices, deviceId) {
            return devices.filter((dev) => {
                return dev.deviceId == deviceId;
            });
        },
        saveDevice() {
            localStorage.setItem(
                "videoInput",
                this.createObj(this.selectVidInp, true)
            );
            localStorage.setItem(
                "audioInput",
                this.createObj(this.selectAuInp, true)
            );
            localStorage.setItem(
                "audioOutput",
                this.createObj(this.selectAuOutp, true)
            );
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
