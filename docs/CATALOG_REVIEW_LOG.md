# Catalog review evidence log

This log records actual inspections, not assigned worklists or net counter changes.

Each daily entry must include UTC time, merchant/source/product IDs, identity facts,
source of new evidence, decision, price observation time, publication result and the
next condition/date for unresolved cases. Never record raw feed payloads, credentials,
tracking URLs or private mail content. Unknown or conflicting identities are not
approved. Review each merchant; prioritize approved affiliate programs.

## 2026-09-09 baseline

Givenchy L'Interdit EDP 125 ml women's standard bottle: scoped review retained exact
GTIN3274872421479 and GTIN3274872459090 as separate trade items in one evidenced
comparison family. Notino provider product GIVINTW_AEDP40 and Flaconi feed37697 product
6c83695c-8acb-4b77-8f19-dea8638a7cf5-4 recovered. See PROJECT_STATE.md v239-v243 for
identity evidence, fresh official feed proof, timed application observation, BEAUTY
expiry and public redirect verification. This is not a general EAN alias rule.

Daily assignment automation installed. No claim that all other review records have
been inspected. First post-v244 production audit completed at2026-09-09T11:14:20.661Z.

## 2026-09-09 final public and queue proof

Public comparison checked2026-09-09T11:08:46Z: exact Flaconi offer
awin-offer-e3c4c810a67f24b34732256c,540PLN before code,54PLN BEAUTY discount,
zero delivery,total486PLN,affiliate,two samples with expiry1788994740000
and basket-availability caveat. Original GTIN identities remain separate.
Notino appdays461.23PLN is an owner screenshot observation expiring22:00Z;
it is not an automated web-price verification. Brasty503.66PLN including delivery.

All7store audit baseline at11:14:20.661Z was persisted:24108fresh eligible offers,
8492review records,healthy=false. Four aged queues, Notino full import ongoing.
This log does not represent8492completed inspections. Rotating worklists are
assignments only. Next daily operational review is scheduled around08:00 Warsaw
on10September, including safe retries, official promotion mail and matching fixes.

Verified upcoming Flaconi LUCKY official campaign received9September:
web10%LUCKY/app13%LUCKY13,13–14September literalCET; public API shows scheduled.
No gift extension or unqualified13%deduction. Existing Douglas selected-item sale
was checked against official advertiser terms and retained without global discount.

## 2026-09-10 daily review

Audit evidence time: 2026-09-10 01:51:37 UTC; workflow run 248, job
`102710483297`; audit schema 1, complete true, healthy false. Exact counters:
Flaconi 5,479 candidates / 1,378 review / 3,741 accepted and fresh; Douglas
6,521 / 2,572 / 3,129; Notino 17,892 / 2,656 / 8,858; Brasty 7,132 / 939 /
5,163; Cocolita 1,027 / 136 / 891; Drogeria.pl 1,247 / 391 / 856; Aelia
1,772 / 334 / 1,438. Net review deltas respectively +2, -96, +1, +3, +5,
0 and -1. Missing or truncated private worklists were not treated as empty.

Rotating-list decisions checked 2026-09-10 06:20–07:10 UTC:

- Aelia: Parfums de Marly Eragon 100 ml GTIN 3701415904354 and Valero 100 ml
  GTIN 3701415904347 remained blocked as `variant_not_found`; Bohoboco Plum
  Spray Paint EDP 50 ml GTIN 5902659104656 and Mango Yuzu EDP 50 ml GTIN
  5902659104694 remained blocked on identity conflict. No new independent exact
  variant evidence.
- Brasty: Serge Lutens L'Eau EDP 100 ml GTIN 3700358217231, Prada Luna Rossa
  Ocean EDT 50 ml GTIN 3614273556187 and Azzaro Sport EDT 100 ml GTIN
  3614273667418 remained blocked on GTIN/semantic conflicts.
- Cocolita: Sattva Jasmine 10 ml GTIN 5903794186644, Sattva Sandalwood 10 ml
  GTIN 5903794186668, Burberry Weekend men EDT 100 ml GTIN 5045252667576 and
  Dolce & Gabbana Pour Homme EDT 75 ml GTIN 3423473020783 stayed blocked because
  no exact variant was found. Milky Mane hair perfume 50 ml GTIN 5907006980808
  was confirmed non-standard and added to the explicit rejection rule.
- Douglas: Tiziana Terenzi Rivèa 100 ml GTIN 8016741142703 and Kristina 100 ml
  GTIN 8016741402654 stayed blocked for missing concentration; Laura Biagiotti
  Uva Dulcis EDT 100 ml GTIN 8059036010226 stayed blocked on semantic conflict.
  Search produced no adequate official exact-variant evidence.
- Drogeria.pl: product IDs 879833, 879845, 879851, 879838 and 879840 were grouped
  as car air fresheners with explicit “Odświeżacz do Samochodu” titles, no GTIN.
  Decision: reject as `excluded_product_type`; do not publish as perfume.
- Flaconi: Prada L'Homme Intense EDP 100 ml GTIN 8435137764730 and Carolina
  Herrera Very Good Girl EDP 50/30 ml GTIN 8411061043875/8411061041659 stayed
  blocked on GTIN/source-mapping conflicts.
- Notino: Tom Tailor Perspective EDT 30 ml GTIN 4051395172113, Time to Live EDP
  30 ml GTIN 4051395181160 and Tous Luminous Gold EDT 50 ml GTIN 8436550505887
  stayed blocked on semantic/GTIN conflicts.

Grouped correction shipped in Sites v248: ingestion now rejects explicit car and hair
fragrance non-perfume titles before missing-GTIN/variant review; quality audit applies
the same evidence-bounded cleanup to at most 25 rows per store and records
`reviewDecisions.rejectedNonPerfume`. 141/141 tests passed. The next audit must record
the actual production rejection count; it is not claimed in advance.

Public price evidence checked about 2026-09-10 07:04 UTC: Givenchy L'Interdit EDP
women 125 ml showed Flaconi 486 PLN after active DEAL1 (affiliate), Brasty 503.66 PLN
delivered and Notino 683.90 PLN delivered (both direct). The expired 9 September
two-sample gift was absent. Gmail overlap check found no newer official campaign or
cancellation; LUCKY/LUCKY13 remains scheduled for 13–14 September.

Douglas generation 25 was last completed 2026-09-09 10:15:59 UTC and crossed the
18-hour publication TTL, causing safe temporary 6/7 coverage. Sites v249 deployed
2026-09-10 07:13:47 UTC changes Douglas full-refresh priority from 12 hours to 6 hours.
Remaining condition: a terminal fresh Douglas full import, restored 7/7 public
coverage and a new audit result. Do not treat the prior accepted count as current
public freshness.

## 2026-09-10 recovery proof and review-scope clarification / 07:45 UTC

| Store | Source raw received* | Stored accepted | Fresh offers | Review | Rejected non-perfume this audit |
|---|---:|---:|---:|---:|---:|
| flaconi.pl | 35111 | 3741 | 3741 | 1378 | 0 |
| douglas.pl | 51327 | 3087 | 3061 | 2725 | 0 |
| notino.pl | 4705 | 8858 | 8858 | 2656 | 0 |
| brasty.pl | 4800 | 5163 | 5163 | 939 | 0 |
| cocolita.pl | 28314 | 891 | 891 | 111 | 25 |
| drogeria.pl | 32095 | 856 | 856 | 366 | 25 |
| aelia.pl | 8456 | 1438 | 1438 | 331 | 3 |

Audit at2026-09-10T07:39:57.340Z in run245 attempt2/job102780574021 confirms actual
rejections Cocolita25,Drogeria25,Aelia3 (53 total). These are grouped classifier
rejections, **not53 published perfumes** or independently verified EAN matches.
Queue total8506, net+100 since01:51 despite cleanup. Douglas generation26 received
51327raw but failed at finalize_generation;3061eligible offers fresh, complete full
import still blocked. Worker503/codeimport_failed; no underlying exception detail.
See matching continuity entry for exact production/read-only checks and queued runs.

Clarification of the earlier daily entry: the database connector truncated each
catalog-quality value, including one-row requests. Available list prefixes were
triaged across seven stores; the full25records/store were NOT read or certified.
Unseen samples and earlier missing-evidence conflicts are still blocked. No repeats
were counted as new completed verifications in this follow-up.

New group exposed after cleanup (private Cocolita latest row, inspected07:43UTC):
feed112471 products606373/GTIN8008970063102 Muschio Bianco1160ml,
606382/8008970062266 Vaniglia E Zenzero760ml,
606375/8008970063126 Byzantium1160ml,
606384/8008970055268 Persian Dream760ml,
606378/8008970055237 Byzantium760ml. Own stored feed titles explicitly say
Tesori d'Oriente Płyn do Płukania Tkanin. Category triage: laundry softener,
not body perfume; no invented EDP/EDT, audience or perfume line.
No new official-page exact-identity evidence and no mutation for this group yet.
Next condition: an evidence-bounded exclusion rule in the existing TD adapter/audit,
with positive perfume controls and a measured rejection count. It must not become
an automatic approval of missing variants or conflicts.

Remaining full-generation blocker is Douglas finalization. Concurrent uncommitted
cleanup/test edits were observed and preserved; their correctness/deployment was not
claimed. Do not weaken fail-closed retirement of orphan and old-feed listings.
No token creation, access bypass, forced429/403 retry, raw-feed replacement or email.

## Indexed finalization safety repair / 2026-09-10 08:08 UTC

Sites v251 is deployed from source `255b94ad5ad2a10542ad6e4142c6a6ef36fc1ab4`.
Deployment `appgdep_6aa26291542c81919fbf9b9cd71149b6` succeeded
2026-09-10T07:56:29.014510Z, environment revision19 unchanged.
URL https://perfumetr.borodzicz85.chatgpt.site. Full build/npm test **142/142 passed**.

The concurrent v250 work was committed/deployed before this follow-up changed it.
A separate synthetic SQLite comparison then demonstrated that v250's stale-source-only
cleanup differed from the pre-v250 contract: orphan listings, old-feed listings and
current-generation review listings were left active/valid. This is a reproduced
cleanup-logic regression, NOT a claim those fixture cases existed publicly.

v251 restores the original offer-first/listing-second/source-last fail-closed order
and original complete merchant-prefix scope. An additional exact product-ID predicate
uses the full existing source primary key; the exact source-key equality remains.
EXPLAIN QUERY PLAN in regression tests confirms all four source-key columns are used,
rather than scanning a whole generation per listing. No schema/index migration,
snapshot reset, rate-limit change, EAN merge or freshness-clock change.

New executable SQL regression covers current active preservation, old generation,
orphan, old feed, review, unrelated merchant and idempotency. The existing injected
EOF/atomic-completion failure test now again proves that an interruption after offer
retirement cannot leave the offer valid; preserved counters/checkpoints still resume.

The next explicit non-perfume group is also implemented: titles containing Polish
"Płyn do Płukania Tkanin" (including ASCII spelling) are excluded by the existing TD
eligibility gate and bounded audit cleanup. Synthetic tests include a laundry-softener
record and preserve an actual perfume title from the same brand. This rule has not
yet received its own measured production rejection count; do not add predicted
rejections to the53 already confirmed in the07:39 audit.

At08:07Z scheduled run250/34450297243 is still actively executing full TD requests
(HTTP200 progression). CJ run248 attempt2 and Douglas run245 attempt3 remain pending
under the shared production concurrency group. Do not cancel/skip the active import
or describe a pending rerun as a completed refresh. Douglas generation26 remains
paused at EOF51327 with prior import_failed until its queued job actually runs.
The public7/7 observation was made during incremental publication, not only after EOF.

Next: verify terminal Douglas/CJ/main results and collect fresh all7-store audit,
including actual further non-perfume cleanup. The07:39 counters below remain the last
completed audit until superseded. No new mail or additional automation was created.

