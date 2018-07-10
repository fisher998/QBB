const contract = {
    state: {
        idx: null,
    },
    mutations: {
        SET_IDX: (state, idx) => {
            state.idx = idx;
        }
    },
    actions: {
        set_idx ({commit}, idx) {
            commit('SET_IDX', idx)
        },
    }
}
export default contract;
