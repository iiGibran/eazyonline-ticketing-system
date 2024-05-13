<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div v-if="tickets.length === 0">
      <p>No tickets found.</p>
    </div>
    <!-- Display tickets -->
    <div v-for="ticket in tickets" :key="ticket.id" class="ticket">
      <h2>{{ ticket.first_name }} {{ ticket.last_name }}</h2>
      <p>Email: {{ ticket.email }}</p>
      <p>Phone: {{ ticket.phone }}</p>
      <p>Company: {{ ticket.company_name }}</p>
      <p>Message: {{ ticket.message }}</p>
      <p>
        Status:
        <span
          class="status-indicator"
          :class="{
            'status-open': ticket.status === 'open',
            'status-closed': ticket.status === 'closed',
          }"
        >
          {{ ticket.status }}
        </span>
      </p>
      <p>
        Priority:
        <span
          class="priority-indicator"
          :class="getPriorityClass(ticket.priority)"
        ></span>
        {{ ticket.priority }}
      </p>

      <!-- Edit button -->
      <button @click="editTicket(ticket)" class="edit-button">Edit</button>
      <button @click="deleteTicket(ticket.id)" class="delete-button">
        Delete
      </button>
    </div>
    <!-- Edit modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Edit Ticket</h2>
        <form @submit.prevent="saveEditedTicket" class="edit-form">
          <div class="form-group">
            <div class="name-group">
              <div class="form-group">
                <label for="editFirstName">First Name:</label>
                <input
                  type="text"
                  id="editFirstName"
                  v-model="editedTicket.first_name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="editLastName">Last Name:</label>
                <input
                  type="text"
                  id="editLastName"
                  v-model="editedTicket.last_name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="editEmail">Email:</label>
            <input
              type="email"
              id="editEmail"
              v-model="editedTicket.email"
              required
            />
          </div>
          <div class="form-group">
            <label for="editPhone">Phone Number:</label>
            <input
              type="text"
              id="editPhone"
              v-model="editedTicket.phone"
              required
            />
          </div>
          <div class="form-group">
            <label for="editCompanyName">Company Name:</label>
            <input
              type="text"
              id="editCompanyName"
              v-model="editedTicket.company_name"
              required
            />
          </div>
          <div class="form-group">
            <label for="editMessage">Message:</label>
            <textarea
              id="editMessage"
              v-model="editedTicket.message"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <div class="priority-status-group">
              <div class="priority-group">
                <label for="editPriority">Priority:</label>
                <select
                  id="editPriority"
                  v-model="editedTicket.priority"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="status-group">
                <label for="editStatus">Status:</label>
                <select id="editStatus" v-model="editedTicket.status" required>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
          <div class="buttons">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button @click="cancelEdit" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tickets: [],
      showEditModal: false,
      editedTicket: null,
    };
  },
  async mounted() {
    try {
      await this.fetchTickets();
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  },
  methods: {
    getPriorityClass(priority) {
      return {
        low: "priority-low",
        medium: "priority-medium",
        high: "priority-high",
      }[priority];
    },
    async fetchTickets() {
      try {
        const response = await this.$axios.$get("/api/tickets");
        this.tickets = response;
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    },
    editTicket(ticket) {
      this.editedTicket = { ...ticket };
      this.showEditModal = true;
    },
    async saveEditedTicket() {
      try {
        await this.$axios.$put(
          `/api/tickets/${this.editedTicket.id}`,
          this.editedTicket
        );
        this.showEditModal = false;
        await this.fetchTickets();
      } catch (error) {
        console.error("Error saving edited ticket:", error);
      }
    },
    cancelEdit() {
      this.showEditModal = false;
      this.editedTicket = null;
    },
    async deleteTicket(ticketId) {
      try {
        await this.$axios.$delete(`/api/tickets/${ticketId}`);
        this.tickets = this.tickets.filter((ticket) => ticket.id !== ticketId);
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.ticket {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.edit-button,
.delete-button {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button {
  background-color: #007bff;
  color: #fff;
}

.delete-button {
  background-color: #dc3545;
  color: #fff;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 50px;
  padding-right: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.edit-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.priority-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  align-items: center;
  display: inline-block;
}

.priority-low {
  background-color: green;
}

.priority-medium {
  background-color: orange;
}

.priority-high {
  background-color: red;
}

.status-indicator {
  font-size: 14px;
  font-weight: bold;
}

.status-open {
  color: green;
}

.status-closed {
  color: red;
}

.priority-status-group {
  display: flex;
  justify-content: space-between;
}

.priority-group,
.status-group {
  width: 48%;
}

.name-group {
  display: flex;
  justify-content: space-between;
}
</style>
