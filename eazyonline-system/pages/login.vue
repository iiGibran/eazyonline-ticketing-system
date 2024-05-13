<template>
  <div class="login-container">
    <h1>Login Page</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        });
        // Commit to Vuex store on successful login
        this.$store.commit("logIn");
        localStorage.setItem("isLoggedIn", true);
        // Redirect to dashboard
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
}

.login-form input[type="email"],
.login-form input[type="password"] {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #218838;
}
</style>
