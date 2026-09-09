import assert from 'node:assert/strict';
import test from 'node:test';
import { validateQualityAudit } from '../scripts/catalog-quality.mjs';
const fixture = () => ({ok:true,audit:{schema:1,checkedAt:1788949800000,complete:true,healthy:true,
  merchants:['flaconi.pl','douglas.pl','notino.pl','brasty.pl','cocolita.pl','drogeria.pl','aelia.pl']
    .map(domain=>({domain,candidates:10,accepted:8,review:2,eligibleStoredOffers:8,freshOffers:8,flags:[]}))}});
test('quality requires complete coverage of every store and valid health counters',()=>{
  assert.equal(validateQualityAudit(fixture()).merchants.length,7);
  for (const change of [p=>p.audit.merchants.pop(),p=>p.audit.merchants[0].freshOffers=9,
    p=>p.audit.merchants[0].domain='unknown.pl',p=>p.audit.merchants[0].domain='douglas.pl',
    p=>p.audit.merchants[0].review=-1,p=>p.audit.complete=false,
    p=>p.audit.merchants[0].flags=['source_error']]) {
    const p=fixture();change(p);assert.throws(()=>validateQualityAudit(p),/quality_/);
  }
});
