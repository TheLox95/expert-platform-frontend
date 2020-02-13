import puppeteer from 'puppeteer';
import Axios from 'axios';

beforeAll(() => {
  return Axios(`${process.env.REACT_APP_BACKEND_URL}/test`);
});

describe('App', () => {
  test('app opens OK', async () => {
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

    browser.close();
  }, 9000000);
});

