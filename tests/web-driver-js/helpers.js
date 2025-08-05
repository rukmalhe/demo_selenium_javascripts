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
    console.warn("Standard click failed, trying JS click");
    await driver.executeScript("arguments[0].click();", element);
  }
}

async function findVisibleElement(driver, locator, timeout = 20000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

async function waitForPhotoPreview(driver, maxAttempts = 5, interval = 2000) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const preview = await driver.findElement(By.id("photo-preview"));
    const html = await preview.getAttribute("innerHTML");
    if (html.includes("img")) return true;
    await driver.sleep(interval);
    attempts++;
  }
  throw new Error("File preview did not appear within expected time.");
}

async function loginAndAssert(driver, username, password, success = true) {
  await fillAndSubmitLoginForm(driver, username, password);
  if (success) {
    const homeLink = await findVisibleElement(driver, By.css("a.small-link"));
    const text = await homeLink.getText();
    if (text !== "« Back to the Home Page") {
      throw new Error("Login did not navigate to Home Page");
    }
  } else {
    const errorPara = await findVisibleElement(driver, By.css("#login-error-message > p"));
    const message = await errorPara.getText();
    if (message.trim() !== "Invalid username or password. Please try again!.") {
      throw new Error("Expected error message not found");
    }
  }
}

async function retryUntilLocatedAndVisible(driver, locator, retries = 5, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const element = await driver.wait(until.elementLocated(locator), 10000);
      await driver.wait(until.elementIsVisible(element), 10000);
      return element;
    } catch (err) {
      if (attempt === retries) throw err;
      await driver.sleep(delay);
    }
  }
}


module.exports = {
  fillAndSubmitLoginForm,
  clickElementSafely,
  findVisibleElement,
  retryUntilLocatedAndVisible,
  waitForPhotoPreview,
  loginAndAssert
};
