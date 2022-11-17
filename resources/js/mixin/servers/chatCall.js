export default {
    data() {
        return {
            kind: {
                a_i: "audioinput",
                a_o: "audiooutput",
                v_i: "videoinput",
            },
        };
    },
    methods: {
        getDefDevice(_devices) {
            let devices = {};
            devices[this.kind.v_i] = null;
            devices[this.kind.a_o] = null;
            devices[this.kind.a_i] = null;
            _devices.forEach((element) => {
                switch (element.deviceId) {
                    case "default":
                        switch (element.kind) {
                            case this.kind.v_i:
                                devices[this.kind.v_i] = element;
                                break;
                            case this.kind.a_o:
                                devices[this.kind.a_o] = element;
                                break;
                            case this.kind.a_i:
                                devices[this.kind.a_i] = element;
                                break;
                            default:
                                break;
                        }
                        break;

                    default:
                        break;
                }
            });
            return devices;
        },
        checkDeviceExist(devices, deviceId) {
            const index = devices.findIndex((dev) => {
                return dev.deviceId == deviceId;
            });
            return index === -1 ? false : true;
        },
        getSaveDevice(_kind = "", _def) {
            return this.$helpers.isEmpty(localStorage.getItem(_kind))
                ? _def[_kind]
                : JSON.parse(localStorage.getItem(_kind));
        },
        popupCenter(
            url,
            title,
            w = (document.documentElement.clientWidth * 60) / 100,
            h = (document.documentElement.clientHeight * 70) / 100
        ) {
            // Fixes dual-screen position                             Most browsers      Firefox
            const dualScreenLeft =
                window.screenLeft !== undefined
                    ? window.screenLeft
                    : window.screenX;
            const dualScreenTop =
                window.screenTop !== undefined
                    ? window.screenTop
                    : window.screenY;

            const width = window.innerWidth
                ? window.innerWidth
                : document.documentElement.clientWidth
                ? document.documentElement.clientWidth
                : screen.width;
            const height = window.innerHeight
                ? window.innerHeight
                : document.documentElement.clientHeight
                ? document.documentElement.clientHeight
                : screen.height;

            const systemZoom = width / window.screen.availWidth;
            const left = (width - w) / 2 / systemZoom + dualScreenLeft;
            const top = (height - h) / 2 / systemZoom + dualScreenTop;
            const newWindow = window.open(
                url,
                title,
                `
              scrollbars=yes,
              width=${w / systemZoom},
              height=${h / systemZoom},
              top=${top},
              left=${left}
              `
            );

            if (window.focus) newWindow.focus();
        },
        async getPermissions(front = true) {
            // Older browsers might not implement mediaDevices at all, so we set an empty object first
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }

            // Some browsers partially implement mediaDevices. We can't just assign an object
            // with getUserMedia as it would overwrite existing properties.
            // Here, we will just add the getUserMedia property if it's missing.
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function (constraints) {
                    // First get ahold of the legacy getUserMedia, if present
                    const getUserMedia =
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;

                    // Some browsers just don't implement it - return a rejected promise with an error
                    // to keep a consistent interface
                    if (!getUserMedia) {
                        return Promise.reject(
                            new Error(
                                "getUserMedia is not implemented in this browser"
                            )
                        );
                    }

                    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                    return new Promise((resolve, reject) => {
                        getUserMedia.call(
                            navigator,
                            constraints,
                            resolve,
                            reject
                        );
                    });
                };
            }
            navigator.mediaDevices.getUserMedia =
                navigator.mediaDevices.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            const devices = await navigator.mediaDevices.enumerateDevices();
            const def = this.getDefDevice(devices);
            const audioOutput = this.getSaveDevice(this.kind.a_o, def);
            const audioInput = this.getSaveDevice(this.kind.a_i, def);
            const videoInput = this.getSaveDevice(this.kind.v_i, def);
            let constraintVideo = true;
            let constraintAudio = true;
            if (!this.isMobile && this.isIpadProUp) {
                constraintAudio = audioInput
                    ? {
                          deviceId: audioInput.deviceId,
                      }
                    : true;

                constraintVideo = videoInput
                    ? {
                          deviceId: videoInput.deviceId,
                      }
                    : true;
                if (audioOutput) {
                    const audio = document.createElement("audio");
                    await audio.setSinkId(audioOutput.deviceId);
                }
            }
            return new Promise((resolve, reject) => {
                navigator.mediaDevices
                    .getUserMedia({
                        audio: constraintAudio,
                        video: constraintVideo,
                    })
                    .then((stream) => {
                        resolve(stream);
                    })
                    .catch((err) => {
                        reject(err);
                        //   throw new Error(`Unable to fetch stream ${err}`);
                    });
            });
        },
    },
};
