const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// 可命令行传参：node shot.js input.html output card 800 800
const INPUT_HTML = process.argv[2] || 'input.html';
const OUT_DIR    = process.argv[3] || 'output';
const PREFIX     = process.argv[4] || 'card';
const W          = parseInt(process.argv[5] || '800', 10);
const H          = parseInt(process.argv[6] || '800', 10);

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 视口略大于卡片，防止滚动条影响；deviceScaleFactor=1 保证 1:1 像素
  await page.setViewport({
    width: W + 200,
    height: H + 200,
    deviceScaleFactor: 1
  });

  const fileUrl = pathToFileURL(path.resolve(INPUT_HTML)).href;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // 等字体加载完
  await page.evaluate(() => document.fonts.ready);

  const cards = await page.$$('.card');
  if (!cards.length) {
    console.error('没有找到 .card 元素，请检查 HTML。');
    await browser.close();
    return;
  }

  for (let i = 0; i < cards.length; i++) {
    const outPath = path.join(OUT_DIR, `${PREFIX}-${i + 1}.png`);
    await cards[i].screenshot({ path: outPath });
    console.log(`已导出：${outPath}`);
  }

  await browser.close();
  console.log(`完成，共 ${cards.length} 张。`);
})();