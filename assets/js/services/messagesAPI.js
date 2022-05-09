import axios from "axios";
import { MESSAGES_API } from "../config";

function findAll() {
	return axios
		.get(MESSAGES_API)
		.then((response) => response.data["hydra:member"]);
}

function sendMessage(myMessage) {
	return axios.post(MESSAGES_API, {
		...myMessage,
		user: `/api/users/${myMessage.user}`
	})
    .then((response) => response.data);
}

export default {
	findAll: findAll,
	sendMessage: sendMessage,
};
