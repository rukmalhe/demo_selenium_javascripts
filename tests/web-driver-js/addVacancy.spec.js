// addVacancy.spec.js - Refactored with helper support
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');
const {
  fillAndSubmitLoginForm,
  findVisibleElement,
  waitForPhotoPreview
} = require('./helpers');

const imagePath = path.resolve(__dirname, '../../public/images/Fallback.jpg');

describe('Add Vacancy', function () {
  this.timeout(60000);
  let driver;
  let vars;

  beforeEach(async function () {
    driver = await new Builder().forBrowser('firefox').build();
    vars = {
      USERNAME: "rukmal",
      PASSWORD: "password",
      COMPANY_NAME: "mSupply",
      VACANCY_DETAIL: `Would you like to do something different? Ideally something that makes for a better world? Us too...`,
      RATE: "$65-$70"
    };
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('Add Vacancy', async function () {
    await driver.get("https://relaxed-trifle-0879d7.netlify.app/login");
    await driver.manage().window().setRect({ width: 1280, height: 800 });

    // Login using helper
    await fillAndSubmitLoginForm(driver, vars.USERNAME, vars.PASSWORD);

    // Navigate to Add Vacancy
    const addVacancyLink = await findVisibleElement(driver, By.linkText("Add Vacancy"));
    await addVacancyLink.click();

    // Assert Add Vacancy heading
    const heading = await driver.findElement(By.css(".intro-feature")).getText();
    assert.strictEqual(heading, "Add Vacancy");

    // Fill form fields
    await driver.findElement(By.id("CompanyName")).sendKeys(vars.COMPANY_NAME);
    await driver.findElement(By.id("VacancyDescription")).sendKeys(vars.VACANCY_DETAIL);

    // File Upload
    // Wait for Cloudinary signature to be ready
    await driver.sleep(5000); // Give time for signature fetch

    const fileInput = await driver.findElement(By.id("add-vacancy-photo"));
    await fileInput.sendKeys(imagePath);
    console.log('✅ File sent to input. Waiting for Cloudinary preview...');

    // Wait and assert preview loaded
    await waitForPhotoPreview(driver);
    const previewImg = await driver.findElement(By.css("#photo-preview img"));
    const imgSrc = await previewImg.getAttribute("src");
    assert(imgSrc.includes("res.cloudinary.com/dnf2dypvu/image/upload"), "❌ Cloudinary image not previewed.");
    console.log("✅ Image preview success with src:", imgSrc);

    // Date fields
    await driver.findElement(By.id("published-date-vacancy")).sendKeys("2025-11-30");
    await driver.findElement(By.id("expiry-date-vacancy")).sendKeys("2025-11-30");

    // Dropdown
    const businessDropdown = await driver.findElement(By.id("Business"));
    await businessDropdown.findElement(By.xpath("//option[. = 'Office']")).click();

    // Pay rate
    await driver.findElement(By.id("PayRate")).sendKeys(vars.RATE);

    // Submit
    await driver.findElement(By.id("submit-btn")).click();
  });
});