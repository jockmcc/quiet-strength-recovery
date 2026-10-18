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
new vm.Script(fs.readFileSync(path.join(root,'support-now.js'),'utf8'),{filename:'support-now.js'});
new vm.Script(script, { filename: 'app.js' });
const css = joinParts('styles.part', '.css');
const readings=JSON.parse(fs.readFileSync(path.join(root,'daily_readings.json'),'utf8'));
const videos=JSON.parse(fs.readFileSync(path.join(root,'video_library.json'),'utf8')).videos;
const expected=Array.from({length:365},(_,i)=>new Date(Date.UTC(2025,0,i+1)).toISOString().slice(5,10));
if(Object.keys(readings).length!==365||expected.some(k=>!readings[k]?.reflection||!readings[k]?.action_step))throw new Error('365 complete calendar readings are required');
if(videos.length!==20||new Set(videos.map(v=>v.url)).size!==20||videos.some(v=>!/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(v.url)))throw new Error('20 unique direct YouTube video links are required');
new vm.Script(fs.readFileSync(path.join(root,'explore.js'),'utf8'),{filename:'explore.js'});
new vm.Script(fs.readFileSync(path.join(root,'sw.js'),'utf8'),{filename:'sw.js'});
if (!script || !css) throw new Error('Workbook source parts are missing');

fs.writeFileSync(path.join(root, 'app.js'), script);
fs.writeFileSync(path.join(root, 'styles.css'), css);
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
for (const file of ['support-now.js','next-step.css','index.html', 'app.js', 'explore.js', 'explore.css', 'daily_readings.json', 'video_library.json', 'styles.css', 'sw.js', 'manifest.webmanifest', 'robots.txt', '_headers', 'privacy-policy.html']) {
  fs.copyFileSync(path.join(root, file), path.join(root, 'dist', file));
}
fs.cpSync(path.join(root, 'assets'), path.join(root, 'dist', 'assets'), { recursive: true });
if (fs.existsSync(path.join(root, '.openai'))) fs.cpSync(path.join(root, '.openai'), path.join(root, 'dist', '.openai'), { recursive: true });
if (fs.existsSync(path.join(root, '.well-known'))) fs.cpSync(path.join(root, '.well-known'), path.join(root, 'dist', '.well-known'), { recursive: true });
if (fs.existsSync(path.join(root, 'downloads'))) fs.cpSync(path.join(root, 'downloads'), path.join(root, 'dist', 'downloads'), { recursive: true });
console.log('Workbook built; JavaScript syntax validated.');
