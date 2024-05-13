<template>
  <div>
    <!-- The form component -->
    <TicketForm />
  </div>
</template>

<script>
import TicketForm from "~/components/TicketForm.vue";

export default {
  name: "IndexPage",
  components: {
    TicketForm,
  },
};
</script>

<style>
h1 {
  text-align: center;
}

button {
  margin: 10px;
}
.logo {
  display: block;
  margin: 0 auto;
  width: 20%;
}
</style>
