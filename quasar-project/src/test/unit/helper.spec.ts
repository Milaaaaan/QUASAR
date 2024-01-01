import moment from "moment";
import helpers from "../../src/composables/helper"; 

describe("Helpers", () => {
  it("formats price correctly", () => {
    const formattedPrice = helpers.formatPrice(123.456);
    expect(formattedPrice).toBe("€123.46");
  });

  it("calculates date difference in days correctly", () => {
    const date1 = "2022-01-01";
    const date2 = "2022-01-05";
    const daysDifference = helpers.dateDifferenceInDays(date1, date2);
    expect(daysDifference).toBe(5);
  });

  it("cleans date correctly", () => {
    const cleanedDate = helpers.clean("2022-01-01");
    expect(cleanedDate).toBe("2022-01-01");
  });

  it("gets time ago correctly", () => {
    const dateTimeString = moment().subtract(2, "days").toISOString();
    const timeAgo = helpers.getTimeAgo(dateTimeString);
    expect(timeAgo).toBe("2 dagen geleden");
  });
});
