const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const INPUT_HTML = process.argv[2] || 'input.html';
const OUT_PDF    = process.argv[3] || 'output/doc.pdf';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  fs.mkdirSync(path.dirname(OUT_PDF), { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH
  });

  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(INPUT_HTML)).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: OUT_PDF,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log(`已导出：${OUT_PDF}`);
})();