export default {
    methods: {
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
        async getPermissions() {
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
            const audioInput = JSON.parse(localStorage.getItem("audioInput"));
            const videoInput = JSON.parse(localStorage.getItem("videoInput"));
            const devices = await navigator.mediaDevices.enumerateDevices();
            let existDevAu = false;
            let existDevVid = false;
            if (audioInput && !this.$helpers.isEmpty(audioInput)) {
                const check1 = devices.filter((dev) => {
                    return dev.deviceId == audioInput.deviceId;
                });
                const check2 = devices.filter((dev) => {
                    return dev.deviceId == videoInput.deviceId;
                });
                if (check1) {
                    existDevAu = true;
                }
                if (check2) {
                    existDevVid = true;
                }
            }
            console.log({
                ex1: existDevAu,
                ex2: existDevVid,
            });
            const video =
                videoInput && existDevVid ? videoInput.deviceId : "undefined";
            const audio =
                audioInput && existDevAu ? audioInput.deviceId : "undefined";
            console.log({
                dev1: video,
                dev2: audio,
                full1: videoInput,
                full2: audioInput,
            });
            return new Promise((resolve, reject) => {
                navigator.mediaDevices
                    .getUserMedia({
                        video: {
                            deviceId: video ? { exact: video } : undefined,
                        },
                        audio: {
                            deviceId: audio ? { exact: audio } : undefined,
                        },
                    })
                    .then((stream) => {
                        console.log({
                            stream: stream,
                        });
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
