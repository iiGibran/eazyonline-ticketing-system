<template>
  <nav>
    <ul>
      <li>
        <nuxt-link to="/" exact-active-class="active-link">Home</nuxt-link>
      </li>
      <li v-if="$auth.loggedIn">
        <nuxt-link to="/dashboard" exact-active-class="active-link"
          >Dashboard</nuxt-link
        >
      </li>
      <li v-if="!$auth.loggedIn">
        <nuxt-link to="/signup" class="nav-button">Sign Up</nuxt-link>
      </li>
      <li v-if="!$auth.loggedIn">
        <nuxt-link to="/login" class="nav-button">Login</nuxt-link>
      </li>
      <li v-if="$auth.loggedIn">
        <button @click="logout" class="nav-button">Logout</button>
      </li>
      <!-- Logo image with link to homepage -->
      <li class="logo-container">
        <nuxt-link to="/">
          <img
            src="https://cdn1.site-media.eu/images/0/8572152/Neweazyv2dblbdik5-svg1.png"
            alt="Eazyonline logo"
            class="logo"
          />
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    logout() {
      this.$auth.logout();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.logo-container {
  margin-left: auto;
}

.logo {
  width: 150px;
  height: auto;
}

nav {
  background-color: #313131;
  padding: 5px 50px;
  border-radius: 5px;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

nav ul li {
  margin-right: 20px;
}

nav ul li a {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
}

.nav-button:hover {
  background-color: #495057;
  border-radius: 5px;
}

.active-link,
.nav-button.active-link {
  background-color: #495057;
  color: #ffffff;
  border-radius: 5px;
}

.nav-button {
  padding: 8px 16px;
  background-color: transparent;
  border: 2px solid #ffffff;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  color: #343a40;
  background-color: #ffffff;
}

.nav-button:hover {
  color: #fff;
  background-color: #343a40;
}
</style>
