import { launch, Browser, Page } from 'puppeteer';

describe('Google 首頁進行搜尋 horse', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch({
      headless: false,
      slowMo: 100,
    });
    page = await browser.newPage();

    await page.goto('https://google.com');
  });

  afterAll(async () => {
    await page.waitFor(2000);

    await browser.close();
  });

  test('搜尋欄位輸入 "horse"，然後測試有沒有成功輸入', async () => {
    const input = await page.$('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input');
    await input?.type('horse');

    const titleValue = await page.evaluate((el: HTMLInputElement) => el.value, input);

    await expect(titleValue).toBe('horse');
  });

  test('成功輸入後，按下 enter，到搜尋結果的頁面，測試看看有沒有翻譯出 "馬"', async () => {
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    const span = await page.$('#tw-target-text > span');

    const spanText = await page.evaluate((el: HTMLSpanElement) => el.textContent, span);

    await expect(spanText).toBe('馬');
  });
});
