window._lodash = require("lodash");

try {
    require("bootstrap");
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require("axios");
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.interceptors.response.use(
    (response) => {
        if (response.status === 401) {
            return (window.location.href = `${window.location.protocol}//${window.location.hostname}/login`);
        }

        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            return (window.location.href = `${window.location.protocol}//${window.location.hostname}/login`);
        }

        return Promise.reject(error);
    }
);
/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from "laravel-echo";
window.Echo = new Echo({
    broadcaster: "socket.io",
    host: `${window.location.protocol}//${window.location.hostname}:${process.env.MIX_FRONTEND_PORT}`,
});
