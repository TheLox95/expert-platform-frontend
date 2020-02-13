import puppeteer from 'puppeteer';

describe('Login', () => {
  test('cancel form OK', async () => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 900
      },
      userAgent: ''
    });

    await page.goto('http://localhost:3000/');

    await page.waitForSelector('#login-from');
    
    await page.click('#register-expert-input');

    await page.waitForSelector('#register-form');

    await page.type("#username-input", 'expert');
    await page.type("#email-input", 'expert@mail.com');
    await page.type("#password-input", 'expert123');
    await page.type("#password-confirmation-input", 'expert123');
    await page.click("#cancel-register-input");

    expect(page.url()).toBe('http://localhost:3000/')

    await page.waitForSelector('#offering-table');

    browser.close();
  }, 9000000);

  test('register like Expert', async () => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 900
      },
      userAgent: ''
    });

    await page.goto('http://localhost:3000/');

    await page.waitForSelector('#login-from');
    
    await page.click('#register-expert-input');

    await page.waitForSelector('#register-form');

    await page.type("#username-input", 'expert');
    await page.type("#email-input", 'expert@mail.com');
    await page.type("#password-input", 'expert123');
    await page.type("#password-confirmation-input", 'expert123');
    await page.click("#submit-register-input");

    await page.waitForSelector('#dashboard-username')

    const stringIsIncluded = await page.evaluate(() => {
      return document?.querySelector('#dashboard-username')?.textContent
    });

    expect(stringIsIncluded).toBe('Expert')

    await page.waitForSelector('#header-home')
    await page.waitForSelector('#header-dashboard')
    await page.waitForSelector('#header-search')
    await page.waitForSelector('#header-logout')

    expect(await page.$('#header-notifications')).toBe(null)

    browser.close();
  }, 9000000);

  test('register like Client', async () => {
    let browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo:50
    });
    let page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 900
      },
      userAgent: ''
    });

    await page.goto('http://localhost:3000/');

    await page.waitForSelector('#login-from');
    
    await page.click('#register-client-input');

    await page.waitForSelector('#register-form');

    await page.type("#username-input", 'client');
    await page.type("#email-input", 'client@mail.com');
    await page.type("#password-input", 'client123');
    await page.type("#password-confirmation-input", 'client123');
    await page.click("#submit-register-input");

    await page.waitForSelector('#header-home')
    await page.waitForSelector('#header-logout')
    await page.waitForSelector('#header-notifications')

    browser.close();
  }, 9000000);

});

