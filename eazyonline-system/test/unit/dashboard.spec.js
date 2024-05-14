import { shallowMount } from "@vue/test-utils";
import Dashboard from "../../pages/dashboard.vue";

// Test 1 for checking if the dashboard shows a message when there are no tickets
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

  // Test 2 for checking if the dashboard shows the available tickets
  it("renders ticket details when tickets are present", () => {
    // Fake ticket data to be used in the test
    const tickets = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        company_name: "Example Inc.",
        message: "This is a test ticket.",
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
    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("john.doe@example.com");
    expect(wrapper.text()).toContain("123-456-7890");
    expect(wrapper.text()).toContain("Example Inc.");
    expect(wrapper.text()).toContain("This is a test ticket.");
    expect(wrapper.text()).toContain("open");
    expect(wrapper.text()).toContain("high");
  });
});
