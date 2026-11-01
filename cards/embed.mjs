// SVG 카드에 글꼴과 이미지를 직접 넣습니다. GitHub README의 SVG는 외부 파일을 불러오지 못하기 때문입니다.
//   node cards/embed.mjs cards/skills/skills.svg cards/profile/profile.svg
// - <style id="embedded-fonts" data-families="Family:wght@400|...">: 카드에 쓰인 글자만 담은 Google Fonts 글꼴로 채웁니다.
// - <image data-src="avatar.webp" ...>: SVG 기준 상대 경로의 이미지를 data URI로 href에 넣습니다.
// 글자를 새로 쓰거나 이미지를 바꿨을 때만 실행하면 됩니다.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const browser = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' };
const mime = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' };

async function download(url) {
  const res = await fetch(url, { headers: browser });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res;
}

async function embed(path) {
  const file = pathToFileURL(resolve(path));
  let svg = await readFile(file, 'utf8');

  const fonts = svg.match(/<style id="embedded-fonts" data-families="([^"]+)">[\s\S]*?<\/style>/);
  if (fonts) {
    const body = svg.replace(fonts[0], '');
    const text = [...new Set([...body.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(m => m[1].replaceAll('&amp;', '&')).join(''))].sort().join('');
    let css = '';
    for (const family of fonts[1].split('|')) {
      let block = await (await download(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)).text();
      for (const [, url] of block.matchAll(/url\((https:[^)]+)\)/g)) {
        const data = Buffer.from(await (await download(url)).arrayBuffer()).toString('base64');
        block = block.replace(url, `data:font/woff2;base64,${data}`);
      }
      css += block.replace(/\/\*.*?\*\//g, '').replace(/\s+/g, ' ').trim();
    }
    svg = svg.replace(fonts[0], () => `<style id="embedded-fonts" data-families="${fonts[1]}">${css}</style>`);
  }

  for (const [tag, src] of [...svg.matchAll(/<image\b[^>]*\bdata-src="([^"]+)"[^>]*>/g)]) {
    const data = (await readFile(new URL(src, file))).toString('base64');
    const type = mime[src.split('.').pop().toLowerCase()] ?? 'application/octet-stream';
    svg = svg.replace(tag, () => tag.replace(/\s+href="[^"]*"/, '').replace('<image', `<image href="data:${type};base64,${data}"`));
  }

  await writeFile(file, svg, 'utf8');
  console.log(`${path}: ${Math.round(svg.length / 1024)} KB`);
}

for (const path of process.argv.slice(2)) await embed(path);
