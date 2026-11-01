import { readFile, writeFile } from 'node:fs/promises';

// 업스트림 생성물에 색상·프레임을 입힙니다. 프레임 디자인은 template.svg에서 수정하세요.
const input = process.argv[2] || 'cards/pacman/pacman.svg';
const output = process.argv[3] || 'cards/pacman/pacman.svg';
let source = await readFile(input, 'utf8');
const sample = source.includes('SAMPLE DATA');
const roots = [...source.matchAll(/<svg\b[^>]*>/g)];
if (!roots.length) throw new Error('Pac-Man SVG root missing');
const root = roots.length > 1 ? roots[1] : roots[0];
let graph = source.slice(root.index + root[0].length);
graph = graph.slice(0, graph.indexOf('</svg>'));
const cells = [...graph.matchAll(/<rect\b[^>]*\bid="c-\d+-\d+"[^>]*>/g)];
if (!cells.length) throw new Error('Contribution grid missing; original card retained');
const attr = (tag, name) => Number(tag.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1]);
const right = Math.max(...cells.map(([tag]) => attr(tag, 'x') + attr(tag, 'width')));
const bottom = Math.max(...cells.map(([tag]) => attr(tag, 'y') + attr(tag, 'height')));
if (!Number.isFinite(right + bottom)) throw new Error('Invalid grid bounds');
const colors = {
  '#ffffff': '#151C30', '#0d1117': '#151C30', '#202841': '#151C30',
  '#ebedf0': '#28324D', '#161b22': '#28324D', '#2b3552': '#28324D',
  '#9be9a8': '#514477', '#0e4429': '#514477',
  '#40c463': '#7560A8', '#006d32': '#7560A8',
  '#30a14e': '#9786EC', '#26a641': '#9786EC',
  '#216e39': '#C7B8FF', '#39d353': '#C7B8FF',
  '#57606a': '#ADB9DA', '#8b949e': '#ADB9DA',
  '#000000': '#111526',
};
graph = graph.replace(/#[\da-f]{6}\b/gi, color => colors[color.toLowerCase()] || color);
// Keep the real first frame visible in viewers that do not animate SVGs.
graph = graph.replace(/<rect\b[^>]*\bid="c-\d+-\d+"[^>]*>[\s\S]*?<\/rect>/g, cell => {
  const initialFill = cell.match(/<animate\b[^>]*attributeName="fill"[^>]*values="(#[\da-f]+);/i)?.[1];
  return initialFill ? cell.replace(/fill="#[\da-f]+"/i, `fill="${initialFill}"`) : cell;
});
const graphWidth = right + 4;
const graphHeight = bottom + 4;
const displayHeight = Math.ceil(graphHeight * 868 / graphWidth);
const boardBottom = 112 + displayHeight + 16;
const height = boardBottom + 62;
const template = await readFile(new URL('./template.svg', import.meta.url), 'utf8');
const vars = {
  height, panelHeight: height - 24, boardHeight: boardBottom - 94,
  graphDisplayHeight: displayHeight, graphWidth, graphHeight, graph,
  legendTextY: boardBottom + 27, legendRectY: boardBottom + 16,
  desc: sample ? 'Style preview with upstream sample data, not odh97 contributions.' : 'odh97 contribution calendar as a Pac-Man animation.',
  caption: sample ? 'STYLE PREVIEW · SAMPLE DATA' : 'YOUR YEAR IN CONTRIBUTIONS',
};
source = template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
  if (!(k in vars)) throw new Error('Unknown template key: ' + k);
  return String(vars[k]);
});
await writeFile(output, source, 'utf8');
console.log(`Pac-Man styled: ${cells.length} cells; full grid ${graphWidth} x ${graphHeight}; equal board margins.`);
