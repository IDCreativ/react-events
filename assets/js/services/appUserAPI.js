import axios from "axios";
import { USER_CONNECTED } from "../config";

function findMe() {
    return axios
        .get(USER_CONNECTED)
        .then((response) => response.data);
}

export default {
    findMe: findMe,
}