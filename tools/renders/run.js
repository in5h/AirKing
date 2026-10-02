const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const out = process.argv[2]; const only = process.argv.slice(3);
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p0 = await b.newPage(); await p0.goto('http://localhost:8765/render.html'); await p0.waitForFunction(() => window.ready);
  const names = only.length ? only : await p0.evaluate(() => window.names); await p0.close();
  for (const n of names) {
    const p = await b.newPage({ viewport: { width: 960, height: 720 } });
    p.on('pageerror', e => console.log('ERR', n, e.message)); p.on('console', m => m.type() === 'error' && console.log('CONSOLE', n, m.text()));
    await p.goto('http://localhost:8765/render.html'); await p.waitForFunction(() => window.ready);
    const url = await p.evaluate(n => window.doRender(n), n);
    fs.writeFileSync(`${out}/${n}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
    console.log('ok', n); await p.close();
  }
  await b.close();
})();
