// helpers.js
const { By, until } = require("selenium-webdriver");

async function fillAndSubmitLoginForm(driver, username, password) {
  const usernameField = await driver.wait(until.elementLocated(By.id("userName")), 15000);
  await driver.wait(until.elementIsVisible(usernameField), 15000);
  await usernameField.clear();
  await usernameField.sendKeys(username);

  const passwordField = await driver.wait(until.elementLocated(By.id("password")), 5000);
  await driver.wait(until.elementIsVisible(passwordField), 15000);
  await passwordField.clear();
  await passwordField.sendKeys(password);

  const loginBtn = await driver.wait(until.elementLocated(By.css(".btn-1")), 15000);
  await driver.wait(until.elementIsVisible(loginBtn), 15000);
  await loginBtn.click();
}

async function clickElementSafely(driver, locator) {
  const element = await driver.wait(until.elementLocated(locator), 15000);
  await driver.wait(until.elementIsVisible(element), 15000);
  await driver.wait(until.elementIsEnabled(element), 15000);
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
  await driver.sleep(300);
  try {
    await element.click();
  } catch (error) {
    console.warn("⚠ Standard click failed, trying JS click");
    await driver.executeScript("arguments[0].click();", element);
  }
}

module.exports = {
  fillAndSubmitLoginForm,
  clickElementSafely
};
