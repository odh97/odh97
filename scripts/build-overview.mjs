import fs from 'node:fs';
const assets = new URL('../assets/', import.meta.url);
let y = 0;
const panels = ['profile.svg','skills.svg'].map(name => {
  const source = fs.readFileSync(new URL(name,assets),'utf8');
  const height = Number(source.match(/height="(\d+)"/)[1]);
  const result = source.replace('<svg ', '<svg y="' + y + '" ');
  y += height;
  return result;
});
fs.writeFileSync(new URL('overview.svg',assets), '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="'+y+'" viewBox="0 0 960 '+y+'" role="img" aria-label="O_Dae ✦ · Frontend Developer · 오대현 · odh97 · 서비스를 이해할수록 개발이 더 재미있어집니다. · Skill Inventory"><title>O_Dae ✦ — Profile and Skill Inventory</title><rect width="960" height="'+y+'" rx="16" fill="#111526"/>'+panels.join('')+'</svg>','utf8');
