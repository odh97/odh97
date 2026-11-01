// 추가 카드(languages · streak · activity) 공용 헬퍼: GitHub API 호출, 템플릿 채우기, 안전한 파일 쓰기.
import { writeFile, rename } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const USER = 'odh97';

export function github(token = process.env.GITHUB_TOKEN, request = fetch) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'odh97-profile' };
  if (token) headers.Authorization = 'Bearer ' + token;
  async function call(url, init = {}) {
    const res = await request(url, { headers, signal: AbortSignal.timeout(30000), ...init });
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status} for ${url}`);
    return res.json();
  }
  return {
    rest: path => call('https://api.github.com' + path),
    async graphql(query, variables) {
      const body = await call('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify({ query, variables }) });
      if (body.errors) throw new Error('GraphQL: ' + body.errors.map(e => e.message).join('; '));
      return body.data;
    },
  };
}

export const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error('Unknown template key: ' + key);
    return String(vars[key]);
  });
}

export async function writeCard(url, svg) {
  const temporary = new URL(url.href + '.tmp');
  await writeFile(temporary, svg, 'utf8');
  await rename(temporary, url);
}

export const isMain = meta => Boolean(process.argv[1]) && meta.url === pathToFileURL(process.argv[1]).href;

export const nowUtc = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
