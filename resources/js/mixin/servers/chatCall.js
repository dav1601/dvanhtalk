import Log from "laravel-mix/src/Log";

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
        async getPermissions(facingMode = "user") {
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

            let valueVideo = true;
            if (this.isMobile) {
                valueVideo = {
                    facingMode: facingMode,
                };
            }
            const video = videoInput
                ? {
                      deviceId: videoInput.deviceId,
                      width: { ideal: 4096 },
                      height: { ideal: 2160 },
                  }
                : valueVideo;
            const audio = audioInput ? { deviceId: audioInput.deviceId } : true;
             
            return new Promise((resolve, reject) => {
                navigator.mediaDevices
                    .getUserMedia({
                        audio: audio,
                        video: video,
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
