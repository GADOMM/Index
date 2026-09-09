import { appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createOidcTokenProvider, validatedSiteOrigin } from './github-oidc.mjs';

const domains = new Set(['flaconi.pl','douglas.pl','notino.pl','brasty.pl','cocolita.pl','drogeria.pl','aelia.pl']);
export function validateQualityAudit(payload) {
  const audit = payload?.audit;
  if (!payload?.ok || audit?.schema !== 1 || audit.complete !== true
    || !Number.isSafeInteger(audit.checkedAt) || typeof audit.healthy !== 'boolean'
    || !Array.isArray(audit.merchants) || audit.merchants.length !== domains.size) throw new Error('quality_incomplete');
  const seen = new Set();
  for (const m of audit.merchants) {
    if (!domains.has(m.domain) || seen.has(m.domain)) throw new Error('quality_invalid_merchant');
    seen.add(m.domain);
    for (const key of ['candidates','review','accepted','eligibleStoredOffers','freshOffers']) {
      if (!Number.isSafeInteger(m[key]) || m[key] < 0) throw new Error('quality_invalid_count');
    }
    if (m.freshOffers > m.eligibleStoredOffers || !Array.isArray(m.flags)
      || m.flags.some(f=>typeof f !== 'string' || !/^[a-z_]{1,60}$/.test(f))) throw new Error('quality_invalid_result');
  }
  if (audit.healthy !== audit.merchants.every(m=>!m.flags.length)) throw new Error('quality_invalid_health');
  return audit;
}

export async function runQualityAudit() {
  const token = createOidcTokenProvider({audience:'perfumetr-tradedoubler-bridge'});
  const response = await fetch(new URL('/api/internal/catalog-orchestrator', validatedSiteOrigin()), {
    method:'POST', headers:{authorization:`Bearer ${await token()}`, 'content-type':'application/json'},
    body:JSON.stringify({action:'audit_quality',source:'catalog:quality'}), signal:AbortSignal.timeout(90_000),
  });
  if (!response.ok) throw new Error('quality_unavailable');
  const audit = validateQualityAudit(await response.json());
  // Diagnostics contain aggregate operational facts only. Worklists remain in D1.
  const safe = {...audit, merchants:audit.merchants.map(({reviewSamples,...m})=>m)};
  process.stdout.write(`catalog_quality_result=${JSON.stringify(safe)}\n`);
  const summary = ['## Kontrola katalogu', '', `Sprawdzono: ${new Date(audit.checkedAt).toISOString()}`,
    'Liczba surowych rekordów nie jest liczbą perfum. Zmiana netto nie jest liczbą wykonanych kontroli.', '',
    '| Sklep | Przyjęte rekordy | Świeże oferty | Do kontroli | Sygnały |',
    '|---|---:|---:|---:|---|', ...audit.merchants.map(m=>
      `| ${m.domain} | ${m.accepted} | ${m.freshOffers} | ${m.review} | ${m.flags.join(', ') || 'brak'} |`)];
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary.join('\n')+'\n');
  for (const m of audit.merchants) if (m.flags.length) process.stdout.write(`::warning title=Kontrola ${m.domain}::${m.flags.join(', ')}\n`);
  if (audit.merchants.some(m=>m.flags.some(f=>['no_fresh_offers','full_import_overdue','source_error','coupon_verification_overdue'].includes(f)))) {
    throw new Error('quality_action_required');
  }
  return audit;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runQualityAudit().catch(error=>{
    const code = /^quality_[a-z_]+$/.test(error?.message || '') ? error.message : 'quality_failed';
    process.stderr.write(`${code}\n`); process.exitCode = 1;
  });
}
