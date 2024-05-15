import { shallowMount } from "@vue/test-utils";
import Dashboard from "../../pages/dashboard.vue";

// Test case 1 for checking if the dashboard shows a message when there are no tickets
describe("Dashboard.vue", () => {
  it("renders a message when there are no tickets", () => {
    // Mounting the dashboard component with an empty tickets array
    const wrapper = shallowMount(Dashboard, {
      data() {
        return {
          tickets: [],
        };
      },
    });

    // Checking if the dashboard shows a message with "No tickets found" when there are no tickets
    expect(wrapper.text()).toContain("No tickets found.");
  });

  // Test case 2 for checking if the dashboard shows the available tickets
  it("renders ticket details when tickets are present", () => {
    // Fake ticket data to be used in the test
    const tickets = [
      {
        id: 1,
        first_name: "Gibran",
        last_name: "Fallouh",
        email: "gibran@gmail.com",
        phone: "06812345678",
        company_name: "Eazyonline",
        message: "This is a test ticket",
        status: "open",
        priority: "high",
      },
    ];

    // Mounting the dashboard with the fake ticket data
    const wrapper = shallowMount(Dashboard, {
      data() {
        return {
          tickets,
        };
      },
    });

    // Check if the dashboard renders the fake ticket data and shows it
    expect(wrapper.text()).toContain("Gibran Fallouh");
    expect(wrapper.text()).toContain("gibran@gmail.com");
    expect(wrapper.text()).toContain("06812345678");
    expect(wrapper.text()).toContain("Eazyonline");
    expect(wrapper.text()).toContain("This is a test ticket");
    expect(wrapper.text()).toContain("open");
    expect(wrapper.text()).toContain("high");
  });
});
