const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [, , jobsFile, outDir] = process.argv;
  const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('CERR', m.text()));
  await p.goto('file://' + path.join(__dirname, 'render.html')); await p.waitForFunction(() => window.ready, null, { timeout: 60000 });
  for (const j of jobs) { const t = Date.now(); const url = await p.evaluate(([k, o]) => window.renderProduct(k, o), [j.kind, j.opts]);
    fs.writeFileSync(path.join(outDir, j.file + '.png'), Buffer.from(url.split(',')[1], 'base64')); console.log(j.file, Date.now() - t, 'ms'); }
  await b.close();
})();
