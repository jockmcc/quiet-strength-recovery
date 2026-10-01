import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const joinParts = (prefix, extension) => fs.readdirSync(root)
  .filter(name => name.startsWith(prefix) && name.endsWith(extension))
  .sort()
  .map(name => fs.readFileSync(path.join(root, name), 'utf8'))
  .join('');

const script = joinParts('app.part', '.txt');
new vm.Script(script, { filename: 'app.js' });
const css = joinParts('styles.part', '.css');
if (!script || !css) throw new Error('Workbook source parts are missing');

fs.writeFileSync(path.join(root, 'app.js'), script);
fs.writeFileSync(path.join(root, 'styles.css'), css);
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css', 'sw.js', 'manifest.webmanifest', 'robots.txt', '_headers', 'privacy-policy.html']) {
  fs.copyFileSync(path.join(root, file), path.join(root, 'dist', file));
}
fs.cpSync(path.join(root, 'assets'), path.join(root, 'dist', 'assets'), { recursive: true });
if (fs.existsSync(path.join(root, '.openai'))) fs.cpSync(path.join(root, '.openai'), path.join(root, 'dist', '.openai'), { recursive: true });
if (fs.existsSync(path.join(root, '.well-known'))) fs.cpSync(path.join(root, '.well-known'), path.join(root, 'dist', '.well-known'), { recursive: true });
if (fs.existsSync(path.join(root, 'downloads'))) fs.cpSync(path.join(root, 'downloads'), path.join(root, 'dist', 'downloads'), { recursive: true });
console.log('Workbook built; JavaScript syntax validated.');
