import puppeteer from 'puppeteer';

describe('Login', () => {
  test('shows loging form OK', async () => {
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

    await page.click("#user-input");
    await page.type("#user-input", 'expert');

    await page.click("#password-input");
    await page.type("#password-input", 'expert');

    browser.close();
  }, 9000000);
});

