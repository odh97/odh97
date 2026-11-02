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
// 업스트림 색(라이트·다크)과 이전 스타일 색 → 주택 창문 불빛 색. 키는 소문자.
// 배경·미로 벽은 아래에서 지우고(주택 외벽이 비치게), 기여 0 → 꺼진 창문, 1~4 → 점점 밝아지는 불빛
const colors = {
  '#1c2250': '#1C2250', '#ffffff': '#1C2250', '#0d1117': '#1C2250', '#202841': '#1C2250', '#151c30': '#1C2250', '#0e1230': '#1C2250', '#000000': '#1C2250', '#111526': '#1C2250',
  '#141a3f': '#1B1828', '#ebedf0': '#1B1828', '#161b22': '#1B1828', '#2b3552': '#1B1828', '#28324d': '#1B1828', '#222a5e': '#1B1828',
  '#8a6232': '#7A4A26', '#9be9a8': '#7A4A26', '#0e4429': '#7A4A26', '#514477': '#7A4A26', '#3b348f': '#7A4A26', '#5a4a3a': '#7A4A26',
  '#c0843a': '#B8702E', '#40c463': '#B8702E', '#006d32': '#B8702E', '#7560a8': '#B8702E', '#5b4fc9': '#B8702E', '#b07a3a': '#B8702E',
  '#e9a04f': '#E39A3B', '#30a14e': '#E39A3B', '#26a641': '#E39A3B', '#9786ec': '#E39A3B', '#8e7ff0': '#E39A3B',
  '#f6df5a': '#F7D35A', '#216e39': '#F7D35A', '#39d353': '#F7D35A', '#c7b8ff': '#F7D35A', '#cfc4ff': '#F7D35A',
  '#b9bce0': '#E8D2B0', '#57606a': '#E8D2B0', '#8b949e': '#E8D2B0', '#adb9da': '#E8D2B0', '#8e93c9': '#E8D2B0',
};
graph = graph.replace(/#[\da-f]{6}\b/gi, color => colors[color.toLowerCase()] || color);
// 배경 사각형과 미로 벽(wh-/wv-)을 지워 집마다 다른 외벽 색이 창문 사이로 보이게
graph = graph.replace(/<rect width="100%" height="100%"[^>]*\/>/, '');
graph = graph.replace(/<rect id="w[hv]-[^>]*>(<\/rect>)?/g, '');
// 월 표시: 축소돼도 읽히게 10 → 14
graph = graph.replace(/(<text\b[^>]*?)\bfont-size="10"/g, '$1font-size="14"');
// 잔디 칸 = 창문: 둥근 모서리를 거의 네모로
graph = graph.replace(/(<rect\b[^>]*\bid="c-\d+-\d+"[^>]*?)\brx="[\d.]+"/g, '$1rx="1"');
// 팩맨 → 캐릭터 그림 속 회색 줄무늬 고양이 (12×12, 한 칸 = 2단위, 팩맨 자리 20×20 기준 가운데 정렬)
// O 흰 외곽선 · K 털 · k 줄무늬 · N 귀 안쪽/코 · D 감은 눈 · C 흰 주둥이 · B 볼터치
// 이동(translate) 애니메이션만 유지하고, 회전·입 모양·색 변경은 뺍니다.
const PLAYER = [
  '.OO......OO.',
  'OKNO....ONKO',
  'OKKKOOOOKKKO',
  'OKkKKkkKKkKO',
  'OKKKKKKKKKKO',
  'OKDDKKKKDDKO',
  'OKKKKCCKKKKO',
  'OBKCCNNCCKBO',
  'OKKCCCCCCKKO',
  '.OKKCCCCKKO.',
  '..OKKKKKKO..',
  '...OOOOOO...',
];
const PLAYER_COLORS = { O: '#F4F1FF', K: '#A9A9B8', k: '#76768A', N: '#F08A9A', D: '#2B2233', C: '#F4F1FF', B: '#F08A9A' };
const sprite = PLAYER.flatMap((row, y) => [...row].map((c, x) => PLAYER_COLORS[c]
  ? `<rect x="${x * 2 - 2}" y="${y * 2 - 2}" width="2" height="2" fill="${PLAYER_COLORS[c]}"/>` : '')).join('');
const player = graph.match(/<(path|g) id="pacman"[\s\S]*?<\/\1>/);
if (player) {
  const move = player[0].match(/<animateTransform\b[^>]*type="translate"[^>]*\/>/)?.[0];
  if (!move) throw new Error('Pac-Man movement animation missing');
  graph = graph.replace(player[0], () => `<g id="pacman" shape-rendering="crispEdges">${sprite}${move}</g>`);
}
// Keep the real first frame visible in viewers that do not animate SVGs.
graph = graph.replace(/<rect\b[^>]*\bid="c-\d+-\d+"[^>]*>[\s\S]*?<\/rect>/g, cell => {
  const initialFill = cell.match(/<animate\b[^>]*attributeName="fill"[^>]*values="(#[\da-f]+);/i)?.[1];
  return initialFill ? cell.replace(/fill="#[\da-f]+"/i, `fill="${initialFill}"`) : cell;
});
const graphWidth = right + 4;
const graphHeight = bottom + 4;
// 레이아웃은 template.svg에 고정(카드 960×340). 그래프는 주택 외벽 폭 800에 맞춰 높이만 계산.
const displayHeight = Math.ceil(graphHeight * 800 / graphWidth);
const template = await readFile(new URL('./template.svg', import.meta.url), 'utf8');
const vars = {
  graphDisplayHeight: displayHeight, graphWidth, graphHeight, graph,
  desc: sample ? 'Style preview with upstream sample data, not odh97 contributions.' : 'odh97 contribution calendar as lit windows of autumn houses, animated.',
};
source = template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
  if (!(k in vars)) throw new Error('Unknown template key: ' + k);
  return String(vars[k]);
});
await writeFile(output, source, 'utf8');
console.log(`Contributions card styled: ${cells.length} cells; full grid ${graphWidth} x ${graphHeight}; equal board margins.`);
