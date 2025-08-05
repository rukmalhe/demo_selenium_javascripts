// adminLoginTest.spec.js
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const {
  fillAndSubmitLoginForm,
  clickElementSafely,
  findVisibleElement,
  loginAndAssert,
  retryUntilLocatedAndVisible
} = require('./helpers');

describe('AdminLoginTest', function () {
  this.timeout(60000);
  let driver;
  let vars;

  beforeEach(async function () {
    driver = await new Builder().forBrowser('firefox').build();
    vars = {
      USERNAME: "rukmal",
      PASSWORD: "password",
      WRONG_USERNAME: "rukmal1111",
      WRONG_PASSWORD: "password1111"
    };
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('AdminLoginTest', async function () {
    await driver.get("https://relaxed-trifle-0879d7.netlify.app/login");
    await driver.manage().window().setRect({ width: 1158, height: 692 });

    assert.strictEqual(await driver.getTitle(), "Manage Vacancies");
    assert.strictEqual(
      await driver.findElement(By.css("h2")).getText(),
      "Welcome, Please Login.!"
    );

    // Valid login
    await loginAndAssert(driver, vars.USERNAME, vars.PASSWORD, true);

    // Logout with retry
    await driver.sleep(1000);
    await retryUntilLocatedAndVisible(driver, By.id('logout'));
    await clickElementSafely(driver, By.id('logout'));

    // Post logout validation with retry and logs
    console.log("🔍 Waiting for logout confirmation (h1)...");
    const pageHeading = await retryUntilLocatedAndVisible(driver, By.css('h1'), 4, 5000);
    assert.strictEqual(await pageHeading.getText(), "Welcome ! North West Recruitment");

    const pageTitle = await driver.getTitle();
    assert.strictEqual(pageTitle, "North West Recruitment Service");

    // Return to login with retry
    await driver.sleep(2000);
    const loginLink = await retryUntilLocatedAndVisible(driver, By.linkText("Login"), 3, 4000);
    await loginLink.click();

    // Invalid username
    await loginAndAssert(driver, vars.WRONG_USERNAME, vars.PASSWORD, false);

    // Invalid password
    await loginAndAssert(driver, vars.USERNAME, vars.WRONG_PASSWORD, false);
  });
});
