<template>
  <div class="create-ticket-form">
    <h1>Create Ticket</h1>
    <form @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          v-model="firstName"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          v-model="lastName"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="companyName">Company Name:</label>
        <input
          type="text"
          id="companyName"
          v-model="companyName"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="phone">Phone Number:</label>
        <input
          type="text"
          id="phone"
          v-model="phone"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea
          id="message"
          v-model="message"
          required
          class="form-control"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phone: "",
      message: "",
      errorMessage: "",
    };
  },
  methods: {
    // submission of the form will create a ticket with the same data entered in the form
    async submitForm() {
      try {
        await this.$axios.post("/api/create-ticket", {
          firstName: this.firstName,
          lastName: this.lastName,
          companyName: this.companyName,
          email: this.email,
          phone: this.phone,
          message: this.message,
        });
        alert("Ticket created successfully!");
        // after the successful alert clear out the form fields
        this.firstName = "";
        this.lastName = "";
        this.companyName = "";
        this.email = "";
        this.phone = "";
        this.message = "";
        this.errorMessage = "";
      } catch (error) {
        console.error("Error creating ticket:", error);
        this.errorMessage = "Error creating ticket. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.create-ticket-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.btn-primary {
  background-color: #1e1e1e;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #363636;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>
