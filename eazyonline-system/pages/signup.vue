<template>
  <div class="signup-container">
    <h1>Signup Page</h1>
    <form @submit.prevent="signup" class="signup-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group" v-if="showVerification">
        <label for="verificationCode">Verification Code:</label>
        <input
          type="text"
          id="verificationCode"
          v-model="verificationCode"
          required
        />
      </div>
      <button
        v-if="!showVerification"
        @click.prevent="sendVerificationCode"
        class="btn"
      >
        Send Verification Code
      </button>
      <button v-if="showVerification" type="submit" class="btn">Signup</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      verificationCode: "",
      showVerification: false,
      errorMessage: "",
    };
  },
  methods: {
    validateEmail() {
      // Check if the email ends with @eazyonline.nl
      return this.email.endsWith("@eazyonline.nl");
    },
    validatePassword() {
      // Check if the password is at least 6 characters
      return this.password.length >= 6;
    },
    async sendVerificationCode() {
      try {
        if (!this.validateEmail()) {
          this.errorMessage = "Email must be from the domain @eazyonline.nl";
          return;
        }

        await this.$axios.post("/api/send-verification-code", {
          email: this.email,
        });
        // Show verification code field after sending verification code
        this.showVerification = true;
        this.errorMessage = "";
      } catch (error) {
        console.error("Error sending verification code:", error);
        this.errorMessage =
          "Error sending verification code. Please try again.";
      }
    },
    async signup() {
      try {
        if (!this.validateEmail()) {
          this.errorMessage = "Email must be end with @eazyonline.nl";
          return;
        }

        if (!this.validatePassword()) {
          this.errorMessage = "Password must be at least 6 characters long";
          return;
        }

        await this.$axios.$post("/api/signup", {
          email: this.email,
          password: this.password,
        });
        // Update Vuex state after successful signup
        this.$store.commit("logIn");
        localStorage.setItem("isLoggedIn", true);
        // Redirect to login page
        this.$router.push("/login");
      } catch (error) {
        console.error("Error signing up:", error);
        this.errorMessage = "Error signing up. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.signup-form .form-group {
  margin-bottom: 20px;
}

.signup-form label {
  display: block;
  margin-bottom: 5px;
}

.signup-form input[type="email"],
.signup-form input[type="password"],
.signup-form input[type="text"] {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>
