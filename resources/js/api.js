import axios from "axios";
const api = axios.create({
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
});
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;
