import { writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function collectStats(request = fetch, token = process.env.GITHUB_TOKEN) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'odh97-profile' };
  if (token) headers.Authorization = 'Bearer ' + token;
  async function get(endpoint) {
    const res = await request('https://api.github.com' + endpoint, { headers, signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error('GitHub API returned HTTP ' + res.status);
    return res.json();
  }
  const user = await get('/users/odh97');
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await get('/users/odh97/repos?type=owner&per_page=100&page=' + page);
    if (!Array.isArray(batch)) throw new Error('Unexpected repository response');
    repos.push(...batch.filter(r => !r.private));
    if (batch.length < 100) break;
  }
  const originals = repos.filter(r => !r.fork);
  return { repos: repos.length, stars: originals.reduce((n,r) => n + r.stargazers_count,0), followers: user.followers, forks: originals.reduce((n,r) => n + r.forks_count,0) };
}

export function renderStats(data, time) {
  const metrics = [['PUBLIC REPOS',data?.repos], ['STARS',data?.stars], ['FOLLOWERS',data?.followers], ['FORKS',data?.forks]];
  const footer = time ? 'UPDATED ' + time + ' / UTC' : 'AWAITING FIRST SYNC / RUN GITHUB ACTIONS';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="204" viewBox="0 0 960 204" role="img" aria-labelledby="title desc">' +
    '<title id="title">odh97 GitHub public statistics</title><desc id="desc">' + (data ? metrics.map(([k,v])=>k+': '+v).join(', ') : 'Not initialized. Run the Update profile stats workflow.') + '</desc>' +
    '<rect width="960" height="204" rx="16" fill="#111526"/><rect x="16" y="8" width="928" height="180" rx="7" fill="#202841" stroke="#9786EC" stroke-width="2"/>' +
    metrics.map(([label,value],i) => '<g transform="translate('+(30+i*228)+',30)"><rect width="214" height="112" rx="7" fill="#29324F"/><text x="18" y="30" font-family="Arial, sans-serif" font-size="14" fill="#AEA4D6">'+label+'</text><text x="18" y="83" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="'+(i===2?'#BDEDDD':'#EDE9FE')+'">'+(value ?? '--')+'</text></g>').join('') +
    '<text x="38" y="179" font-family="monospace" font-size="13" fill="#AEA4D6">'+footer+'</text></svg>\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL('file:///' + process.argv[1].replaceAll('\\','/').replace(/^\//,'')))) {
  const initial = process.argv.includes('--init');
  const data = initial ? null : await collectStats();
  const time = initial ? null : new Date().toISOString().slice(0,16).replace('T',' ');
  const output = new URL('../assets/stats.svg',import.meta.url);
  const temporary = new URL('../assets/stats.svg.tmp',import.meta.url);
  await writeFile(temporary, renderStats(data,time), 'utf8');
  await rename(temporary,output);
  console.log(initial ? 'Initial card created; no fabricated values.' : 'Public statistics updated.');
}
