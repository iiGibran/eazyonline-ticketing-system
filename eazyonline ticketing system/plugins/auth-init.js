// plugins/auth-init.js

export default ({ store, $auth }) => {
  // On app start, run this logic
  window.onNuxtReady(() => {
    if ($auth.loggedIn) {
      store.commit("logIn");
    } else {
      store.commit("logOut");
    }
  });
};
