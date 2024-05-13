// store/index.js
export const state = () => ({
  isLoggedIn: false,
});

export const mutations = {
  logIn(state) {
    state.isLoggedIn = true;
  },
  logOut(state) {
    state.isLoggedIn = false;
  },
};
