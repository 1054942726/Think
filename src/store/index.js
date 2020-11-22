import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isSee: false
    },
    mutations: {
        changeSee(state) {
            state.isSee = !state.isSee;
        }
    }
})