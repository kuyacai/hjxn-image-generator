
汇聚兴农微信小程序商品图片生成小工具。
它可以将文本内容生成统一风格的图片，比如肥料或农药的使用说明等。

使用方法：

1. 把新文案粘贴到提示词末尾，发给 AI。

2. AI 输出一堆 <div class="card">...</div>。

3. 把这些内容粘贴到 input.html 的 <body> 里（模板已链接 styles.css）。

4. 运行：

```bash
node shot.js input.html output card 800 800
```

5. output/ 里就是 800×800 图片，风格与之前完全一致。