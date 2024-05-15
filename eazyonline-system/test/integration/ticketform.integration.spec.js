import { mount, createLocalVue } from "@vue/test-utils";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import TicketForm from "~/components/TicketForm.vue";
import Vue from "vue";
import VueAxios from "vue-axios";
const localVue = createLocalVue();
localVue.use(VueAxios, axios);

describe("TicketForm Integration Test", () => {
  let mock;

  beforeEach(() => {
    // Setup Axios mock before each test
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock after each test
    mock.reset();
  });

  // TEst case 1 checking if the form is submitted and a ticket was created successfully
  it("submits the form and creates a ticket successfully", async () => {
    // Mock the POST request to /api/create-ticket
    mock.onPost("/api/create-ticket").reply(200);

    // Mount the TicketForm component with the mock
    const wrapper = mount(TicketForm, {
      localVue,
      mocks: {
        $axios: axios,
      },
    });

    // Setting form input values
    await wrapper.setData({
      firstName: "Gibran",
      lastName: "Fallouh",
      companyName: "Eazyonline",
      email: "gibran@gmail.com",
      phone: "06812345678",
      message: "This is a test ticket",
    });

    // Simulate form submission
    await wrapper.find("form").trigger("submit.prevent");
    await Vue.nextTick();

    // Check that the form was submitted and reset
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].data).toContain("Gibran");
    expect(mock.history.post[0].data).toContain("Fallouh");
    expect(mock.history.post[0].data).toContain("Eazyonline");
    expect(mock.history.post[0].data).toContain("gibran@gmail.com");
    expect(mock.history.post[0].data).toContain("06812345678");
    expect(mock.history.post[0].data).toContain("This is a test ticket");

    // Check that the form fields were reset after successful submission
    expect(wrapper.vm.firstName).toBe("");
    expect(wrapper.vm.lastName).toBe("");
    expect(wrapper.vm.companyName).toBe("");
    expect(wrapper.vm.email).toBe("");
    expect(wrapper.vm.phone).toBe("");
    expect(wrapper.vm.message).toBe("");
  });

  // Test case 2, checking if an error message is displayed if the form submission fails
  it("displays an error message when the ticket creation fails", async () => {
    // Mock the POST request to /api/create-ticket
    mock.onPost("/api/create-ticket").reply(500);

    // Mount the TicketForm component with mock
    const wrapper = mount(TicketForm, {
      localVue,
      mocks: {
        $axios: axios,
      },
    });

    // Set form input values
    await wrapper.setData({
      firstName: "Test Name",
      lastName: "Test Last Name",
      companyName: "Test Company Name",
      email: "test@email.com",
      phone: "0612345678",
      message: "This is a test ticket",
    });

    // Simulate form submission failure
    await wrapper.find("form").trigger("submit.prevent");
    await Vue.nextTick();

    // Check if the error message is displayed
    await Vue.nextTick();
    expect(wrapper.text()).toContain(
      "Error creating ticket. Please try again."
    );
  });
});
