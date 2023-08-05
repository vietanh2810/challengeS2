import { createStore } from "vuex";
import { auth } from "./auth.module";

const store = createStore({
    state: {
        wsMessage: null,
    },
    mutations: {
        SET_WS_MESSAGE(state, message) {
            state.wsMessage = message;
        },
    },
    actions: {
        handleWSMessage({ commit }, message) {
            commit("SET_WS_MESSAGE", message);
        },
    },
    modules: {
        auth,
    },
});

export default store;

