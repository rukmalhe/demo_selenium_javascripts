// adminLoginTest.spec.js
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { fillAndSubmitLoginForm, clickElementSafely } = require('./helpers');


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
    assert.strictEqual(await driver.findElement(By.css("h2")).getText(), "Welcome, Please Login.!");

    // Valid login
    await fillAndSubmitLoginForm(driver, vars.USERNAME, vars.PASSWORD);

    const homeLinkText = await driver.findElement(By.css("a.small-link")).getText();
    assert.strictEqual(homeLinkText, "« Back to the Home Page");

    // Logout
    await clickElementSafely(driver, By.id('logout'));

    await driver.wait(until.elementLocated(By.css('h1')), 15000);
    const pageHeading = await driver.findElement(By.css('h1')).getText();
    assert.strictEqual(pageHeading, "Welcome ! North West Recruitment");

    const pageTitle = await driver.getTitle();
    assert.strictEqual(pageTitle, "North West Recruitment Service");

    // Return to login
    const loginLink = await driver.findElement(By.linkText("Login"));
    await driver.wait(until.elementIsVisible(loginLink), 15000);
    await loginLink.click();

    // Invalid username
    await fillAndSubmitLoginForm(driver, vars.WRONG_USERNAME, vars.PASSWORD);

    const errorPara = await driver.wait(
      until.elementLocated(By.css("#login-error-message > p")),
      15000
    );
    await driver.wait(until.elementIsVisible(errorPara), 15000);
    const errorText = (await errorPara.getText()).trim();
    console.log("🔍 Actual error message:", JSON.stringify(errorText));
    assert.strictEqual(errorText, "Invalid username or password. Please try again!.");

    // Invalid password
    await fillAndSubmitLoginForm(driver, vars.USERNAME, vars.WRONG_PASSWORD);
    const errorText2 = (await driver.findElement(By.css("#login-error-message > p"))).getText();
    assert.strictEqual((await errorText2).trim(), "Invalid username or password. Please try again!.");
  });
});
