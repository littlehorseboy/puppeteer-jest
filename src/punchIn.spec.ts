import { launch, Browser, Page } from 'puppeteer';

describe('登入後操作表單', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch({
      headless: true,
      slowMo: 50,
    });
    page = await browser.newPage();

    await page.goto('http://localhost:4200/');
  });

  afterAll(async () => {
    await page.waitFor(2000);

    await browser.close();
  });

  test('login 頁面，輸入帳號密碼，然後測試有沒有成功輸入', async () => {
    const accountInput = await page.waitFor('body > app-root > app-login > div > div > form > div:nth-child(1) > input');
    await accountInput?.type('123');

    const accountInputValue = await page.evaluate((el: HTMLInputElement) => el.value, accountInput);
    
    const passwordInput = await page.$('body > app-root > app-login > div > div > form > div:nth-child(2) > input');
    await passwordInput?.type('321');

    const passwordInputValue = await page.evaluate((el: HTMLInputElement) => el.value, passwordInput);

    expect(accountInputValue).toBe('123');
    expect(passwordInputValue).toBe('321');
  });

  test('成功輸入後，按下 enter，SPA 跳到新頁面，等待 button 抓得到後，再對 table 進行判斷', async () => {
    await page.keyboard.press('Enter');

    await page.waitFor('body > app-root > app-record > button');

    const table = await page.$('body > app-root > app-record > div:nth-child(5) > p-table > div > div > table');

    if (table) {
      const tableTextContent = await page.evaluate((el: HTMLTableElement) => el.textContent, table);

      expect(tableTextContent).toContain('日期');
      expect(tableTextContent).toContain('時間');
      expect(tableTextContent).toContain('上下午');
    } else {
      expect(table).toBeNull();
    }
  });

  test('table 內容轉 Object', async () => {
    const table = await page.$('app-root > app-record > div:nth-child(5) > p-table > div > div > table');

    if (table) {
      const tableJSObject = await page.evaluate(
        async (selector) => {
          const tableEl = document.querySelector(selector);
          
          const trList = tableEl.querySelectorAll('tbody > tr');

          const data = Array.prototype.map.call(trList, (tr: HTMLTableRowElement) => ({
            date: tr.children[0].textContent,
            time: tr.children[1].textContent,
            periodsOfTheDay: tr.children[2].textContent,
          }));

          return data;
        },
        'app-root > app-record > div:nth-child(5) > p-table > div > div > table',
        { cache: 'no-cache' },
      );
  
      console.log(tableJSObject);
    } else {
      expect(table).toBeNull();
    }
  });
});
