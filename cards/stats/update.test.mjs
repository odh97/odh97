import test from 'node:test';
import assert from 'node:assert/strict';
import { collectStats, renderStats } from './update.mjs';

test('pagination, public ownership, and original repository totals', async () => {
  const calls=[];
  const first=Array.from({length:100},()=>({private:false,fork:false,stargazers_count:2,forks_count:1}));
  const second=[{private:false,fork:true,stargazers_count:500,forks_count:500},{private:true,fork:false,stargazers_count:1000,forks_count:1000}];
  const request=async(url,options)=>{
    calls.push({url,options});
    return {ok:true,json:async()=>url.endsWith('/users/odh97')?{followers:7}:url.endsWith('page=1')?first:second};
  };
  assert.deepEqual(await collectStats(request,'test-token'),{repos:101,stars:200,followers:7,forks:100});
  assert.equal(calls.length,3);
  assert.equal(calls[0].options.headers.Authorization,'Bearer test-token');
});

test('API failure rejects instead of returning invented zeroes',async()=>{
  await assert.rejects(collectStats(async()=>({ok:false,status:403}),''),/HTTP 403/);
});

test('zero is real data; missing data stays uninitialized',()=>{
  const svg=renderStats({repos:0,stars:0,followers:0,forks:0},'2026-11-01 00:00');
  assert.equal((svg.match(/>0<\/text>/g)||[]).length,4);
  assert.match(svg,/UPDATED 2026-11-01 00:00/);
  assert.match(renderStats(null,null),/AWAITING FIRST SYNC/);
  assert.equal((renderStats(null,null).match(/>--<\/text>/g)||[]).length,4);
});
