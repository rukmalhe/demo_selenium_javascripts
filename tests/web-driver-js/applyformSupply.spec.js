// jobApplicationTest.spec.js
const { Builder, By } = require("selenium-webdriver");
const path = require("path");
const {
  clickElementSafely,
  findVisibleElement,
  retryUntilLocatedAndVisible
} = require("./helpers");

// Test data for the job application
vars = {
  startDate: "2025-08-20",
  firstName: "Rukmal",
  lastName: "Hewawasam",
  email: "rukmal.hewawasam@gmail.com",
  phone: "02108781236",
  salutation: "Mr.",
}
// Paths to test filesß
const cvPath = path.resolve(__dirname, "../../public/files/Rasika_Hewawasam_CV.pdf");
const addFilePath = path.resolve(__dirname, "../../public/files/Additional_File.pdf");

describe("Apply for mSupply Job Vacancy", function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("firefox").build();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("should fill and submit job application form", async () => {
    // 1. Navigate to site
    await driver.get("https://relaxed-trifle-0879d7.netlify.app/");

    // 2. Scroll to jobs
    await driver.executeScript("window.scrollTo(0,571)");

    // 3. Click Sort by Office link
    await driver.sleep(1000); // Ensure page is loaded
    await clickElementSafely(driver, By.css("button.active"));

    // 4. Click Sort by Office link
    await driver.sleep(1000); // Ensure page is loaded
    await clickElementSafely(driver, By.css('button[data-filter="Office"]'));

    // 5. Check the vacancy by company name
    // Click Apply button for the first vacancy where h3 contains 'mSupply'
    await clickElementSafely(
      driver,
      By.xpath('(//h3[contains(text(), "mSupply")]/button[@class="apply-vacancy-btn"])[1]')
    );

    // 6. Assert the form is visible, and verify the heading
    const formHeading = await findVisibleElement(driver, By.css(".overlay__title"));
    const headingText = (await formHeading.getText()).trim();
    if (headingText !== "mSupply") {
      throw new Error("Form heading does not match expected text");
    }
    console.log("Form heading verified:", headingText);

    // 7. Visa sponsorship - Yes
    await clickElementSafely(driver, By.css("input[name='visa-sponsorship-vacancy'][value='yes']"));

    // 8. Notice period - Immediate
    await clickElementSafely(driver, By.css("input[name='notice-period-vacancy'][value='Immediate']"));

    // 9. Start date
    await findVisibleElement(driver, By.name("start-date-vacancy")).then(el => el.sendKeys(vars.startDate));

    // 10. Internal applicant - No
    await clickElementSafely(driver, By.css("input[name='internal-candidate-vacancy'][value='no']"));

    // 11. Salutation
    await findVisibleElement(driver, By.id("salutation-vacancy-id")).then(el => el.sendKeys(vars.salutation));

    // 12. First & last name
    await findVisibleElement(driver, By.id("first-name-vacancy")).then(el => el.sendKeys(vars.firstName));
    await findVisibleElement(driver, By.id("last-name-vacancy")).then(el => el.sendKeys(vars.lastName));

    // 13. Email & phone
    await findVisibleElement(driver, By.id("email-vacancy-id")).then(el => el.sendKeys(vars.email));
    await findVisibleElement(driver, By.id("phone-vacancy-id")).then(el => el.sendKeys(vars.phone));

    // 14. Upload CV (required)
    await driver.sleep(2000); // Wait for CV upload to complete
    await findVisibleElement(driver, By.id("cv-upload-id")).then(el => el.sendKeys(cvPath));

    // 15. Optional additional file
    await driver.sleep(2000); // Wait for CV upload to complete
    await findVisibleElement(driver, By.id("additional-files-vacancy-id")).then(el => el.sendKeys(addFilePath));

    // 12. Required checkboxes
    await clickElementSafely(driver, By.id("consent-privacy-vacancy"));
    await clickElementSafely(driver, By.css("input[name='consent-store-details-vacancy']"));
    // Optional future contact
    await clickElementSafely(driver, By.id("consent-future-contact-vacancy-id"));

    // 13. Submit
    await clickElementSafely(driver, By.id("form-submit-button-vacancy-id"));

    // 14. Verify Thank You message
    const thankYou = await retryUntilLocatedAndVisible(driver, By.id("thank-you-vacancy-id"));
    const thankYouText = await thankYou.getText();
    if (!thankYouText.includes("Thank you for your application")) {
      throw new Error("Application submission failed: Thank You message not found");
    }
  });
});
