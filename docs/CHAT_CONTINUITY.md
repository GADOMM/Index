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

## Recovery verification / 2026-09-10 07:45 UTC

This follow-up supersedes the earlier expectation that a deployed six-hour threshold
alone means Douglas has completed a full refresh.

Sites v249 source `8cf6279adecbcd2778f8878b475bc3877e7c313d` was checked directly:
deployment `appgdep_6aa258a10da88191abdc45823649080a` is succeeded (terminal status
updated 2026-09-10T07:14:07.473470Z). The unchanged clean v249 source passed
`npm test`, including build, 141/141 tests. GitHub baseline is
`7191ac825dd12abbd79d4c06d411aaf244c0bfee` (PR80); validation run249/34449155929 succeeded.

### Actual production work and outcome

After checking the prior Douglas job for provider access/rate-limit failures,
the authorized native job rerun started run245/34397414280 attempt2, job102780574021.
It advanced generation26 through 51,327 raw rows. Public 7/7 coverage returned
during incremental publication; this is not proof of complete generation finalization.
The job terminated with failure at 07:40:06Z: step35, orchestrator_import_failed.
Worker evidence at 07:39:55Z identifies stage=finalize_generation, code=import_failed,
errorName=Error; the failing request returned503 after46.6s. The underlying exception
detail was not exposed, so a database timeout is a hypothesis, not a proven error code.
The EOF page/cursor was preserved, state paused; no forced restart or 429/403 retry.

The post-cycle audit completed at **2026-09-10T07:39:57.340Z**, schema1, complete=true,
healthy=false. Logs and private latest records agree on the inspected counters.
41,106 stored candidates;24,034 accepted;24,008 fresh operational offers;8,506 review.
The actual explicit non-perfume cleanup was **53 rejected rows**:Cocolita25,
Drogeria25,Aelia3. No identity conflict was approved and no newly accepted perfume
is attributed to this cleanup. Compared with the 01:51 audit, total review rose100:
Douglas+153 offset by53 actual rejections. Net delta is not work throughput.

| Store | Source raw received* | Stored accepted | Fresh offers | Review | Rejected non-perfume this audit |
|---|---:|---:|---:|---:|---:|
| flaconi.pl | 35111 | 3741 | 3741 | 1378 | 0 |
| douglas.pl | 51327 | 3087 | 3061 | 2725 | 0 |
| notino.pl | 4705 | 8858 | 8858 | 2656 | 0 |
| brasty.pl | 4800 | 5163 | 5163 | 939 | 0 |
| cocolita.pl | 28314 | 891 | 891 | 111 | 25 |
| drogeria.pl | 32095 | 856 | 856 | 366 | 25 |
| aelia.pl | 8456 | 1438 | 1438 | 331 | 3 |

*Raw counts are current/last source receipts, not a common denominator for all stored
accepted/review records. Notino4705 and Brasty4800 are partial generations28/20.
Douglas51327 is a persisted EOF receipt with **unfinished finalization**.
Douglas has3061 fresh eligible offers and no expired eligible-offer backlog in this
audit, but remains source_error/full_import_in_progress/review_overdue. Flaconi,
Notino and Brasty retain aged review; CJ generations remain in progress.

### Public and promotional checks

Native and beta Givenchy comparison confirmed DEAL1,486PLN Flaconi including delivery,
no expired BEAUTY/appdays observation and no expired two-sample gift. Brasty503.66PLN
and Notino683.90PLN remain direct. A successful apex /out check returned302 to
www.awin1.com/pclick.php for the exact Flaconi offer; the final retailer landing was
not followed/certified. An earlier beta redirect request timed out, so reliability
is not claimed from this single success.

Three public comparison samples also worked: Armani Intensely EDP100ml,
Carolina Herrera Good Girl EDP80ml and Prada Paradoxe EDP90ml. The last showed a
fresh Douglas affiliate offer464.50PLN. Aelia exposes known bottle price but unknown
delivery/final total; do not silently convert unknown delivery to zero.
Homepage initially returned explicit unavailable statuses at its deadlines;
a later complete beta result showed all7stores, active DEAL1, scheduled LUCKY and
Douglas sale examples. Intermittent deadline failures remain observable.

Gmail overlap since7September found no new official campaign/cancellation beyond
known messages. Re-read advertiser messages1a080e496cb3445d and1a0850660e44c7d2:
DEAL1/BEAUTY expiry, literalCET windows, exclusions and app-only LUCKY13 unchanged.
Official https://www.flaconi.pl/kod-rabatowy/ also advertised DEAL1 at this check.
Its DEAL2 skincare rate differs from the email; out-of-scope cosmetics do not alter
perfume discounts. No coupon date or gift was extended.

### In-flight work, access and next step

Native rerun of latest CJ job102710483297 was accepted; run248/34425734746 attempt2
remained pending behind production serialization at07:44Z. Scheduled run250/
34450297243 was independently in progress on the full TradeDoubler step. Neither
was cancelled or presented as completed; no additional provider downloads were
issued outside existing workflows.

Concurrent uncommitted edits appeared in db/awin-douglas-import.ts and
tests/rendered-html.test.mjs during this read-only follow-up. They were preserved,
not authored, included in the141-test claim, committed or deployed by this follow-up.
Do not publish those edits without semantic cleanup tests: preserve orphan/old-feed
offer retirement and fail-closed ordering, not merely current-generation row matching.

Next: finish and verify the finalization repair against the preserved generation26
checkpoint, publish/test it, then resume Douglas through the existing workflow when
provider budgets permit. Observe terminal run250/CJ results and fresh all7-store
audit; inspect the next explicit laundry-product group recorded in the review log.
Keep the daily task enabled: it is an ongoing operation, not a completed one-time
condition. Report018 remains the last known mail; no new report or partner mail sent.

## Daily catalog control / 2026-09-10

Production was verified against master `9cae4fdbda96c8efe50fee40e3b8d868b6a5e697`,
scheduled workflow run 248 (`34425734746`, success), private catalog-quality records
and public APIs. The fresh audit completed 2026-09-10 01:51:37 UTC and covered all
seven required stores: 41,070 candidates, 24,076 accepted/fresh and 8,406 review.
Per-store accepted/fresh were Flaconi 3,741; Douglas 3,129; Notino 8,858; Brasty 5,163;
Cocolita 891; Drogeria.pl 856; Aelia 1,438. Notino generation 28 and Brasty generation
20 remain paused/in progress; their direct offers must not be described as affiliate
until current acceptance exists.

The rotating worklists were inspected for every store. Conflicting EAN/semantics in
Flaconi, Douglas, Notino, Brasty and Aelia were kept blocked without independent
evidence. A grouped false-positive cause was confirmed in TradeDoubler: Polish car
air fresheners were entering review because the merchant name contained “Fragrance”;
a Cocolita hair perfume was also non-standard. Sites v248 rejects these explicit
non-perfume types before missing-GTIN/variant review, and the daily quality audit now
cleans at most 25 confirmed rows per store and reports the actual rejection count.
It does not bulk-approve conflicts.

A public freshness check at about 07:04 UTC showed only 6/7 stores: Douglas generation
25 was last refreshed 2026-09-09 10:15:59 UTC and crossed the 18-hour public TTL.
The UI correctly hid 3,129 stale offers, but the generic 12-hour full-refresh priority
combined with the twice-daily Douglas schedule allowed this gap. Sites v249
(`8cf6279adecbcd2778f8878b475bc3877e7c313d`, deployment
`appgdep_6aa258a10da88191abdc45823649080a`) changes Douglas full-feed priority to
the six-hour boundary. Deployment succeeded 2026-09-10 07:13:47 UTC after 141/141
tests. Douglas stays unavailable until the next full import completes; do not label
the current 6/7 state healthy.

Givenchy L'Interdit EDP women 125 ml remained correctly compared: Flaconi base 540 PLN,
DEAL1 10% and free delivery produced 486 PLN; Brasty 503.66 PLN delivered; Notino
683.90 PLN delivered. Flaconi is affiliate; Notino and Brasty remain direct.
The two-sample Givenchy gift was not shown after its 9 September expiry. Gmail overlap
review found no promotion or cancellation newer than the known 9 September message.
DEAL1 is active for 10 September; LUCKY/LUCKY13 remain scheduled for 13–14 September.

Next action: verify the next Douglas full generation reaches terminal success, restores
fresh public offers and 7/7 coverage, then read the new quality result and record the
exact bounded non-perfume cleanup count. Do not retry supplier HTTP 429/403 manually.

## Follow-up: scheduled campaigns and daily-operation scope / 2026-09-09

Owner asked whether daily review continues automatically, whether codes can be checked
outside email, and to implement the latest Flaconi promotion everywhere.

Automation was rechecked enabled: daily around 08:00 Europe/Warsaw, starting 10 September,
no end date; first run still null. It reviews batches and fixes shared mapping causes,
not every historical record each morning. It must continue after backlog reduction to
handle new arrivals. Do not promise a zero queue, monotonic daily decline, no outages,
or completion of identity conflicts without evidence. Escalate concrete blockers.

Latest relevant official advertiser email dated 9 September is the LUCKY/LUCKY13
campaign already deployed in v244. Confirmed 13–14 September literal CET:
LUCKY 10% web, LUCKY13 13% app only. Exact UTC interval remains
2026-09-12T23:01Z to 2026-09-14T22:59Z. DEAL1 for 10 September also remains scheduled,
BEAUTY active on 9 September. Brand/product exclusions, automatic date transitions,
one-bottle web calculation and timed Givenchy gift are unchanged.
Do not duplicate coupons or send another report: #018 was already sent once.

### Confirmed presentation defect and repair

During endpoint verification, perfumetr.pl returned three campaigns while beta returned
an empty coupon list and a valid Douglas sale; a later beta read returned all three.
The previous API did not distinguish an unavailable read from an authoritative empty
list. The client accepted partial success permanently and stopped retrying.

The additive API now reports independent promotionsStatus and storeSalesStatus.
New client schema=5 uses bounded retries (maximum three), request cancellation and
independent source merging. Failed reads preserve valid campaigns from the other
source. Only complete reads mark loading successful; authoritative complete empty
results can clear genuinely ended/removed campaigns. Incomplete attempts may retry
on page resume/visibility, without overlapping work.
Optional Flaconi example lookup has a 600ms fallback and cannot suppress code details.
Observed repeated 2.5s server deadlines led to a separate bounded 6s campaign budget;
stats/merchant reads retain 2.5s, and client request timeout is 15s.

TradeDoubler voucher API is already connected with a six-hour refresh policy and
the existing partner/full cycles; it does not depend on mail. Official store pages
are additional verifiable evidence. AWIN Offers API exists, but automatic ingestion
of AWIN promotion codes is NOT implemented by this follow-up. Existing AWIN token/
product-feed integration is not proof of an enabled coupon importer. No new periodic
source or automation modification was made based only on the user's feasibility question.
Official reference: https://help.awin.com/apidocs/promotions
Flaconi public source: https://www.flaconi.pl/kod-rabatowy/

### Deployed source and proof

Sites v246, source `3b2ce91dc4253af9259d51fd765d21bb4c0629b7`.
Deployment `appgdep_6aa14ab807288191b05adf33a8345a8e` succeeded 2026-09-09T12:02:14.336017+00:00, environment revision 19.
Native URL: https://perfumetr.borodzicz85.chatgpt.site.
Build and all 140 tests passed. Tests cover partial-source preservation, genuine empty
results, bounded retries, cancellation and the additive API's failure statuses.
Existing campaign dates, exclusions, web/app distinction and comparison math passed.
No visual/browser/device test is claimed.

After v246 deployment, both https://perfumetr.pl/api/homepage?surface=beta&schema=5 and
https://beta.perfumetr.pl/api/homepage?surface=beta&schema=5 returned HTTP200 with
promotionsStatus=complete and storeSalesStatus=complete. Both contained BEAUTY active,
DEAL1 scheduled and LUCKY scheduled, each with three verified example variants.
The native comparison also confirmed Givenchy Flaconi486PLN, BEAUTY, zero delivery,
timed two-sample benefit and affiliate mode during this follow-up.
Earlier v245 requests reproduced unavailable statuses; the final6s campaign budget
was verified against complete live results. Local HTTP proxy latency is not a browser
performance measurement.

GitHub master baseline907e514dc8554452e5d89022d370a7f333eb6739 (PR78).
Latest inspected validation run240/34344966586 succeeded.
Last inspected production catalog run239/34342797824 and Flaconi19/34342797840 succeeded.
No provider import was started or cancelled by this follow-up, and no database,
secret, affiliate, commercial-rule, domain or recurring-task configuration changed.
Report018 remains sent; no additional email requested or sent.
Next: observe first scheduled daily operational review on10September; keep actual
progress separate from assignments and identify remaining hard conflicts. Discuss/
implement a dedicated AWIN promotions importer only within a subsequent change request.

## Current state: daily catalog operations live / Sites v244 / 2026-09-09

Owner's priority is active daily review and publication across every configured store,
fresh prices/promotions, and one comprehensive email report. Daily operational work is
authorized; recurring email or partner correspondence is not authorized.

### Deployed and publicly verified

Sites v244 source `af8264867e58fdc49b5b1aebae7c21c4803ff957`.
Deployment `appgdep_6aa13dffbedc81918759037019d6f581` succeeded
2026-09-09T11:07:56.320857Z, environment revision 19.
Native URL: https://perfumetr.borodzicz85.chatgpt.site.
GitHub implementation PR #77 merged as `db95be0c7c734235acf0fc53d473e67769ff2abc`.
Site tests/build 138/138; importer tests 33/33; both PR workflow validations passed.

Public Givenchy comparison at 2026-09-09T11:08:46Z:
Flaconi 540.00 before code, BEAUTY -54.00, free standard delivery, total486.00 PLN,
affiliate, and timed two-sample gift with basket availability qualification.
Brasty491.66 +12.00 delivery =503.66 PLN, direct.
Notino461.23 PLN is the existing owner-observed appdays application price,
not a freshly verified web price; expires2026-09-09T22:00Z and remains direct.
Exact identities and provenance are in the v239-v242 entries and review log.

Public homepage API confirmed BEAUTY active, DEAL1 scheduled, LUCKY scheduled.
LUCKY is official advertiser evidence received9September: web10% / codeLUCKY,
app13% / separate codeLUCKY13; starts2026-09-12T23:01Z, ends2026-09-14T22:59Z.
No13% web deduction or invented gift extension. Existing brand exclusions remain.
All7 stores appeared; catalog stats11099 variants/620brands are a public
snapshot, not merchant feed coverage or number of newly added perfumes.

### Operational behavior

Safe missing-metadata review cases retry after24h through shared policy;
identity conflicts and hidden entries remain guarded. Completed-generation
age12h prevents indefinite price-maintenance starvation of full CJ discovery.
Douglas review batch40. PR validation has separate concurrency groups; live
workflows remain serialized with queue:max. Existing10daily UTC schedules retained.

Every main catalog cycle runs authenticated audit_quality, sourcecatalog:quality.
All7stores: flaconi.pl,douglas.pl,notino.pl,brasty.pl,cocolita.pl,drogeria.pl,aelia.pl.
Audit persists catalog_meta keys catalog-quality:latest:<domain> and
catalog-quality:baseline:<domain>. Worklists up to25/store rotate daily and stay private.
CJ/AWIN review and accepted counters cover all stored source records, not only
the changing current generation. TD counts current candidate snapshot. Source raw
counts describe current generation/last completed full receipt and are not comparable
denominators for all-stored counters. FreshOffers is an operational eligibility count;
do not rename it exact public search coverage or unique perfume count.
A recently started paused/running generation is full_import_in_progress; missing or
over24h completion is full_import_overdue. Read failures fail the audit; no false zeros.
Criticalflags no_fresh_offers/full_import_overdue/source_error/coupon_verification_overdue
fail the quality step; other flags are visible warnings. Net changes are not throughput.

Enabled daily task 'Kontrola katalogu Perfumetr', Europe/Warsaw, around08:00 daily
starting10September: actively inspect all stores, prioritize approved affiliates,
process evidence-based rotating cases and adapter-wide fixes, review promotional
mail/conditions, test/publish safe corrections, verify public offers, record actual
decisions in docs/CATALOG_REVIEW_LOG.md and report chat outcome. This is not a reminder.
Respect provider429/403 without forced retries or access overrides.
Notino is not accepted; VIV7September says prior rejection follow-up is ongoing.
Its registry's applied label is not evidence of approval. Direct mode remains.
No expectation that every feed row is perfume or every case can be autoapproved.

### Final production proof and report delivery

Initial main push run #239 /34342797824 completed successfully. Import job102437410934:
TD proof/full steps passed, all3full feeds unchanged; Flaconi fresh skip;
Notino48bounded steps, generation27 paused at4705raw records,2175accepted in this
partial generation; Brasty15steps completed generation19 at12780raw records.
Notino is incomplete by design at the step budget and retains its cursor.
Do not mistake a successful bounded job for complete Notino feed coverage.
Initial isolated Flaconi pushrun#19 /34342797840 also succeeded as fresh skip.

Authenticated quality audit checkedAt2026-09-09T11:14:20.661Z:
schema1,complete=true,healthy=false. All7stores audited and persisted.
24108eligible stored offers were fresh;8492records remain in review.
No criticalfreshness/sourceflags, but4stores have review_overdue; Notino also
full_import_in_progress. There is no24hdelta yet (first baseline).
This is not proof that8492cases were reviewed or that100%merchant inventory is covered.

| Merchant | Stored candidates | Accepted | Fresh offers | Review | Flags |
|---|---:|---:|---:|---:|---|
| flaconi.pl | 5473 | 3743 | 3743 | 1376 | review_overdue |
| douglas.pl | 6521 | 3033 | 3033 | 2668 | review_overdue |
| notino.pl | 17889 | 8909 | 8909 | 2655 | full_import_in_progress, review_overdue |
| brasty.pl | 7123 | 5240 | 5240 | 936 | review_overdue |
| cocolita.pl | 1020 | 889 | 889 | 131 | none |
| drogeria.pl | 1247 | 856 | 856 | 391 | none |
| aelia.pl | 1773 | 1438 | 1438 | 335 | none |

Remaining root-cause groups include Flaconi876gtin_identity_conflict,
Douglas1373gtin_identity_conflict, Notino1555gtin_conflict, Drogeria389missing_valid_gtin,
Cocolita121variant_not_found and Aelia300variant_not_found. These named groups are
not totals of every identity conflict. Daily work must inspect evidence and fix
shared matching problems, never mass-approve conflicts or erase backlog to improve KPIs.
Review log records actual Givenchy evidence, production proof and the baseline only;
other assigned samples are not falsely recorded as inspected.

Report #018 sent once to support@perfumetr.pl from Perfumetr <support@perfumetr.pl>.
Native Gmail confirmed SENT and INBOX, message/thread1a085e3fe82adc01.
Subject: [Perfumetr] Raport #018 — Brakujące oferty, codzienna kontrola i świeże rabaty — 09.09.2026
Exact Sent#003 layout/inline logo/footer preserved. Report includes causes, all7counts,
138/138site tests,33/33importer tests, public Givenchy486BEAUTY/free delivery/timed samples,
LUCKY futurecampaign, actualsuccessful run, incomplete Notino and8492remaining cases.
Standalone HTML saved persistently; no duplicate report should be sent.
Daily task enabled for around08:00 Europe/Warsaw starting10September; first task run
has not happened. Continue active work and send chat outcomes, not recurring email.

# Chat continuity runbook

## Current state: daily catalog review and quality audit / Sites v243 / 2026-09-09

Owner requested active daily review/publication across all seven stores, fresh prices
and promotions, plus one comprehensive email report after completion. This supersedes
report deferral for this task only. Do not send recurring emails without authorization.

Sites source 061262759664f96e5054d695b6eae7df3325310e is deployed as v243,
version appgprj_6a8236775b808191b6b4979c4d86d889~appgver_46292b8ee2a881919dc910b987a1a5b1,
deployment appgdep_6aa13a6e08d48191903c8dd175b9e39e succeeded
2026-09-09T10:52:44.674480+00:00, environment revision 18 unchanged.
URL https://perfumetr.borodzicz85.chatgpt.site. Sites npm test 137/137 passed.
GitHub master baseline 07cbb0a788030cf22e2172aa93e1f03bcb487111.

Confirmed causes: CJ prefixes an unresolved attempt with manual_* and excludes it
from subsequent attempts; AWIN unresolved labels likewise leave the automatic queue.
Only safe missing-metadata reasons now become eligible again after 24 hours, oldest
updated records first. All original matching, quarantine, provider identity, exact
GTIN and observed-price timestamps remain. Hard identity conflicts are not auto-approved.
Douglas review/safety batches now use 40 instead of 400, fitting the existing maximum
50-statement write budget. Its earlier step-36 import_failed does not prove that every
Douglas failure was this batch limit. Flaconi's review counter now mirrors the durable
conflict exclusion in its selector. A completed generation older than 12h can restart
even with maintenance backlog, after pending publication, so discovery cannot starve.
CJ still performs bounded price maintenance while its next generation advances.

New OIDC-only audit_quality action on /api/internal/catalog-orchestrator (source
catalog:quality) inspects all seven stores, including direct-only CJ. It records source
raw received counts separately from accepted candidates, operational fresh offer counts,
review reasons/age, coupon windows, affiliation status and deltas from a daily baseline.
TradeDoubler raw counts come from the atomic completion receipt, never from cosmetics
counts labelled as perfumes. A failed read fails the complete audit. It stores private
latest/baseline catalog_meta keys catalog-quality:latest:<domain> and
catalog-quality:baseline:<domain>. Each day's worklist rotates up to 25 review records
per store; rotation is a work assignment, NOT a claim that those records were reviewed.
Net deltas are not throughput. Operational fresh offers are not an exact public-search
coverage audit or retailer checkout certification. No new schema or secret was added.

Importer changes on codex/daily-catalog-quality: retained all ten existing schedules
and provider budgets; PR validation has its own concurrency group, live imports retain
shared mutual exclusion with queue:max and cancel-in-progress:false, so a newer pending
run does not evict an older one. Add post-cycle quality audit (even after failures) and
quality-only manual mode. Aggregate logs exclude worklist product details and raw
provider payloads. Critical freshness/source failures fail the quality step; outstanding
review is explicitly flagged. Importer npm test passed 33/33 locally. PR/CI and the first
production audit remain pending at this checkpoint. Never call that pending proof complete.

Daily ChatGPT task 'Kontrola katalogu Perfumetr' enabled 2026-09-09, Europe/Warsaw,
flexible morning around 08:00 starting 2026-09-10. Task id
6aa139d744c081918b5a6811e00214e1 is internal metadata. It reviews rotating batches,
checks official promo mail, applies evidenced fixes, tests/deploys and updates continuity.
It does not grant blanket approval for conflicts or recurring external messages.
The existing feed schedules continue independently. Do not promise no future incidents
or 100% merchant inventory; inaccessible/ambiguous data remains an explicit blocker.

Known prechange D1: Flaconi gen37 raw35129/accepted3743/review1376;
Douglas gen25 raw51098/accepted3033/review2668; Brasty gen19 paused raw11585,
accepted10170/review1248 (incomplete); Notino gen26 completed raw6976,
accepted3412/review662, scope_skipped. These are source snapshot counts, NOT a single
simultaneous live public offer total. Last production isolated Flaconi success was
33511129905 attempt2; last all-workflow Douglas34337324399 failed, last validation
34340121433 succeeded. Recheck before reporting current results.

Next: publish GitHub PR only after deployed endpoint guard verification, pass CI,
merge and inspect initial live audit/import results. Resolve newly exposed actionable
failures, record actual outcomes, then send report #018 to support@perfumetr.pl using
Sent #003 exact template (latest confirmed Sent #017). Report is pending, not sent.


## Current state: Flaconi Givenchy 125 ml published with BEAUTY / Sites v242 / 2026-09-09

Verified public comparison at 2026-09-09T10:23:38Z: Givenchy L'Interdit EDP
125 ml women now includes Flaconi, in stock, 540.00 PLN before code,
54.00 PLN BEAUTY discount, zero standard delivery and **486.00 PLN total**.
The offer is `awin-offer-e3c4c810a67f24b34732256c`, linkMode affiliate.
Both reviewed GTIN variants retain their individual identities; the original
comparison link is `cjv-db07d2a5811a3f5af83e9a73` and the second is
`cjv-cfd7c64b1edb8d6dedde8dda`. Notino's existing timed app observation is
unchanged. Do not claim Flaconi is cheaper than the 461.23 PLN Notino app offer.

### Recovery and fresh evidence

The owner supplied the official AWIN CSV gzip export dated 9 September.
It contains 35,150 raw rows and exactly one matching Flaconi 125 ml item,
feed 37697 / advertiser 18563, source product
`6c83695c-8acb-4b77-8f19-dea8638a7cf5-4`, GTIN 3274872459090:
540.00 PLN, in stock, zero feed delivery. Its AWIN link matches publisher
3043535 and the correct retailer product. The raw export and email were
not committed or substituted for the production feed. The exact product
facts agree with the already-fresh official generation-37 observation.

Sites v241 (source `327e61bd194f7f70d754f8134d0d55d50cd37baa`) had already
deployed a scoped recovery for this reviewed trade item, but it had not
been processed. Re-ran the existing isolated Flaconi job using native GitHub
Actions: run #15 / 33511129905 attempt 2, job 102426392297. The workflow
and orchestrator blobs were verified identical to master before rerunning.
The shared queue preserved the running Douglas import; pending scheduled
#236 was superseded by GitHub concurrency, not a running import cancellation.
Flaconi completed successfully at 10:17:41Z: one maintenance step, one record
recovered, automatic review zero. Generation 37 remains completed, with
35,129 raw received, 3,743 accepted/live offers, 1,376 review, 30,010 excluded,
and 5,473 stored perfume source products. These counters are the official
production snapshot, not the later 35,150-row owner export.

### Why the promotional price needed v242

The first public proof showed the recovered affiliate offer at 540 PLN.
Runtime BEAUTY was correctly active and eligible. Worker logs confirmed
repeated "Comparison coupons exceeded soft deadline": the 750ms optional
read discarded valid coupons. This was an additional public-price bug.

Coupon retrieval now reuses the fresh accepted offer rows from the public
comparison instead of repeating the expensive catalog and offers joins.
It retains merchant verification, public merchant allowlist, exact coupon
targets, excluded brands, active dates, freshness, conditions and existing
delivery-aware calculation. JSON-bound ID lists avoid unbounded SQL parameters.
Coupons have a bounded 2.5-second read budget; stalled optional data still
falls back, and the overall comparison endpoint retains its 8-second deadline.
No feed record, coupon configuration, secret, schema or importer contract changed.
The existing timed sample benefit now appears with the applied BEAUTY coupon.

### Publication and validation

Sites source `7a63c18ba819d311395d202223cb1bae652f2282`, pushed to canonical main.
Version `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_52ae0163e6b4819193faa4d77eedf939`.
Deployment `appgdep_6aa13382261c81918cd7142d00e38670` succeeded
2026-09-09T10:23:10.479148+00:00, environment revision 18 unchanged.
Native URL: https://perfumetr.borodzicz85.chatgpt.site.

npm test passed **135/135**, including the complete production build.
The regression now proves a valid coupon arriving after one second is still
included, while indefinitely stalled coupon/delivery reads finish within
four seconds. Existing date-boundary, excluded-brand, exact-target,
freshness, reviewed-GTIN and affiliate redirect tests all passed.
Public apex comparison returned HTTP 200 with BEAUTY and 486 PLN.
The beta outbound route returned HTTP 302 to the exact AWIN publisher,
advertiser and tracked product from the feed. Apex HEAD probes returned
a transient local-proxy 502; do not treat those as a retailer failure.
No browser/device QA, purchase or commission transaction was performed.

GitHub master baseline before this documentation update:
`c1bb0e1bf1572af15de03693dc775b546110eb7e` (PR #75).
PR #76 retains the v239/v240 history and records this completion.
Douglas #235 / 34337324399 ended failure in a later load_import step,
although native generation 25 reports completed: 51,098 raw / 3,033 accepted.
Do not claim all integrations healthy. The Flaconi isolated run succeeded.

Completed: requested Givenchy Flaconi offer and active promotional price.
No further importer restart or provider download is needed for this request.
Next: the owner's next task; normal scheduled refreshes continue. Recheck live
price and campaign validity before advertising. Report remains deferred;
no email sent. Never extend today's sample/coupon window without new evidence.


## Current state: Givenchy L'Interdit EDP 125 ml / Sites v240 / 2026-09-09

Checkpoint: 2026-09-09T09:35:00Z. Owner explicitly requested publication of
the Notino application price shown in their screenshot. This is now deployed
and verified in the public comparison. Flaconi price/availability is NOT
confirmed; do not interpret absence in our comparison as retailer unavailability.

- Sites source: `dbcfac61a6d45d766d6cdcc9b3be82b4fe44879d`, committed and pushed.
- Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_58f9684276e08191a83d788d9e3fb8e0`.
- Deployment: `appgdep_6aa1279c0c908191b69426f85ee6c07a`,
  succeeded 2026-09-09T09:32:45.522794+00:00; environment revision 18 unchanged.
- URL: https://perfumetr.borodzicz85.chatgpt.site.
- GitHub master baseline: `c1bb0e1bf1572af15de03693dc775b546110eb7e` (PR #75).
- Documentation PR #76 remains open; this checkpoint supersedes the v239 price
  publication status below without erasing its investigation history.
- Tests: Sites `npm test` 134/134 passed, including strict offer/store/link/stock
  scoping, nonmutation, time boundaries, background-return expiry and cleanup.
  No schema, importer contract, feed data, provider credentials or workflow changed.

### Published screenshot observation, not a feed replacement

The public API for `cjv-db07d2a5811a3f5af83e9a73` was checked after deployment:
exactly 2 offers, Notino first at 461.23 PLN with zero delivery and code
`appdays`, followed by Brasty 491.66 + 12.00 = 503.66 PLN. Notino offer ID
`cj-offer-cfd7c64b1edb8d6dedde8dda` is explicitly marked
`source: owner-screenshot`, `channel: app`, base price 599.00 PLN.
The original provider record (675 PLN at the previous check) remains unchanged.

Observation time: 2026-09-09T08:52:00Z (10:52 Warsaw, screenshot).
Conservative publication cutoff: 2026-09-09T22:00:00Z (Warsaw midnight).
This cutoff is our manual display lifetime, NOT a verified campaign end date.
After expiry the UI and API fall back to the unchanged provider offer, including
an already-open tab returning from the background. No additional coupons stack.

Main comparison, alternate rows and catalog detail show the application-only
condition. The CTA copies the code and opens the product; visible text explains
that this price requires the Notino app and checkout confirmation. The normal
product redirect is not represented as an automatic app-price checkout.
Implementation: `app/observed-offer.ts`, `app/use-offer-clock.ts`,
catalog public mapping and both comparison UIs. Timers run at the expiry
boundary and are cleaned up; no polling loop or new dependency was added.

### Flaconi and remaining work

A fresh official-product-page request returned HTTP 403. Exact product/EAN web
searches produced no confirmed current 125 ml offer. Do not retry around this
access restriction or claim a verified Flaconi price/stock status.
The latest read of `awin:flaconi-pl:catalog` shows generation 37 completed,
no source error, feed 37697: 35,129 raw received, 3,742 accepted perfumes,
1,377 review and 30,010 rejected; completed_at 1788942487961.
Our current 125 ml comparison contains no published Flaconi offer.

Last production rerun #230 / 34288500715 attempt 2 remained in_progress at the
09:33 UTC check: import job 102408855410 ongoing; validation job 102408891834
succeeded. Full TradeDoubler and Douglas steps were skipped. No new import was
started in this turn. Scheduled run #232 / 34324511012 was successful.
PR validation #233 / 34334329029 was pending behind the shared importer
concurrency slot. Verify the updated PR head and CI before merging.
Auto-merge is not enabled on this repository; do not change settings or bypass CI.

Exact next task: investigate the missing Flaconi 125 ml source/matching only
when an authorized, readable current source is available; resolve the upstream
Notino feed/retailer price discrepancy without silently extending this manual
observation. Recheck ongoing bounded import and documentation PR CI once useful.
Report delivery remains deferred at the owner's request; no email was sent.

## Previous checkpoint: Givenchy L'Interdit EDP 125 ml / Sites v239 / 2026-09-09

Checkpoint: 2026-09-09T09:22:00Z. Missing Notino offer repaired; retailer/feed
price discrepancy remains unresolved. Do NOT report the whole pricing request
as completed.

- Sites source: `3dfd3cab0fc3d29765fdb4a8ffded8a2c6673eec`.
- Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_6da2a302a3108191974ca85586e83630`.
- Deployment: `appgdep_6aa12437ffc08191ac3086e8c3e245a8`, native succeeded
  2026-09-09T09:18:12.562701+00:00; environment revision 18 unchanged.
- URL: https://perfumetr.borodzicz85.chatgpt.site.
- GitHub master baseline rechecked: `c1bb0e1bf1572af15de03693dc775b546110eb7e`
  (PR #75). No importer contract or workflow changed.
- Tests: Sites `npm test` 132/132 passed, including synthetic stale-source
  recovery, retained exact GTINs, old conflict history, no stale-price
  publication, fresh provider mismatch rejection, comparison family and
  negative scope tests. Working tree committed and pushed.

### Cause and bounded repair

Public variant `cjv-db07d2a5811a3f5af83e9a73`, EDP 125 ml women, has Brasty
GTIN `3274872421479`. Official Notino CJ feed `13475384` source
`GIVINTW_AEDP40` uses `3274872459090`. Durable CJ semantic identity conflict
`d60a3957e43693bd461156ee5731f6d233272ee50c6d6ededc88da633b8f35d6`
had quarantined this record.

Both trade items are retailer-listed as Givenchy L'Interdit EDP 125 ml women's
standard bottle. Evidence: individual Jomashop product pages ending
`fragrances-3274872421479.html` and `fragrances-3274872459090.html`, and the
official Notino exact product page below. This is NOT a global EAN alias or
claim of identical formulation. The reviewed pair keeps separate exact-GTIN
variants/evidence and coexists only in this precise comparison family.

`app/reviewed-trade-items.ts` is narrowly scoped to Givenchy / l interdit /
women / EDP / 125 / standard and the two reviewed GTINs. CJ identity keys include
the individual GTIN only for this reviewed scope. Historical conflicts remain.
Recovery selects only the witnessed Notino feed/product and terminal semantic
conflict; stored review prices stay unpublished until fresh provider-by-ID
confirmation. Existing hidden/manual/wrong size/audience/source/GTIN gates
remain intact. No raw feed was replaced, credential exposed, or manual price
inserted.

### Production proof and remaining discrepancy

At comparedAt `1788945545489`, public comparison returned exactly TWO offers:
Brasty base 491.66 PLN + delivery 12 = 503.66 PLN, and Notino base 675 PLN +
configured delivery 8.90 = 683.90 PLN. Notino was freshly fetched at 11:18
Europe/Warsaw. Its new offer is `cj-offer-cfd7c64b1edb8d6dedde8dda`.
HEAD of its outbound URL returned 302 to the correct 125 ml product:
https://www.notino.pl/givenchy/linterdit-woda-perfumowana-dla-kobiet/p-16091479/

A direct read of that official product page at about 09:20 UTC confirmed base
599 PLN, `shoppingdays` 20%, discounted price 479.20 PLN, and InStock.
The user's Notino app screenshot shows 461.23 PLN with `appdays` and free
delivery. Official Shopping Days/coupon pages distinguish appdays (application)
from shoppingdays (web); do NOT apply the advertised maximum 33% to this SKU,
or present an app-only price as an ordinary website/affiliate price.

Thus fresh CJ retrieval does NOT mean the retailer price matches: provider
currently supplies 675 PLN. Price/promotion synchronization is still blocked
by that upstream mismatch, not fixed by the identity recovery. No unverified
retail price, shipping override or undated coupon was published.

Flaconi: today's completed official generation 37, feed 37697, raw 35129,
accepted 3742, review 1377, rejected 30010, completion 1788942487961.
No confirmed Flaconi offer for this exact 125 ml variant in public comparison.
Indexed official product page exposes 125 ml, but direct research returned
403, so live stock/price were NOT confirmed. Do not claim out of stock.

### Live run and next task

Latest original Actions #232 / 34324511012 completed successfully. To request
fresh partner prices after v239, used the native rerun action once for completed
partner-only job 102269556367 of run #230 / 34288500715 (same current master).
Attempt 2 import job 102408855410 is in progress at this checkpoint; validation
job 102408891834 succeeded. This run uses the existing bounded OIDC partner
orchestrator (Flaconi/Notino/Brasty/vouchers); TradeDoubler full feed and Douglas
steps are skipped. Notino recovery already publicly verified. Do NOT start
another run or retry provider 429s. Read final run status/logs before claiming
the entire partner run succeeded.

Next: reconcile the official Notino product price/promotion with its CJ feed
using a provenance-preserving, expiry-bounded verification path; confirm
Flaconi exact 125 ml availability without guessing or bypassing blocked access.
No browser QA or UI redesign requested/performed. No additional promotion
status/tint changes. No report email sent; consolidated report remains deferred
until the owner explicitly asks.

## Current state: visible promotion status and distinct glass (Sites v238 / 2026-09-08)

Published at `2026-09-08T13:44:31.101257+00:00`, environment revision **18** unchanged.
Source: `affeb77cc6fc90b1a29dbab579d36a8773e75330`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_055e5dfd14ac81919f738c4d9dadde35`.
Deployment: `appgdep_6aa0112ff73c819186c442b0a613877f`.
URL: https://perfumetr.borodzicz85.chatgpt.site.

Owner request: distinguish active promotions from upcoming ones without requiring
the dates to be read, and tint the glass differently. Each independently
collapsible campaign now shows an accessible visible “Aktywna” or “Wkrótce”
badge in its collapsed heading. Active cards layer a restrained translucent
blue/teal tint over the shared frosted material; upcoming cards retain neutral
glass. The active badge has a light fill and dark text, while upcoming badges
are quieter. The distinction does not depend on color alone. Responsive heading
wrapping preserves dates/code. No emoji, extra blur, pulse or heavy border added.

The existing shared boundary clock changes the badge and tint automatically.
It now refreshes on pageshow and return to a visible document after suspended
mobile timers. Repeated resume clears the previous timer; unmount removes all
listeners and timers. Expired campaigns disappear as before. v237 separate
Flaconi cards, dates, conditions, example links and expansion state remain.
Coupon eligibility/rates/time boundaries, offers, imports, environment and
routes are unchanged. Three v237 JavaScript bundles are retained for open clients.

Validation: standalone Sites build passed; npm test **131/131 passed**;
git diff --check passed. Deterministic rendering tests cover active/upcoming
badges and mixed cards; component lifecycle tests cover exact activation/expiry,
pageshow/visibility resume, one pending timer and complete cleanup.
No browser/device/visual QA was requested or performed; no pixel-level claim.
Native deployment succeeded.

Coordination baseline: GitHub master `83f421be0d814291ccca345b674dba052856eb2e` (merged PR #74).
Latest completed Actions before this documentation PR: #224 / 34232336118,
pull-request validation succeeded, updated 2026-09-08T13:30:24Z.
Latest scheduled importer: #223 / 34229674381 failed, updated 13:22:19Z,
at “Advance partner sources through the shared orchestrator”.
No importer run or provider retry was started for this presentation change.

Last native source counters were read during v237, not refreshed in v238:
Douglas generation 23 completed (50,656 raw / 3,114 accepted / 2,559 review /
44,983 rejected); Flaconi generation 35 failed (1,000 raw / 102 accepted /
34 review / 864 rejected); Brasty generation 18 completed (12,999 raw /
11,180 accepted / 1,523 review / 296 rejected); Notino generation 25 completed
(6,945 raw / 3,406 accepted / 661 review / 2,878 rejected).
These are importer counters, not public live-offer counts. No fresh public-offer
or example-count audit was performed here. Known Flaconi freshness limitations
remain. The v237 domain audit remains the latest; no domain changes made.

Completed: requested badges, distinct active glass and publication. No unfinished
UI task from this request. Next: the owner's next instruction; before advertising,
verify live availability and campaign conditions. Do not claim all feeds healthy.
Report deferred at the owner's standing request; no email sent. Last observed
delivered report #017 is historical and must be rechecked before sending.

## Current state: separate Flaconi campaign cards (Sites v237 / 2026-09-08)

Published at `2026-09-08T13:28:53.794085+00:00`, environment revision **18** unchanged.
Source: `c8855e453c3035f8a88a7134da0a8210e696b531`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_55366248787c819197b74c1b23fc1c45`.
Deployment: `appgdep_6aa00d84390c8191b3b864a6e8f0b743`.
URL: https://perfumetr.borodzicz85.chatgpt.site.

Owner correction: BEAUTY on 9 September and DEAL1 on 10 September must be
separate promotions. HomepagePromotion now renders one independently expandable
glass card per campaign ID instead of grouping campaigns by merchant. Each card
retains its date/code, conditions and own example links. Stable campaign keys
preserve the other card's state when a campaign expires. Douglas remains separate.
Coupon rates, time boundaries, exclusions, offer selection, imports, environment,
routes and existing visual material are unchanged. Four v236 bundles are retained.

Validation: standalone Sites build passed; npm test **130/130 passed**.
Rendering assertions require three independent cards (two Flaconi + Douglas),
unique disclosure controls, separate BEAUTY/DEAL1 dates and codes, initially
collapsed state and three example links per synthetic Flaconi campaign.
No browser QA was requested or performed. Native production deployment succeeded.

Audit baseline: GitHub master `4dff5cfad628da1b32d9579e7df34557ac2ac5d8` (PR #73).
Latest scheduled Actions #223 / 34229674381 failed at "Advance partner sources
through the shared orchestrator"; preceding PR validation #222 succeeded.
Native source state read for this correction: Douglas generation 23 completed
(50,656 raw / 3,114 accepted / 2,559 review / 44,983 rejected);
Flaconi generation 35 failed (1,000 raw / 102 accepted / 34 review / 864 rejected);
Brasty generation 18 completed (12,999 raw / 11,180 accepted / 1,523 review / 296 rejected);
Notino generation 25 completed (6,945 raw / 3,406 accepted / 661 review / 2,878 rejected).
These are importer counters, not public live-offer counts. Public offer counts
and example availability were not newly audited for this presentation-only fix.
perfumetr.pl and beta.perfumetr.pl are active with active SSL;
www.perfumetr.pl remains pending with pending_validation SSL.

Completed: requested promotion separation and publication. No active task left
from this correction. Known feed-freshness limitations from v236 remain; do not
claim the latest full Flaconi import succeeded. Next: the owner's next request;
before advertising, check actual current availability and campaign conditions.
Report deferred at the owner's standing request; no report or email sent.
Last delivered report observed previously was #017; recheck before sending.

## Current state: scheduled Flaconi campaigns (Sites v236 / 2026-09-08)

Published successfully at `2026-09-08T12:49:47.036133+00:00`, environment revision **18**.
Source: `c202a60cc7b06ad2d18b34d9797a9980e122cb26`, canonical Sites main.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_60bee9cf1de48191b64ad361a450ca70`.
Deployment: `appgdep_6aa0045bb1b081918f60b0b945b94bdb`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner requested the new Flaconi coupon, verified conditions, three eligible
examples like Douglas, and immediate publication. Advertising is a later task.

- Added a separate, initially collapsed Flaconi glass panel beside Douglas.
  Both reuse the neutral shared glass material. Three internal comparison links
  per campaign are resolved from current offers, not guessed or external shop
  destinations. Exclusions are behind an accessible secondary disclosure.
- BEAUTY: 9 September, 10% for one product, 11% for two, 12% for three;
  13% from four products only in the Flaconi app. The comparison engine represents
  only **10% for one bottle**, not a misleading 10–13% price range.
- DEAL1: 10 September, 10% on eligible perfumes. DEAL2 is for other categories
  and is intentionally not configured for the perfume catalog.
- The advertiser explicitly labels 00:01–23:59 CET. Configuration follows literal
  UTC+01:00: BEAUTY 2026-09-08T23:01Z to 2026-09-09T22:59Z;
  DEAL1 2026-09-09T23:01Z to 2026-09-10T22:59Z. The expanded conditions explain
  Polish summer-time equivalents (01:01 through 00:59 the following day).
  No public confirmation that the sender intended CEST was obtained.
- The new runtime configuration contains fla-beauty-260909 and fla-deal1-260910.
  It replaces only previously expired managed campaigns; non-runtime imported
  coupons are preserved. Other environment entries were not changed.
  Coupons initialize through existing lazy verified-coupon synchronization.
- All excluded brands from the advertiser notice and two catalog aliases are
  covered. Without a SKU exclusion list, ANNEMARIE BÖRLIND is conservatively
  excluded from automatic calculation. Steampod is outside perfume scope.
- Example selection requires verified active Flaconi/Awin merchant 18563/feed
  37697, active unambiguous source, matching GTIN/volume/concentration and listing,
  PLN positive prices, newest available observation, freshness under 18 hours.
  Up to three distinct fragrances are selected, with brand variety preferred.
  A product is removed if its only Flaconi offer becomes stale or unavailable.
- Four new v235 bundles are retained with hashes for already-open clients.
- Validation: standalone Sites build passed; npm test **130/130 passed**.
  Synthetic SQLite tests prove exact start/end boundaries, no early activation,
  10% single-bottle rate, brand exclusion, three matching examples, stale/OOS/
  mismatched-volume rejection and unverified-merchant rejection. Render tests
  cover independent collapsed merchant cards, conditions, SVGs and internal links.
  No browser QA or live HTTP probe was performed. Native deployment succeeded.
  Recent Worker logs returned zero events; production example names/counts
  therefore remain unobserved, not asserted. Public offer counts were not queried.
  A native coupon-table read immediately after deployment still showed old rows
  before the next lazy application sync; env revision 18 is confirmed deployed.

Fresh coordination baseline: GitHub master `1eb8fa8cf3f8032cd5f96b9ef0b46b1ddf25419a` (PR #72).
Latest scheduled importer Actions observed: **#221 / 34213511122**, failure,
updated 2026-09-08T10:37:30Z, at "Refresh CJ price sources only".
Preceding #220 / 34212255613 succeeded. No workflow was manually dispatched.

Native source state read 2026-09-08 before this deployment:
- Douglas generation 23 completed at 10:13:04.362Z: 50,656 raw received,
  3,114 accepted, 2,559 review, 44,983 rejected. The prior failed-finalization
  snapshot is historical; these counters do not replace a public-offer audit.
- Flaconi generation 34 failed at 07:59:31.583Z after 4,000 raw received:
  412 accepted, 150 review, 3,438 rejected; total unknown, next offset 4000,
  safe error import_failed. A complete fresh feed is not confirmed.
- Brasty retains generation 18, failed; Notino generation 25 completed with
  scope_skipped on the latest price-only observation. Do not call all feeds healthy.
  Old snapshot counts elsewhere below are historical, not current offer counts.

Remaining: confirm the next scheduled Flaconi refresh, production example count
and coupon activation from actual requests before advertising. Do not bypass
provider quotas, manually substitute a feed, or advertise 13% on one bottle.
The user's next intended task is advertising, once requested.
Report: deferred at the owner's standing request; no email sent for this change.
Newest delivered report observed in the connected mailbox is #017; recheck Sent
and template #003 before assigning any later report number.

## Current state: unified glass catalog and faster first results (Sites v235 / 2026-09-07)

Published successfully at `2026-09-07T15:50:30.730607+00:00`, environment revision **17**.
Source: `30a0bfcbf89332c7f0798f2b2daac2337b285db6`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_4b4a91f79ca081918ce00a05b1c9d233`.
Deployment: `appgdep_6a9edd331ef881918aff39c6c52b9fc9`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner requested that "Przeglądaj perfumy" match the minimalist matte-glass
site, fix overlapping mobile sorting text and open more smoothly.

- Source inspection found old warm/opaque light catalog layers and a mobile
  pseudo-label overlaid on a native select, with competing fixed widths.
  The catalog now uses the existing neutral 28% tint / 10px shared glass tokens
  and a final ID-scoped stylesheet. Native and WebKit backdrop properties match;
  accessibility fallbacks remain. Old light/brown layers no longer style the
  public drawer, its controls, cards or detail pricing.
- One outer glass layer replaces stacked drawer/backdrop/header/toolbar/filter
  blurs. The header is outside the scrolling content; controls and bottle tiles
  have borderless translucent fills. Cards use the actual existing bottle
  images, with no new image assets or heavy per-image filters.
- Categories are visible directly (four buttons; two columns at narrow widths),
  optional brand/type/volume filters stay behind "Filtry", and sorting is one
  real native 16px select with responsive width. Removed the duplicate sort
  controls, compact overlay label and scroll-hint observer/listeners.
  Cards use 4/3/2 columns, clear names/prices and the hint "Wybierz zapach,
  potem pojemność." Detail volume selection, real prices and comparison remain.
- First browse request now asks for 12 instead of 24 items and does not wait for
  brand facets or full catalog statistics. Additive GET /api/catalog?facets=only
  returns metadata independently when filters are opened; facets=1 and all
  existing clients remain supported. Errors/retry/12-second timeout for optional
  metadata do not remove or delay loaded cards.
- Pointer/focus/touch intent can start a single first-page request before click.
  It is consumed once, expires after 15 seconds, aborts superseded requests and
  respects saveData/2g. This is not a persistent price or cursor cache; responses
  remain private/no-store and reopening revalidates from the API. Existing cards
  can stay visible but inert while refreshing. Exact variant pricing still uses
  a fresh no-store comparison request. No 18-hour freshness gate was weakened.
- Memoized cards with stable callbacks avoid rerendering the whole grid during
  brand typing. Existing lazy/async images remain. Short opacity/transform
  transitions and finite skeleton pulses respect reduced-motion preferences.
  No dependency, extra global listener or unconditional catalog prefetch added.
- Fixed an adjacent navigation interaction: closing the catalog history entry
  must not increment the parent search-session revision and cancel the perfume
  just selected from it. Actual view/variant history changes still reset search;
  v234 back/landing/re-entry behavior and pageshow price refresh remain.
- Production build/artifact validation and **128/128 tests passed**.
  Seven added deterministic cases cover history close/selection, single-use
  preload, expiry/abort/API errors, pointer/keyboard/reduced-data opening,
  independent facet failure/recovery, rapid sorting/one-shot 409 retry and
  facet-only API query isolation. Source/rendered regressions cover the new
  glass/native sorting contract and legacy API compatibility.
  Focused ESLint passes for all four changed logic files. Optional repository
  tsc --noEmit remains unsuccessful on existing Workers bindings/importer
  typing issues outside these changed files; no diagnostics name the changed
  catalog/navigation/layout files. Do not call the global type check clean.
  No browser/DOM/physical-device QA, screenshot acceptance or measured live
  speed improvement is claimed. Exact v234 public client graph retained.
- GitHub baseline `39ad5998be5959d9e4a578aa584ffbbff40c689c` (merged PR #71).
  Latest completed validation #211 / 34136422847 succeeded on
  `df0de4ff43ee56fe9f1b7e6605bbd17380030592`, updated 15:05:14Z.
  Latest scheduled production #210 / 34132999119 remains completed/failure
  at 14:44:48Z: validation succeeded, partner-source advance failed, full
  TradeDoubler skipped. No importer was started, retried or canceled here.
- No fresh all-store offer counts or generation counters were read. The dated
  v233 generation-21 counters (raw 50,440 / accepted 3,001 / review 2,652 /
  rejected 44,787, paused import_failed, completed_at null) remain historical
  evidence, not current public-offer totals or a completed snapshot.
  Douglas full finalization remains unresolved. No new owner export is needed.
- No importer, source data, schema, scheduler, secret, campaign or price change.
  Report deferred until explicitly requested; no email sent. Last confirmed #016.
- Next: owner feedback on the deployed catalog; if explicitly requested, perform
  browser/device layout and latency measurement. Separately diagnose Douglas
  finalization / #210 before certifying a full snapshot. No further UI work is
  in progress. This checkpoint changes documentation only in Index.

## Current state: return to an empty search panel (Sites v234 / 2026-09-07)

Published successfully at `2026-09-07T15:03:36.436052+00:00`, environment revision **17**.
Source: `9c3aabd3fd140ba2073071a766c2f4a0ce9ad6f0`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_03d4457271d481919c109f8da88e0eee`.
Deployment: `appgdep_6a9ed23993f481918aa9e4c8493beb50`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner requested a visible way back from a perfume comparison to the ordinary
search panel and reported that logo -> landing -> generic comparison CTA restored
the previous perfume.

- Root cause: the search component stays mounted behind the landing panel.
  Clearing initialVariantId alone did not reset its selected/query/status state;
  generic openSearch also left a previous variantId in the URL.
- Added a compact "Wróć do wyszukiwarki" button above the search field for every
  non-idle state, including loading, matches, found, not-found and error.
  It clears selection, query, suggestions, result groups, offer dialog and transient
  feedback state, restores the ordinary search/promotions panel and focuses the
  search wrapper without forcing the mobile keyboard. No document reload.
- Every explicit search entry carries a primitive search-session revision.
  Generic landing CTA and logo navigation reset the existing component even when
  initialVariantId was already undefined. Native history navigation resets the
  corresponding intent; pageshow alone preserves the current comparison so a
  return from a shop can still refresh prices.
- Reset cancels suggestion, comparison, background price refresh and result-list
  requests, invalidates their sequence guards, and clears the pending variant,
  loading transition timer and delayed result-scroll timer/frame. Old responses
  cannot restore a canceled perfume. Existing homepage/catalog data is retained.
- Generic search URL explicitly uses view=search and removes stale variantId/hash;
  back replaces the current search history entry and preserves other framework
  state. Landing bottle and campaign links still select exact variants; modified
  clicks retain native anchor behavior. UTM values remain unchanged.
- The new native button uses the shared matte-glass tokens, local SVG back icon,
  44px target and visible keyboard focus. No new dependency, analytics action,
  API, importer, schema, scheduler, credentials, prices or campaign changes.
- Production build/artifact validation and **120/120 tests passed**.
  Five added deterministic tests execute actual component handlers/effect cleanup
  with synthetic delayed I/O: found/empty/error/loading returns, late search and
  comparison results, queued transition/scroll, background refresh cancellation,
  mounted logo/CTA reopening, bottle/history targets and modified-click behavior.
  These are component-state tests, not browser, DOM or physical-device QA.
  React review used direct imports, stable callbacks, primitive navigation
  dependencies and complete abort/timeout cleanup. Exact v233 public client
  asset graph retained with existing digest/dependency coverage.
- GitHub baseline `5af4a17f8d5d9db91741f5109a703fb71d3920d2` (merged PR #70).
  Latest completed validation #209 / 34132656072 succeeded on
  `ee5cc826be3244eab4b00f188e9b346f5ee8db56`.
  Latest scheduled production #210 / 34132999119 ended failure at
  2026-09-07T14:44:48Z. Validation job 101777354931 succeeded; partner-source
  advance in import job 101777397560 failed. Full TradeDoubler was skipped.
  This navigation task did not inspect that job's detailed source failure,
  retry/cancel an import or certify a completed snapshot.
- No fresh all-store offer count or new generation counters were read.
  The dated v233 generation-21 counters and finalize_generation/import_failed
  incident below remain the last detailed Douglas evidence, not current counts.
  Douglas full finalization remains unresolved; no new owner export is needed.
- Report deferred until explicitly requested; no email sent. Last confirmed #016.
- Next: owner feedback on the back/search interaction; separately inspect #210's
  bounded source failure and diagnose Douglas finalization before claiming a
  complete snapshot. No further UI task is in progress.

## Current state: three internal Douglas campaign examples (Sites v233 / 2026-09-07)

Published successfully at `2026-09-07T14:16:45.336563+00:00`, environment revision **17**.
Source: `6c0b82df8785745614fe521ba904fb91f5b49e9b`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_c50c99f068308191b8a0ac0e08549eb1`.
Deployment: `appgdep_6a9ec73db8fc8191bf434b81a82b0803`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner explicitly requested internal product comparison links and three
different example perfumes under “Przykładowe oferty promocyjne”.

- Replaced the external product CTA with a compact list of internal variant
  links. Normal clicks call the existing comparison loader in the same page;
  modified clicks/no-JS retain a real same-origin variant deep link.
  The separate external link is explicitly labelled “Warunki promocji w Douglas”.
- Selected three exact variants from Douglas's current SUPERCENY campaign:
  Prada Paradoxe EDP 90 ml (1027980 / GTIN 3614273760164),
  Chloé Nomade EDP 75 ml (996998 / GTIN 3614223113347),
  Rabanne Invictus EDT 100 ml (753762 / GTIN 3349668515660).
  Current campaign source: https://www.douglas.pl/pl/c/promocja/76,
  read 2026-09-07. Original official owner export independently contains each
  exact in-stock record. No prices from the export or public page are hardcoded.
- The homepage resolves these three known source product IDs to actual live
  catalog variant IDs using a bounded primary D1 read. It requires matching
  GTIN/concentration/volume, public standard variant, active source without a
  review reason and a verified active Douglas/AWIN merchant with a fresh
  positive PLN offer. Newer out-of-stock observations prevent linking an older
  in-stock price. Missing/hidden/stale examples are omitted; no valid example
  means no campaign product links. A failed read is no-store and fails closed.
- The additive examples array retains the singular example for old clients.
  New controls ignore old external example URLs; beta schema=4 avoids the old
  cached campaign payload. Existing date expiry, no-code rules, glass,
  collapsed disclosure and SVG controls remain.
- Production build/artifact validation and **115/115 tests passed**.
  Extended rendered link/count/cached-payload coverage and added synthetic
  SQLite checks for all three, stale prices, wrong volumes, a newer OOS row,
  hidden variants, unverified merchant and campaign expiry. React review:
  direct imports, parallel independent homepage reads and reuse of the existing
  abortable comparison flow; no dependencies or extra client listeners.
  v232's public asset graph is identical to the already-retained v231 graph.
  No browser/physical-device QA was performed. Native deployment-probe
  homepage requests were canceled; a successful live three-example payload
  was not observed in logs during this checkpoint. Do not claim screenshot
  acceptance or a measured live example count from the test fixtures.
- Index baseline `f814198d58425904667353a7349b6b0652880f9f` (merged PR #69).
  Its validation #208 / 34130345626 is now completed/success on
  `d2598ece6889f89a7677101565ccdaa6dd66d481`.
- Important operational update: existing isolated Douglas #201 / 34111753158
  attempt 2 ended failure at 2026-09-07T14:17:44Z. Native Worker logs identify
  stage finalize_generation, code import_failed, response 503. This is not a
  provider 429 and not proof of an identity failure in the three example rows.
  Live generation 21 received **50,440**, accepted **3,001**, review **2,652**,
  rejected **44,787**, cursor/total **50,440**, revision 4, state paused,
  error_code import_failed, completed_at null. Do not label it a completed
  snapshot or equate counters to fresh public offers. It differs from the
  earlier diagnostic export's 50,481 rows because it is a separate live fetch.
- v232's three exact Prada active/fresh-offer proofs remain the last observed
  product-level evidence (13:55:01.084Z), not a new all-store inventory count.
  No additional import was started/retried/canceled for this UI change.
  No importer, schedule, schema, secret or freshness policy was changed.
- Report deferred until explicitly requested; no email sent. Last confirmed #016.
- Next: owner feedback on the internal campaign examples; separately diagnose
  the bounded Douglas finalization failure before certifying generation 21.
  Do not restart the full feed or manufacture manual offer records.

## Current state: verified Douglas Paradoxe bottle identity repair (Sites v232 / 2026-09-07)

Published successfully at `2026-09-07T13:53:07.939325+00:00`, environment revision **17**.
Source: `272fe1cfab93fe578864b2ac3ba433a02bfb07d0`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_271e135c741481919f4ecfe6e2d412d6`.
Deployment: `appgdep_6a9ec1b3b32c8191b7c72bf62d700139`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner supplied the official Douglas/AWIN export and authorized resuming
the missing Prada offer investigation. File access now works; do not repeat
the previous access blocker or ask the owner to make another export.

- Diagnostic export contains 50,481 raw rows and 86 columns. Exact merchant
  product 1027980 is Prada Paradoxe Refillable EDP 90 ml, GTIN 3614273760164.
  Its original row passes the production gzip/CSV parser as an in-stock
  product. The extra selected columns do not prevent parsing.
- Reproduced the matcher failure: Douglas's line "Paradoxe Refillable" does
  not match catalog "Paradoxe", despite corroborated exact GTIN, EDP,
  women/standard and volume. Existing conflict/recovery paths both retain
  this line check. The export was diagnostic evidence only and was never
  substituted for the automatic official feed.
- Added a Douglas-only line alias for confirmed ordinary bottle GTIN/volume
  pairs 3614273760713/30 ml, 3614273760652/50 ml and
  3614273760164/90 ml. Brand, complete line, EDP, women, standard and exact
  GTIN/volume must all match. The separate 100 ml refill, other Paradoxe
  lines, unknown GTINs and conflicting dimensions remain excluded.
- Import revision 3 -> 4 requests a fresh official Douglas generation.
  Preserved original observed prices/timestamps, source identity,
  quarantine, 18-hour public freshness and existing endpoint contract.
  No manual price, source replacement, schema, secret or scheduler change.
- Added bounded persisted identity-result logs for these bottle aliases:
  product/variant IDs, source status/reason and fresh-offer existence only.
  No raw payload, authenticated URL or private mail is logged or committed.
- Production build/artifact validation and **114/114 tests passed**.
  Tests cover positive/negative identity cases and a synthetic SQLite
  recovery preserving price and timestamp, plus revision refresh.
  Exact public v231 asset graph retained. No browser/physical-device QA.
- All v231 UI changes remain, including balanced glass, TikTok/full Instagram
  footers and the prior explicit official Douglas campaign destination.
- GitHub Index baseline `c8661e47d01513a7e5ff69812da10a19a72a3d63`
  (merged PR #68). Latest baseline validation #207 / 34118909424 succeeded;
  previous completed scheduled production #204 / 34112940046 succeeded.
- One bounded retry of failed isolated Douglas run #201 / 34111753158 was
  authorized by the owner's request to finish the repair. Attempt 1 failed
  with orchestrator_unavailable, not provider 429; only its Douglas source
  job is retried. Other sources are skipped and no schedule was changed.
- Production proof at `2026-09-07T13:55:01.084Z`: persisted Worker logs
  report active/fresh offers for product 1027980 -> `tdv-397ad387126b397b34c7ed4a`
  (90 ml), 1027979 -> `tdv-752cbc0a2d254650fdf7fc2d` (50 ml), and
  1027978 -> `cjv-7d87fa05c60d3852c34fc416` (30 ml). Each hasFreshOffer=1.
  This verifies the three exact offers, not an all-store fresh-offer total.
- At `2026-09-07T13:57:17.708Z`, attempt 2 remains in progress. Live generation
  21 has received 10500, accepted 731, review 710, rejected
  9059, cursor 10500, revision 4, error_code null. Source is paused between
  bounded steps; workflow continues normally. These are partial snapshot
  counters, NOT final counts or current public-offer totals.
- The reported missing 90 ml offer is fixed and verified on production.
  Full generation completion has NOT yet been certified. Do not restart
  this running import, retry 429, or claim that the old completed
  generation 20 counters describe the current generation.
- Report deferred until the owner explicitly requests the consolidated report;
  no email sent. Last confirmed delivered report #016.
- Next: read the existing attempt 2 terminal result and generation 21 counters
  at the next operational check; preserve the verified offer fix and wait for
  the owner's next requested task. No further owner feed/export is required.

## Current state: balanced cross-browser glass and TikTok footers (Sites v231 / 2026-09-07)

Published successfully at `2026-09-07T11:51:33.587665+00:00`, environment revision **17**.
Source: `b3ba5c983fdbe8e74efd76f322edffcd7dc85a0d`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_1aa0b84140148191afbb6535c535e234`.
Deployment: `appgdep_6a9ea5394c588191b8eeafb7e19e71e8`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

Owner supplied IMG_0818.jpeg: mobile panels looked dense while desktop looked
almost transparent. Requested one intermediate material and then TikTok in
the footer. No desktop screenshot/browser version was supplied.

- Source inspection confirmed the same old 15% base tint at both breakpoints,
  combined with blur(12px), saturate(1.04), brightness(.86). The photographic
  cover crop/position differs with viewport size, so perceived density depends
  strongly on the scenery beneath each panel. No exact device-specific root
  cause or Safari renderer fault was established.
- Also found a real compatibility weakness: all material variables were behind
  body:has(.perfumetr-experience), so browsers without :has support could lose
  the panel fill/filter. This is a potential additional contributor, not a
  confirmed fact about the owner's desktop. Tokens now live on :root.
- Shared glass now uses a neutral rgba(64,89,105,.28) base tint with a subtle
  highlight gradient and blur(10px) only. Removed the material's additional
  brightness/saturation filter. Both unprefixed and WebKit properties use the
  same variable; no width-specific material overrides. Header and inline
  feedback now share it with the bottle card, offers, promotions, search/footer.
  Existing scene composition, motion, one-page navigation and prices remain.
- Added a supports fallback: browsers supporting neither backdrop property
  retain a 46% neutral translucent fill. Reduced-transparency settings still
  use opaque accessible fallbacks; reduced motion remains honored. Do not
  promise pixel-identical output on different screens or with such preferences.
- Added reusable, stateless TikTokLink to both landing and comparison footers.
  Destination https://www.tiktok.com/@perfumetrpl is the owner's supplied
  profile without transient share parameters. Full @perfumetrpl text,
  accessible new-tab label, noopener/noreferrer and local monochrome Simple
  Icons SVG. No embeds, TikTok scripts, network listeners or new dependencies.
  Public profile retrieval could not be verified; destination comes from owner.
- Contacts wrap naturally with compact gaps and 44px targets. Landing no
  longer uses space-between for contacts; full Instagram name also remains
  visible at the smallest breakpoint. v230 flow footer, promotion heading and
  centered desktop feedback are preserved.
- Production build/artifact and **112/112 tests passed**. Added a rendered
  TikTok regression and extended existing glass checks for root tokens,
  fallback and unchanged accessibility behavior. React Best Practices review:
  direct imports, stateless component, accessible link, no added client work.
  No browser/physical-device QA or screenshot acceptance is claimed.
  Exact v230 public asset graph retained with digest/dependency tests.
- Index baseline `f050c769af1c0c23ae873c1398ff97f1c5d9daa6` (merged PR #67).
  Latest completed validation **#206 / 34117097042**, success; latest scheduled
  production **#204 / 34112940046**, success. No live offer totals were read.
  No importer, schema, data, scheduler, secrets or domain changes; no manual run.
- Douglas missing Prada offer diagnosis remains paused pending the owner's
  official AWIN download file. No export received or missing offer fixed here.
- Report deferred until requested; no email. Last confirmed report #016.
- Next: owner feedback on the intermediate material or the promised AWIN file.

## Current state: flow footer, promotion section and centered feedback (Sites v230 / 2026-09-07)

Published successfully at `2026-09-07T11:30:44.416736+00:00`, environment revision **17**.
Source: `1285a621dd7ab603b856e71e54b158f34ec24229`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_2030ec258e34819198ec0d2401a8daa9`.
Deployment: `appgdep_6a9ea04234a48191a53c72f7020c0a3e`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner supplied IMG_0816.jpeg and requested a footer at the bottom of short
screens, nearby email and full Instagram handle, “Aktualne promocje” below
feedback and centered desktop feedback. Douglas feed diagnosis remains paused.

- Fixed the actual later CSS override that changed the search app to block
  layout. It is now a flex column with 100svh/100dvh minimum height, an auto
  top margin on the footer, safe-area-aware bottom padding and a small content
  gap. The footer remains in normal flow, follows expanded content and never
  covers offers. It is not a fixed/sticky overlay.
- Removed the mobile space-between/icon-only overrides. Email and the full
  @perfumetr.pl handle are start-aligned with a 14px gap, naturally wrap on
  narrow screens and retain 44px touch targets. Explicitly restore the handle
  even below the older 380px breakpoint. Copy-email and Instagram actions remain.
- Search feedback is centered under the full search field on desktop; the
  existing mobile full-width control remains. Added an accessible “Aktualne
  promocje” section after feedback in actual document order, not only CSS
  order. Promotions remain collapsed, slide open, use transparent matte glass
  and retain their original dates, expiry, official merchant link and safeguards.
  Section visibility follows the existing promotion availability state.
- Production build/artifact validation and **111/111 tests passed**. Updated
  the existing discovery regression for order, heading, centering, footer flow
  and visible contact label; no browser or physical iPhone QA was performed.
  Preserved the exact v229 public asset graph and dependency/digest coverage.
- No price, import, identity/freshness guard, schema, runtime, schedule, domain
  or production data change. No workflow dispatched, cancelled or retried.
- Index baseline `9f3d425bc4197d843adecdf4b0f485b5cf99d085`: merged prior
  documentation PR #66 after its validation **#205 / 34114203023** succeeded.
  Latest scheduled production **#204 / 34112940046** is now completed/success,
  superseding v229's in-progress status. This does not certify a Douglas Prada
  offer or any current all-store total; no current live offer counts were read.
- Missing Douglas Prada Paradoxe EDP 90 ml offer remains unresolved. Owner
  is obtaining the existing AWIN download file for one-time diagnostic evidence;
  no file received here. Do not restart investigation until it is provided or
  the owner returns to it. Automatic import behavior has not been replaced.
- Report: deferred at the owner's request; no new email. Last confirmed #016.
- Next: owner feedback on the updated layout, or the promised AWIN file.

## Current state: minimal store copy and compact footer (Sites v229 / 2026-09-07)

Published successfully at `2026-09-07T10:57:10.912295+00:00`, environment revision **17**.
Source: `97a5e8c61409a68f8b3fba80d9883eceec9687de`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0dc997761b1081919be9ce0b303fd5e5`.
Deployment: `appgdep_6a9e987995cc819181ecc8854954178a`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta share this application.

The owner's annotated screenshot marked the two store-count slogans, the
623-brand count and the large search-footer panel. The owner explicitly
paused the Douglas investigation and asked to do these UI changes first.

- Both landing and search now say “Zweryfikowane drogerie. Ceny odświeżane
  codziennie.” in compact sentence case. Removed the supported/fresh store
  counts, pulse and divider from this shared copy. The logo rail also has a
  nonnumeric accessible label and store-name tooltips. Actual verified/fresh
  eligibility and internal integration counters remain unchanged.
- Removed the brand-count line under search entirely, including its placeholder.
  Feedback remains directly under the field, with the redundant gap removed.
- The comparison footer uses a compact grid. On mobile, email and the accessible
  Instagram icon share one row; “O porównywarce” and “Prywatność” share the next.
  Kept 44px touch targets, smaller icons, light 12–13px text, 10px vertical
  mobile padding and the existing transparent matte-glass surface.
- Native details/summary keeps the short source/link explanation collapsed by
  default. Removed the prominent index date and redundant hidden tagline.
  Email copy, Instagram destination, privacy preferences and readable focus
  states remain. No new JavaScript state or dependency.
- Production build/artifact checks and **111/111 tests passed**. Updated the
  existing UI/SSR expectations for the deliberately removed counts and new
  footer; no separate CSS test suite or browser/iPhone visual QA is claimed.
  The first suite pass found one remaining old StoreCoverage count-prop
  assertion; corrected it and the full final suite passed.
- Preserved the v228 public asset graph. No price, import, schema, scheduler,
  secret, domain or production data changes; no manual import/retry/cancellation.
  v228's explicit Douglas store CTA and removal of bottle source captions remain.
- Index baseline `e158bab0834ed506bf456b63bd4d094062e0122c` (PR #65).
  Latest finished docs validation **#203 / 34112064092** succeeded.
  Scheduled production **#204 / 34112940046** was still in progress at the
  pre-publish read; do not claim it completed or interrupt it. Prior isolated
  Douglas #201 failed; last known completed production success remains #194.
  No current live all-store offer totals were queried for this visual task.
- Douglas help requested: a one-time official AWIN/Douglas feed export would
  support finding GTIN 3614273760164 / Prada Paradoxe EDP 90 ml. It is diagnostic
  evidence only, never a replacement for automatic imports or permission to
  publish manually prepared data. Missing-offer cause remains unresolved and
  paused at the owner's direction; no export has been received.
- Reporting: no new report requested/sent; deferred. Last confirmed report #016.
- Next: owner feedback on this smaller UI. Resume the bounded Douglas
  product-level diagnosis only when the owner returns to it or provides the export.

## Current state: Douglas campaign link and bottle-caption repair (Sites v228 / 2026-09-07)

Published successfully at `2026-09-07T10:29:53.053569+00:00`, environment revision **17**.
Source: `f79ad647075f15fd64416c0607c98d4f4f3224d2`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_35b457ae2078819199292c50b5ce5564`.
Deployment: `appgdep_6a9e92027a048191b1e86a9aae463871`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta keep the shared application.

The owner reported that the Douglas campaign opened Prada Paradoxe EDP 90 ml
with only Brasty/Aelia offers, and that the Aelia photo credit overlapped its image.

- Confirmed UI cause: the editorial campaign unconditionally linked variant
  `tdv-397ad387126b397b34c7ed4a`, without checking for an eligible Douglas offer.
  This was already recorded as no fresh Douglas offer in the separate v225
  campaign evidence. The banner itself neither imports nor creates offers.
- Corrected the campaign CTA to explicitly open the exact official Douglas
  product, https://www.douglas.pl/pl/p/5010687030?variant=1027980, with
  “Zobacz Prada Paradoxe · EDP · 90 ml w Douglas” and an external SVG icon.
  The optional example.url field is additive; cached data lacking it safely
  links to Douglas campaign terms rather than an unrelated internal comparison.
  Existing variantId metadata, expiry, exclusions and no-code rules remain.
- Removed the shared BottleVisual source-credit anchor and all its CSS.
  No visible source caption remains under a bottle. Product names, alt text
  and provenance/license metadata remain; an image title preserves the source
  description without taking layout space. No images were edited.
- Production build/artifact validation and **111/111 tests passed**. New
  rendered tests cover source-caption absence in loading/ready/failed/no-image
  states, the exact merchant CTA and legacy campaign payload fallback.
  Preserved the v227 public asset graph. No browser/physical iPhone QA claimed.
- Douglas' official page showed the exact 90 ml variant online at the read.
  That is merchant-page evidence, NOT a licensed-feed record or an imported price.
  No price was hardcoded, no offer invented, no identity/freshness guard loosened.
- Native production catalog_import_sources read: Douglas generation 20 is
  completed, received 51,353 / accepted 3,113 / review 2,560 / rejected 45,680,
  error_code null; completed 2026-09-06T19:40:59.328Z. These are snapshot
  counters, NOT current fresh public offer totals. Flaconi generation 30
  independently failed with import_failed at 2026-09-07T08:06:09.562Z.
  Do not blame the Flaconi failure for this missing Douglas product.
- **Still unresolved:** the exact product-level reason Douglas GTIN
  3614273760164 is absent from comparison. The available native D1 row reader
  has no exact-record filter; the public compare response could not be read
  from this workspace. Feed omission, review/identity rejection or freshness
  were not distinguished. This release fixes the misleading link and overlay,
  NOT the missing comparison offer. No importer or production data was changed.
- Index baseline `bebee46ee37dcf1026b53a2a3de630d2e6410f27` (PR #64).
  Pre-deployment Actions **#200 / 34109315955** succeeded. While this repair
  was being documented, scheduled isolated Douglas run **#201 / 34111753158**
  failed at 2026-09-07T10:31:51Z in “Advance the isolated Douglas source only”.
  Validation passed; other sources were skipped. Its Worker orchestrator request
  recorded a canceled outcome. A fresh native D1 read still showed completed
  Douglas generation 20 with unchanged counters and no source error code.
  This later failed refresh is NOT proof of why the earlier screenshot lacked
  Prada; do not claim the product-level cause is known. Previous scheduled
  #195 / 34095993956 also failed; last known production success remains
  #194 / 34072637983. Docs PR #65 initial validation **#202 / 34111881004**
  succeeded. No workflow was manually dispatched, cancelled or retried here;
  no current all-store total.
- Report: not requested; deferred. No new email; last confirmed report #016.
- Exact next task: obtain an authorized, bounded product-level AWIN/Douglas
  record/status/reason lookup for GTIN 3614273760164 / article 1027980 and its
  mapped listing, then repair only an evidenced mapping/import defect. Do not
  fabricate a feed row, expose a public SQL/debug endpoint or reset a full feed.

## Current state: compact campaign disclosure and clearer glass (Sites v227 / 2026-09-07)

Published successfully at `2026-09-07T10:01:17.270823+00:00`, environment revision **17**.
Source: `6289505189ecce1882d04d3703591f251a0564a9`, canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_dfa869e937d48191a313cdfa630e3ffa`.
Deployment: `appgdep_6a9e8b5f3d3c8191b4da4778f501cff7`.
URL: https://perfumetr.borodzicz85.chatgpt.site; perfumetr.pl and beta retain the shared application.

The owner supplied IMG_0808.jpeg and requested stronger transparency plus a
collapsed Douglas promotion. The campaign still had a separate almost-opaque
light background, so prior shared glass changes did not affect it.

- Campaigns now start collapsed. Douglas shows only its brand, “promocja
  7–13 września” and an SVG disclosure icon in a compact 56px-minimum row.
  A full-width native button toggles a CSS grid-height slide animation.
  The details use useId/aria-controls, aria-expanded, aria-hidden and inert;
  closed links cannot receive keyboard focus. Existing reduced-motion rules
  disable the transition. No disclosure preference is persisted.
- Campaign details preserve the precise Prada Paradoxe EDP 90 ml link,
  no-code explanation, exclusions, store terms and Warsaw expiry boundaries.
  Both remaining Unicode link arrows were replaced by existing SVG icons.
- Removed the opaque promotion background overrides in experience.css;
  glass-controls.css now applies the shared borderless glass to promotion.
  The shared tint is approximately 15% opacity, blur 12px, saturation 1.04
  and backdrop brightness .86. Search uses the same surface/filter rather
  than its former stronger separate fill. Main cards and footers inherit
  the change. Reduced-transparency settings retain solid fallbacks.
- Production build/artifact validation and **110/110 tests passed**, including
  a new rendered-HTML regression for the default collapsed state, matching
  disclosure IDs, hidden/inert details, exact summary and SVG links.
  No fresh browser or physical iPhone acceptance is claimed. The supplied
  screenshot and source were inspected; no development preview was started.
- Retained the exact v226 public asset graph alongside v220–v225. Digests and
  dependency closure passed. No price, importer, schema, runtime, schedule,
  domain, quota or production data changes; no manual workflow/import.
- Index baseline `63d9a2d1184aff055e80d06c3efacb46a0e0528f` (PR #63); preceding Actions
  **#199 / 34103080703** succeeded. Latest scheduled importer remains
  **#195 / 34095993956**, failed. The separate failed partner-step investigation
  is still unresolved; last known successful production run is #194.
  No current all-store totals or live merchant-price audit were performed.
- Report: no new report requested/sent; deferred until the owner's instruction.
  Last confirmed delivered report in this task's context remains #016.
- Next: await owner feedback on the collapsed promotion and clearer mobile
  glass. Preserve real price/variant identities, campaign expiry and accessibility.

## Current state: more transparent matte panels (Sites v226 / 2026-09-07)

The owner requested more transparency while retaining matte glass. Published
successfully at `2026-09-07T08:53:02.900005+00:00`, environment revision **17**.
Source `97e513a9927bc3dcf6a793aa1b8d3528c6e80e57` is pushed to canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_f8dbb99f38d48191adced2e6777cb76c`.
Deployment: `appgdep_6a9e7b6159d08191baecf880d01e768a`.
URL: https://perfumetr.borodzicz85.chatgpt.site; main and beta use this shared deployment.

- Reduced the shared panel tint from approximately 68% to 40% opacity, softened
  the gradient and reduced backdrop blur from 36px to 22px (saturation .92).
  Landing bottle card, comparison, offers, search results, feedback and footers
  share the same treatment. Outer panels remain borderless.
- Shared `--frost-backdrop` includes WebKit support. Reduced-transparency
  preferences restore an opaque surface and disable blur, including the landing
  bottle card. No component/navigation/price logic changed in this refinement.
- A concurrent v225 source update was detected before push. Rebased onto
  `557bccabb4ab2c21eb6e62348207211a3f1cc713`, preserving its date-bounded
  Douglas SUPERCENY information and tests. Related documentation PR #62 was
  still open at verification; this task does not merge that separate PR.
- Retained the exact public v224 CSS and rebuilt v225 public asset graph
  alongside older retained files, with digest/dependency checks.
- Final merged production build/artifact validation and **109/109 existing
  tests passed**. No new CSS tests or fresh browser/iPhone visual acceptance
  are claimed. No development preview was started.
- Index baseline: `02690b71d6067ff64f518b6e747ffd7f3883b0cd` (PR #61).
  Latest completed Actions check: **#198 / 34102407108**, success, PR validation.
  Latest scheduled production importer remains **#195 / 34095993956**, failed;
  last known successful production run remains #194 / 34072637983. No current
  all-store counts or merchant-price audit was performed for this visual task.
- No importer, production data/schema, schedule, runtime or domain changes;
  no manual import or provider retry. Prior www SSL limitation and separate
  failed partner-step investigation remain unresolved.
- Report: not required/deferred until the owner's explicit instruction; no
  new email sent. Last confirmed report remains #016.
- Next: await the owner's feedback on the clearer panels. Preserve the v225
  campaign addition and exact priced variant navigation in later updates.

## Current state: softer borderless glass (Sites v224 / 2026-09-07)

Owner requested small visual changes from three supplied screenshots: remove
visible panel outlines, use softer matte glass and make search closer to the
translucent rounded input with its button inside the field.

- Published successfully at `2026-09-07T08:37:18.156462+00:00`, environment revision **17**.
  Source: `5cc6e27f5dd72e28fbc6261c7a44a6df3195c06d`, canonical Sites `main`.
  Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_7543de36e9d481919edb4dccf7551cbc`.
  Deployment: `appgdep_6a9e779c2e3c81919d8922b4c2f4194b`.
  URL: https://perfumetr.borodzicz85.chatgpt.site; perfumetr.pl and beta share the same deployment.
- Styling changes are confined to `experience.css` and `glass-controls.css`.
  Main product, comparison, offers, feedback and footer panels use a neutral
  smoked glass tint and 36px backdrop blur. Removed visible outer borders and
  inset highlight shadows; main card/footer corners are 24px. The homepage
  caption no longer has a hard horizontal rule.
- The idle search stage has no surrounding box, so the search field can blur
  the actual photographic background. The field is translucent with a delicate
  control outline, 62px desktop / 58px mobile height and an inset rounded
  “Szukaj” button. Input remains 16px on mobile; the button text remains visible
  instead of an arrow-only control. Focus, loading and reduced-transparency
  states are styled consistently.
- Search-result card entrance fill is backwards, preserving the intended glass
  treatment after animation. Existing reduced-motion settings remain.
- No search, catalogue, price or navigation logic changed. v223's exact priced
  variant links and bounded read recovery remain. Retained the actual v223
  public bundles alongside the previous compatibility assets.
- `npm test`: build/artifact validation and **108/108 tests passed**.
  No new tests were added for these CSS changes. No fresh browser screenshot
  or physical iPhone visual acceptance is claimed. User supplied the visual
  references; no images were generated or altered.
- Index baseline: `ffa6f659c8e2460ded4685e507b9c3464d84f05a` (merged PR #60).
  Docs validation **#196 / 34100125419** completed successfully.
  The earlier in-progress production run **#195 / 34095993956** has now
  **failed** at 2026-09-07T08:25:17Z in “Advance partner sources through the
  shared orchestrator”; its validation job passed. This is a separate
  scheduled importer issue, not diagnosed or changed during this visual task.
  Last successful production run remains **#194 / 34072637983**.
  No import was dispatched, interrupted or retried. No current all-store
  counts or live merchant-price audit were performed.
- No production schema, importer configuration, schedules, domains, secrets
  or runtime environment changes. Prior www SSL limitation remains.
- Report: no new report requested or sent. Last delivered remains #016;
  future reports wait for the owner's instruction.
- Next: await owner feedback on the lighter panels/search styling. Separately
  inspect the failed scheduled partner step before making any importer claim;
  preserve normal quota and snapshot safeguards.

## Current state: homepage deal recovery (Sites v223 / 2026-09-07)

Published successfully at `2026-09-07T08:19:12.408923+00:00`, environment revision **17**.
Source `321e5be99ac71bec4c81d561a0878c1e44da627d` is pushed to canonical Sites `main`.
Version: `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_9ce6b64a751c8191b1c7747f53762709`.
Deployment: `appgdep_6a9e735293388191ab01e4106a5edbcd`.
Native URL: https://perfumetr.borodzicz85.chatgpt.site; existing main/beta domains keep this shared application.

The owner reported that Stronger With You had no price and opened generic search.
It was the hard-coded decorative fallback, not a priced catalogue variant.
A production log at **2026-09-07T08:00:30.925Z** recorded
`Homepage featured deal unavailable`; the associated main homepage request took
2,504 ms and returned HTTP success after its 2.5-second data deadline. The old
client permanently substituted Stronger With You and linked it to generic search.

- Removed that misleading product fallback. A visible bottle now always comes
  from a complete FeaturedDeal with its price, concentration, volume and exact
  comparison variant ID. A bounded status/retry control replaces unavailable data;
  no price or product identity is invented.
- Featured candidate selection uses indexed reviewed GTINs and EXISTS for a fresh
  eligible listing, avoiding the redundant all-merchant aggregation. Final prices
  still use the existing comparison calculation and strict 18-hour freshness,
  source, identity, coupon and delivery guards. Reads use first-primary sessions.
- Main featured reads have a 6-second deadline; other homepage data keeps 2.5s.
  The client uses an 8-second request limit and at most one automatic retry.
  `featuredStatus` distinguishes complete empty results from failed reads;
  failed responses are no-store, and the new client requests schema=4/no-store.
  The existing fields remain compatible with already-open clients.
- Compacted the mobile product stage (196px), removed the full-size empty
  product placeholder and tightened footer rows. Matte glass, palette, SVG icons,
  bounded motion and same-document search navigation remain.
- Retained v220/v221 assets and added the v222 public graph rebuilt from its
  exact source with the same lockfile, with hashes/dependencies checked.
- Build/artifact verification passed. Final automated suite: **108/108**.
  Added synthetic regression for Stronger With You EDT 50ml, including a
  2.7-second database delay and equality with its exact /api/compare response;
  also covered transient retry, complete-empty results and cancellation.
  No fresh browser/iPhone visual test or live merchant-price audit is claimed.
  Direct production JSON inspection from this workspace was unavailable.
- No production data, schema, importer, schedule, domain or secret changes.
  No manual import/workflow dispatch. Main and beta SSL active; www SSL remains
  pending validation. No coherent current all-store offer total was read.
- Index baseline: `a171e25e2ae3ecb0f2aa8306098acfcf354665cf` (PR #59).
  Latest Actions/production cycle at final read: **#195 / 34095993956** still
  in progress, schedule; latest completed **#194 / 34072637983**, success,
  updated 2026-09-07T01:30:08Z. Do not describe #195 as completed or restart it.
- Report: **not required/deferred** for this follow-up; no new email sent.
  Last completed report remains #016 with its v222 addendum.
- Next: handle the owner's next concrete tasks. Preserve exact priced variant
  links and do not restore an unrelated decorative product on read failure.

## Current handoff: v222 published, report #016 completed

Production source `34dcdb094988a36cb8a0c5e2380d524bd97727ca` is pushed to the
canonical Sites `main`. Version **222**, deployment
`appgdep_6a9bef4325cc8191b39796149a913293`, succeeded at
`2026-09-05T10:30:54.856261+00:00` (environment revision 17).
Version ID:
`appgprj_6a8236775b808191b6b4979c4d86d889~appgver_e81891202d848191829e2e3b787e7378`.
Use https://perfumetr.pl or https://perfumetr.borodzicz85.chatgpt.site.

The owner wanted main and beta combined in one animated document, compact slogan,
no emoji arrows, real matte glass, restrained scroll/pointer depth and more
minimalism. They then supplied screenshots showing brown feedback/offer hover
states, opaque panels, poor contrast and mobile merchant truncation. All are
addressed in v222 on top of the v221 same-document integration.

- Correct checkout in this session: `/workspace/sites/perfumetr-unified`.
  Do not edit the older dirty `/workspace/sites/perfumetr` checkout; resolve/pull
  the canonical source for a new session. Index is the importer/docs repository,
  not the Site frontend source remote.
- Main landing and beta search now share `PerfumetrExperience`. CTA switches
  views without document navigation; logo/Wstecz and product deep links work.
  API gates no longer exclude the main hostname; all original data/security
  validation remains. No domain/DNS merge was needed.
- Theme lives in `experience.css` and `glass-controls.css`. Backwards animation
  fill is essential for actual backdrop blur after entrance. The shared scene
  has small bounded translations with reduced-motion support; no bottle tilt.
  Main comparison/offer/feedback/footer surfaces are smoked glass; form fields
  remain light for readability. Mobile merchant rows no longer ellipsize.
- Keep `public/assets` and `asset-retention.json`: exact v220/v221 bundles
  support documents opened before rollout after old asset 404s were observed.
  Root HTML/RSC responses are private/no-store. Do not casually remove the
  retained graph or defeat its hash/dependency validation.
- Final build + **106/106** automated tests passed. Visual checking was explicitly
  requested by the owner's screenshot/report follow-up. Chrome desktop and
  390 px iframe preview were inspected with isolated local fixture data.
  Temporary viewport HTML was removed before build/package; preview stopped.
  No production records were changed and no purchase/opinion was submitted.
  Screenshots are preview evidence only, not current production prices.
  No physical iPhone/Safari check; standalone TypeScript still has known
  Cloudflare ambient-type limitations outside this change.
- Short errors-only production log sample after publication: 0 events/5 min.
  Do not elevate this to a complete production or all-store pricing audit.
- Email report #016 original `1a0710cc0c3a5e23`; final addendum
  `1a07120f8d86c92d`, same thread, SENT/INBOX, sent to `support@perfumetr.pl`.
  It contains all changes and four screenshots, explicitly marked test data,
  retaining the required original #003 layout/footer.
  Durable `/Perfumetr/report-016.html`,
  `libfile_7ce0371733188191b045584be59cf39b`, version 1.
- Index base: `a77fa787ab22dc2c8ade3b3fc73c049b89e2fbe2`, preceding PR #58;
  this checkpoint goes through a new docs-only PR. Latest preceding CI #176
  / 33957387804 succeeded; #175 was cancelled/superseded. Latest production
  #174 / 33957230645 succeeded, Douglas-only: completed, 41 steps,
  3,150 live/imported, 51,965 received, 2,572 review, 46,243 excluded,
  6,442 stored, automaticReview 0, maintenanceProcessed 306.
  Latest full check #172 had unchanged TD; last actual full transfer #171.
  **No coherent current all-store totals were read.**
- No manual import, schedule, schema, secrets, paid service or domain change.
  www pending SSL remains a prior limitation; main/beta active at initial check.
- Next action: follow up on the owner's real mobile feedback on v222. Preserve
  minimalism, one-document navigation and the coherent glass treatment; avoid
  resurrecting legacy copper/serif styles or big continuous motion.

The repository, not a single chat, is the durable project memory. A receiving
chat must be able to continue safely even if it can see none of the earlier
conversation.

## Current handoff: Sites v220 campaign redesign, visual QA limited

Updated 2026-09-05T09:11:01.401619+00:00. The user requested a major visual change after
rejecting v219 as dated, and supplied eight design references. Latest state:

- Production: **v220**, source `7ec3a3589528da3b1e1afc3b12cd87d8abd59c23`, synchronized to
  Sites source `main`; deployment `appgdep_6a9bdc90d4248191b9f463ce2a1f27bf` succeeded.
  Version `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_c5ef8091d414819197c7527b43e0da3c`.
  URL https://perfumetr.borodzicz85.chatgpt.site
- New original art direction: silver/blue photographic studio, huge sans-serif
  typography layered behind the real static bottle on main, clear entry CTA,
  light catalog/results and blue comparison price panel. Main has no promotion
  module. Beta retains date-valid campaigns. New backdrop is 101,128-byte
  WebP; the 26 real cutouts are unchanged. No 2.5D or device-tilt effect.
- Primary modified code: `app/coming-soon.tsx`, `app/perfume-app.tsx`,
  `app/editorial.css`, `app/page.tsx`; asset
  `public/campaign-studio.webp`. Main SEO title no longer says “coming soon”.
- Tests/build/artifact: **103/103 passing**, no preview fixtures shipped.
  No importer, price-refresh, database, identity, secrets or domain changes.
- **Do not claim fresh browser acceptance:** supported preview started but
  browser navigation failed with ERR_TOO_MANY_REDIRECTS and inspection was
  blocked by URL policy. No workaround or live-Sites browser was used.
  Layout was reviewed in source; mobile normal flow avoids fixed copy offsets.
  The preview tab was closed. No physical iPhone or user approval is claimed.
- Error-only Worker query around publish returned no errors in a limited
  20-minute sample. No current coherent all-source count or fresh maintenance
  queue read. Do not recycle September 1 totals or imply all prices verified.
- Index baseline before documentation update:
  `f43ef220580e54ba94f0dd052552b64267b16779`; workflow runtime still PR #56 / b5c573b.
  Completed CI #173 success; latest completed production #172 success.
  At final verification, scheduled #174 / 33957230645 was in progress;
  documentation PR validation was pending. Do not cancel this automatic
  cycle or duplicate it. No manual import or dispatch for this visual work.
- Last report remains #015, delivered once. No new report was requested/sent.

Status: technically deployed, user visual acceptance pending. Next step is a
fresh visual check when supported preview access works, or a concrete fix from
the user's new screenshot. Keep previous price-freshness work and strict catalog
safety. The following v219 section is historical where it describes visuals.

## Historical handoff: Sites v219, price schedule, report #015 delivered

Verified through 2026-09-05 08:51 UTC. Read the newest PROJECT_STATE section
first. The September 1 23,978-offer total below is historical.

- Runtime is Sites v219, source `f11d571e8e1b27960c37081239b6d80c0afaa581`.
  Deployment `appgdep_6a9bd729eca08191864ae3d750c6f514` succeeded at
  08:47:53 UTC; production URL https://perfumetr.borodzicz85.chatgpt.site.
  Source `main` is synchronized. Do not redeploy earlier motion branches.
- v218 (`31a251c68d39c6ab0a32e0e9159853fb71f0bcc0`) published price
  freshness and exact identity repairs. v219 adds the public editorial
  petrol/paper/olive palette, larger labels/prices, compact comparison,
  complete mobile categories and an optional feedback disclosure.
- Static bottles remain; rejected 2.5D stays reverted. There are 26 cutout
  entries including 20 additions. Main has a real bottle/CTA and no promotion
  panel; beta retains date-valid promotions and their exclusions.
- Enter returns 48 groups, never silently choosing the first suggestion.
  Product/audience are legible in suggestions; best offer is listed once.
- Index PR #56 merged at `b5c573be244620988d089a248ebe80394a6af25f`.
  CJ runs eight times daily; four added slots are CJ-only. Shared partners
  run four times, full TD twice and Douglas twice. Exact UTC slots are in
  PROJECT_STATE and the workflow. Concurrency remains non-canceling.
- #172 / 33955480932 completed successfully after that merge:
  32/32 validation; proof/full check/partners/status success. All full-TD
  snapshots were unchanged. Latest actual full transfer: successful
  #171 / 33951651817, 07:06:48-08:15:49 UTC.
- Notino/Brasty consumed 48 steps in #172, but maintenance is not finished:
  pending freshness 4,148 / 2,753 respectively. Eight cycles are eight
  bounded opportunities, not eight full refreshes. Do not dispatch a
  duplicate import or erase safety limits to make the queue look empty.
- Public offer maximum age is 18h; CJ refresh target 9h. Comparisons use
  first-primary/no-store; visible pages refresh every 5min and on return
  after 60s. A failed refresh cannot leave prices visible indefinitely.
- Notino's exact coupon-shaped feed reductions need verified eligibility.
  Confirmed identity repairs remain exact and tested, with no fuzzy matching
  or unconditional review approval.
- Sites build/artifact and 103/103 tests passed. Supported preview QA covered
  375/390px and 1280px layouts, search, catalog, comparison, promotions and
  feedback. Fixtures were never published. No physical iPhone or user
  acceptance is claimed.
- Post-v219 logs showed HTTP 200 for /, /api/homepage and marketing consent,
  no 1101/5xx in the retrieved sample. Direct workspace public reads were
  restricted (403), so no current all-source global total or complete
  merchant-by-merchant live price equality check is claimed.
- Instagram needed login; pinned comment was not read. Saved first-party brand
  artwork supplied the visual reference. No social message/comment was sent.
- Global duplicate/review audit, authenticated owner Integrations visit,
  www pending/SSL and product-review provenance remain open as previously
  documented. Do not turn these into claimed fixes.
- **Report #015 delivered once at 2026-09-05 08:51:04 UTC**, from/to
  support@perfumetr.pl; message/thread `1a070c3a3395785b` has SENT + INBOX.
  Exact subject: `[Perfumetr] Raport wdrożeniowy #015 — Aktualne ceny i świeższy Perfumetr — 05.09.2026`.
  Reused #003 template/logo. Copies: /Perfumetr/report-015.txt and
  /Perfumetr/report-015.html. Do not send again; future reports only on request.

Next useful technical check: read the next completed automatic CJ-only slot,
its pending freshness counters and actual post-v219 search/compare logs.
Continue ordinary bounded automation; do not manually dispatch just for proof.
Preserve the user's right to accept or reject the new visual style.

## Historical handoff: catalog recovered, homepage repaired, report #014 delivered

Verified through 2026-09-01 14:44 UTC.

- Production is operational on both `perfumetr.pl` and
  `beta.perfumetr.pl`: HTTP 200, complete and identical seven-store coverage,
  exact total 23,978 fresh active offers. Counts are Notino 8,609; Brasty
  5,327; Flaconi 3,764; Cocolita 897; Drogeria.pl 864; Aelia.pl 1,467;
  Douglas 3,050.
- Aelia recovery is complete: 8,553 raw rows, 1,803 perfume rows, 86 chunks and
  1,467 live/imported offers; registry `available`, success current, no lock.
- Run #146 attempt 3 (ID `33511129720`, importer commit
  `42ff3737e79b3453bdd94a62610d3e462cf230fb`) ran
  14:11:14-14:36:59 UTC. Workflow conclusion is `failure` only because the
  pre-full proof kept a controlled Aelia 409. Full TradeDoubler succeeded,
  partner stage succeeded, Douglas was skipped by policy and status
  publication succeeded. There are zero active/queued/pending workflows and
  zero catalog locks.
- Earlier evidence remains distinct: #144 failed at 17,805/five stores; #146
  attempt 1 failed at 22,376/six; scheduled #147 succeeded but was partner-only
  with proof/full skipped; #146 attempt 2 failed at 22,501/six and proved the
  Aelia session was abandoned because both jobs and locks were absent.
- Confirmed cause chain:
  exact Cocolita/Drogeria tracking aliases were missing and old completion
  could invalidate too early; Cocolita revision changed mid-run; Aelia
  repeated full conflict scans; Flaconi ordinary status ran a heavy safety
  audit and the runner stopped after recertification; a failed Aelia snapshot
  session plus changed provider revision remained marked active inside its
  three-hour window; UI separately labelled partial, differently timed
  freshness reads as a whole-system total.
- Safeguards:
  v208 blocks zero publication from non-empty feeds and separates configured
  from fresh coverage; v209 bounds/indexes Flaconi status work; v210-v211
  safely resume provider changes and remove all repeated Aelia scans; v212
  removes promotions from main, keeps both Flaconi campaigns on beta and uses
  a four-second 33,822-byte bottle fallback with no invented price; v213
  replaces a failed changed-revision session only without a live claim and
  cleans only session-staged candidates under lease/CAS/session guards.
- Production Sites is v213: source
  `edab402caa61f7e6db809148ff4e7e7b9db8411c`, version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_fcea6989757081919540d0c8f1818c9a`,
  deployment `appgdep_6a96dce9822881919adaaf8e00741183`, succeeded at
  14:11:01 UTC. Tests 96/96, build pass, lint zero errors plus three old
  warnings.
- Source-only commit `fab1bd51cce1b3098254d28d937efdb7ab33f17e`
  adds legacy same-`remoteVersion` regression coverage and is pushed to
  Sites `main`; no new deployment was made because runtime is identical.
- PR #53 merged as `e21d289aaa73b22ab0a1101c01bdc882c51fd0b6`;
  PR #54 merged as `42ff3737e79b3453bdd94a62610d3e462cf230fb`.
  Full TradeDoubler remains automatic at 02:47 and 14:17 UTC; concurrency does
  not cancel a live run.
- Main UI has bottle/CTA and no promotions/error/overflow. Beta has both
  Flaconi promotions and no error/overflow. Versace + Enter returns 48
  candidates. Eros EDP women 100 ml has three unique offers: Notino only in
  best-offer, Aelia.pl and Flaconi only below, all with store names.
- Latest Worker log check: zero 1101, zero 5xx and zero exceptions. Panel page
  returns 200; anonymous API correctly returns 401. Do not claim a fresh
  authenticated owner-session walkthrough unless one is actually available.
- Report #014 was sent from/to `support@perfumetr.pl` at
  2026-09-01 14:43:38 UTC. Message/thread `1a05d6cfb350f4e1`, labels
  `UNREAD`, `SENT`, `INBOX`, one sent copy. Durable copies:
  `/Perfumetr/report-014.txt`
  (`libfile_f92f44e4bed48191894c1f8e7197060d`) and
  `/Perfumetr/report-014.html`
  (`libfile_ca3ee42771d8819185dd6834428db9e2`).
- Exact next task: one read-only authenticated walkthrough of the owner
  Integration panel in an existing owner session. Do not trigger another
  import for reassurance.

## Previous handoff: Sites v207 grouped Flaconi homepage campaigns (superseded by v212)

Verified through 2026-09-01 11:08 UTC.

- The owner explicitly chose both verified Flaconi campaigns for the homepage.
  Production now shows one clean Flaconi module with separate SEPTEMBER and
  SAVEMORE rows rather than two unrelated promotional boxes.
- Scheduled campaigns are visible immediately as `Wkrótce`. SEPTEMBER shows
  10% for 2026-09-03. SAVEMORE shows all four thresholds, PLN 49/69/89/109
  from PLN 299/419/549/689, for 2026-09-05 through 2026-09-06.
- Codes never stack. A scheduled code is not applied before its start, and the
  comparison chooses the single best eligible code when campaigns overlap.
  Each row activates and disappears automatically; the reserved parent layout
  collapses after the last expiry.
- The plural production allowlist contains exactly the five verified Flaconi
  records needed for the two complete campaigns. Invalid, incomplete or
  non-Flaconi selections fail closed. Douglas SEZON remains informational and
  is not shown on the homepage.
- Both main and beta homepage APIs returned HTTP 200 with exactly these two
  scheduled Flaconi campaigns and no Douglas campaign. The current fresh rail
  was Notino 8,550, Brasty 5,314 and Douglas 3,050, exact rail total 16,914;
  beta reported 613 brands. Do not treat absent rail sources as zero stored
  products.
- Sites source commit is
  `adb93a52658fd13453a65795205631c364f38db0`; version 207 is
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_22f5b75ab4508191a307e00c9368adc9`;
  deployment `appgdep_6a96b0ae16e08191abfe1d26a1661c03` succeeded at
  11:02:19 UTC with environment revision 17 and no failure message.
- Build and artifact validation passed, full tests passed 89/89, lint has zero
  errors and three old unrelated warnings, and independent review found no
  blocker. Post-deployment logs contain no Worker exception; only harmless
  `/robots.txt` 404 entries with `outcome=ok`.
- The server shell reserves the module before the async homepage response, and
  the Sites desktop capture confirms that this column does not overlap the
  hero. The connected cloud browser could not open the public hosts, so fresh
  owner iPhone visual acceptance of the hydrated module is still unrecorded.
- GitHub `master` before this continuity commit is
  `a0a22ffba8b6bd676e3998d00fe941c3973a24b4`. Latest workflow run #142,
  ID `33496392931`, scheduled, attempt 1, succeeded. It ran validation and
  isolated Douglas only; full TradeDoubler and the shared partner cycle were
  skipped. Douglas ended completed with 3,050 live offers. No workflow is
  running and this homepage deployment started no import.
- No catalog/classifier/review data, domain, routing, partner credential or
  report changed. Report #013 remains the last confirmed delivered report; no
  report was requested or sent specifically for v207.
- Exact next task: record the owner's natural iPhone visual check of both
  homepage rows. If accepted, leave v207 in place and let the verified dates
  control activation and expiry. Do not redeploy or start an import merely for
  reassurance.

## Previous handoff: Sites v206 verified partner coupons

Verified through 2026-09-01 10:09 UTC.

- The three requested e-mail campaigns are recovered, structured and deployed:
  Flaconi `SEPTEMBER` (10%, 2026-09-03), Flaconi `SAVEMORE` (PLN 49/69/89/109
  from PLN 299/419/549/689, 2026-09-05 through 2026-09-06) and Douglas
  `SEZON` (up to 20% from PLN 129, 2026-08-31 through 2026-09-06).
- Flaconi dates, tiers and exclusions are automatic. SAVEMORE is one campaign
  in the panel even though four threshold rows allow the comparison engine to
  choose the single best eligible tier.
- SEZON applies only to exact Douglas variants marked with the code. Its rate
  varies by SKU and Douglas has no verified delivery rule in Perfumetr, so it
  is intentionally informational and cannot alter comparison prices.
- Nothing is selected for the homepage. The explicit selector is empty and the
  live homepage returned `promotion: null`. Do not publish a homepage code
  until the owner chooses one.
- Sites source commit is
  `2dfe927e43c0e25cd68dcfdc03073badf3db85d9`; version 206 is
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_efde95b167788191b59bbffc58fed54f`;
  deployment `appgdep_6a96a2beb5f88191a039a8c1674f04df` succeeded with
  production environment revision 16.
- An earlier deployment attempt failed before publication because the
  environment text exceeded the Sites binding limit. The same verified data
  was compacted without dropping campaign conditions and then deployed.
- D1 confirms all six new rows with correct automatic/informational flags. Old
  `DUO` is expired; unrelated existing campaigns were preserved.
- Build and artifact checks passed, full tests passed 88/88, lint has zero
  errors and three existing unrelated warnings, and independent review found
  no blocker. The production homepage returned HTTP 200 and post-deployment
  error logs were empty.
- The latest GitHub catalog workflow is scheduled run #141, ID
  `33484726115`, failure: validation, vouchers, Notino and Brasty completed;
  Flaconi returned `orchestrator_import_failed`; full TradeDoubler and
  isolated Douglas were skipped. No workflow is running and no duplicate was
  started. This importer result is independent from the coupon deployment.
- No manual import, catalog/classifier mutation, review publication, secret,
  domain, routing or partner-message change was made. Report #013 remains the
  latest confirmed delivered report; no coupon report was requested or sent.
- Exact next task: wait for the owner's homepage selection among SEPTEMBER,
  SAVEMORE and SEZON. Preserve the current homepage until that decision.

## Previous handoff: Sites v205 confirmed owner-panel recovery

Verified through 2026-08-31 14:30 UTC.

- The owner proved that authenticated Integracje still returned 1101 after
  v204. The v204 checkpoint and report #012 were therefore technically
  overclaimed.
- Fresh production logs identified the exact exception: random identity
  generation ran during global Worker module evaluation. The stack mapped to
  module-scope `crypto.randomUUID()` in the integration status scheduler; its
  random fallback was also unsafe. D1 load was secondary, not the logged cause.
- Sites v205 is deployed from
  `8af98234899bb5245762ec53cc32852565389ddc`; version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_7296cd6e915881918b2bc7729acba65b`;
  deployment `appgdep_6a958cfa2458819181657fca662db56a` succeeded at
  14:17:43 UTC with no failure message.
- Scheduler identity is now initialized lazily in the browser. The page renders
  a lightweight shell immediately, then uses a protected private/no-store API
  for its read-only overview. A D1 delay can no longer block or crash the route.
- Opinie, Marketing and Integracje now share one stable text-only navigation:
  Opinie, Marketing, Integracje, Zamknij panel. There are no rectangular nav
  buttons. The active section stays in place and very narrow screens use the
  shorter Zamknij label.
- Automatic status reads remain at most once per source every eight hours,
  start after 90 seconds and stay serialized at least 45 seconds apart. They do
  not start imports.
- Verification passed build, artifact validation, 88/88 tests, lint with zero
  errors and three existing warnings, `git diff --check` and independent
  review. Two fresh production Integracje requests returned HTTP 200,
  `outcome=ok`, with Worker times of 40 ms and 6 ms. Post-v205 error logs
  contained zero events.
- GitHub `master` before the continuity PR is
  `e8a7b2aa69665fa4975b324bbfa29e950a0f90b5`. PR #51 is merged; its
  validation run #135, ID `33397381448`, succeeded and was not an import.
  Latest previously verified production run remains scheduled #133, ID
  `33388076416`, success. No job was duplicated.
- Report #013 was sent to `support@perfumetr.pl` at 14:25:36 UTC and is
  confirmed with `SENT` and `INBOX`. It corrects #012 and preserves the
  report #003 visual template.
- No import, D1/catalog mutation, review publication, classifier, credential,
  secret, domain or routing change was made for v205.
- Technical recovery is complete; authenticated production user acceptance is
  not yet recorded. Exact next task is one owner reload of Integracje and one
  check of the clean Opinie navigation. If accepted, resume the read-only
  reconciliation of run #133. Do not start an import for verification.

## Previous handoff: Sites v204 panel recovery and merchant label

Verified through 2026-08-31 13:30 UTC.

- Sites v204 is deployed from
  `e0ec3f63e87c994e381f54deb29a36a23751fefc`; version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_962d93f004bc81919f6dde56325f1e38`;
  deployment `appgdep_6a957f32977c81919e0c0eecee1e5c7e` succeeded
  at 13:19:31 UTC with no failure message.
- The best-offer card visibly includes the store name. The cheaper offer
  remains present only once and the lower list contains only alternatives.
- The reported authenticated integration-panel 1101 is addressed by replacing
  the first-render fan-out of at least 18 D1 operations with four sequential,
  read-only snapshot queries and a 750 ms deadline. A stalled query now
  returns a usable unknown-state shell instead of a crash or false zero.
- Independent review caught and fixed the brief v203 conflation of live offers
  with affiliate approval. v204 preserves programme and feed statuses,
  distinguishes invalid credentials, applies the AWIN feed-key requirement to
  Douglas and derives the visible store list from `COMPARISON_STORES`.
- Coupons load only when opened. Hebe technical diagnostics are manual.
  Normal source status reads remain automatic at most once every eight hours,
  start after 90 seconds and run one at a time with 45-second spacing.
- Verification passed build, artifact validation, 86/86 tests, lint with zero
  errors and three existing warnings, `git diff --check` and independent
  review. The forced stalled-D1 authenticated test returns HTTP 200 in about
  1.6 seconds. Production root, beta, panel gate, provider and Versace search
  returned HTTP 200; post-deployment error logs were empty.
- Worker logs show 4–54 ms for pages/panel and 146–468 ms for the basic search.
  The observed multi-second standalone curl time was local TLS-proxy setup, not
  Worker execution. Beta's optional homepage DTO still has an intentional
  four-second delay; it is separate non-blocking UX debt.
- Current production DTO: Notino 8,663; Brasty 5,370; Flaconi 3,754; Cocolita
  896; Drogeria.pl 862; Aelia.pl 1,471; Douglas 3,057; exact total 24,073.
  Catalog 11,097, all with images, 628 brands.
- Latest GitHub validation is run #134, ID `33393585171`, success,
  `pull_request`. Latest production run is #133, ID `33388076416`,
  scheduled and successful. No job was duplicated.
- Report #012 was sent to `support@perfumetr.pl` at 13:28:16 UTC and is
  confirmed with `SENT` and `INBOX`. It reused the report #003 template.
- No D1/catalog mutation, manual import, review publication, classifier,
  credential, secret, domain or routing change was made for v203-v204.
- Technical deployment is complete; fresh iPhone user acceptance is not yet
  recorded. Exact next task is only to verify the refreshed authenticated
  panel and merchant label when next opened, then read-only reconcile run #133
  and its generations. Do not rebuild v204 or start an import for verification.

## Previous handoff: Sites v202 homepage stability

Verified through 2026-08-31 12:46 UTC.

- Sites v202 is deployed from source commit
  `50cdf9541d618307ffd32216c00c2f0679d7afcb`; version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_9565ccfb2f0081918525f24d2ce1cbde`;
  deployment `appgdep_6a957772d4348191924371a233d91898` succeeded
  with no failure message at 12:45:52 UTC.
- The user's iPhone recording reproduced the main-domain defect twice: a
  hard-coded YSL MYSLF bottle and placeholder copy appeared for about 1.2
  seconds, live price text changed first, and the real Emporio Armani bottle
  followed. Store coverage insertion also shifted the page by about 35–40 px.
- Root cause: the fast server shell correctly supplied `deal={null}`, but
  `coming-soon.tsx` mapped null to a concrete YSL product and deliberately
  delayed `/api/homepage?surface=main` for 1,200 ms.
- v202 preserves the fast D1-independent shell. It renders no product identity,
  image, variant link or price until one complete live deal is available,
  starts the request immediately and reserves the store-coverage height.
- A null or failed homepage response now settles loading and presents neutral
  beta guidance. It never fabricates a product and never remains permanently
  `aria-busy`. Reduced-motion preference is respected.
- Verification passed build, Sites artifact validation, 85/85 tests, lint with
  zero errors and three pre-existing warnings, and `git diff --check`.
  Independent review returned safe to deploy. The first post-deployment
  error-only Worker log query contained no events.
- This is technically deployed but has not yet received the user's visual
  acceptance on the original iPhone path.
- No D1 mutation, importer run, schedule, classifier, credential, secret,
  domain, routing or e-mail change was made. No report was requested or sent;
  report #011 remains the latest confirmed delivered report.
- Exact next task: verify one refreshed entry to `perfumetr.pl` on the user's
  iPhone no longer shows the YSL placeholder or vertical shift. Afterwards
  continue the v201 read-only importer reconciliation and authenticated owner
  review of the reorganized integration panel. Do not start a duplicate import.

## Previous handoff: Sites v201 production recovery and integration panel

Verified through 2026-08-31 12:19 UTC.

- Sites v201 is deployed from source commit
  `a278ce108d13035727fdcfde616f19aadf358f29`; version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_35c2087ff8a08191b085e56f59ff7789`;
  deployment `appgdep_6a957116f65c819182017efa0594f75a` succeeded
  with no failure message at 12:18:43 UTC.
- Enter or the search button returns the full bounded match surface and does
  not choose the first suggestion. Production `Verasce` returned 39 groups
  with HTTP 200 in 350 ms.
- Production Versace Eros Flame EDP 100 ml returned seven offers with HTTP 200
  in 522 ms. The best offer appears once above and the lower section contains
  only the six remaining offers.
- The recovered compare failure was the exact 8,000 ms application deadline.
  Optional coupon and delivery work was included in a blocking
  `Promise.allSettled`, and the coupon read could also run the write-capable
  verified-promotion synchronizer.
- v201 makes only perfume and offer rows required. Coupon and verified-delivery
  enrichment use a 750 ms soft deadline and cannot turn ready offers into a
  503. Public compare is now read-only; promotion synchronization remains on
  controlled homepage and panel paths.
- Main and beta shells render before optional catalog data. Final production
  worker timings were 7 ms for the main root and 39 ms for the beta root. No
  post-v201 compare 503 or optional-enrichment soft deadline was logged.
- Verification passed build, Sites artifact validation and 85/85 tests. The
  regression suite includes stalled optional reads returning valid offers in
  under two seconds. Lint has zero errors and three pre-existing warnings.
- Sites v200 from `e7d386e687740001b12274d375d5c7db8976ca3a`
  reorganized the integration panel into summary, attention queue and compact
  store overview, with technical sections collapsed by default.
- Automatic panel status checks remain enabled but run at most once per source
  every eight hours, starting after 90 seconds and serialized at least 45
  seconds apart. Manual checks share the same lock.
- Old already-open panel tabs can emit legacy parallel requests until reloaded
  or closed. The v200 server rejects those requests with HTTP 429 before D1;
  they do not run an import. TradeDoubler and Hebe status reads are read-only.
- The protected panel interior was not bypassed for visual QA. Server-render
  and behavior tests passed; authenticated owner review remains outstanding.
- Final production counters were Notino 8,663; Brasty 5,370; Flaconi 3,754;
  Cocolita 896; Drogeria.pl 862; Aelia.pl 1,471; Douglas 3,057; exact total
  24,073 and 628 brands. Douglas changed from 2,964 observed earlier in the
  work window. Do not attribute that to v197-v201 without reading the current
  Actions run and source generation.
- No manual import, duplicate workflow, D1 change, credential change, domain
  change, e-mail, report or partner message was started for this checkpoint.
  Report #011 remains the latest confirmed delivered report.
- Exact next task: read-only reconciliation of the newest importer workflow
  and source generations behind the 24,073-offer production rail, then owner
  review of the reorganized panel. Do not start an import merely to verify it.

## Previous handoff: Sites v196 search results and single best offer

Verified through 2026-08-31 10:17 UTC.

- Sites v196 is deployed from source commit
  `a18cc7056d47563ab5559e8643650f8525e7d899`; version ID
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0376660e67988191a0a1a0ea01314def`;
  deployment `appgdep_6a95548b489c8191bdf63d2d2a1405c2` publish
  succeeded with null failure message.
- Provider URL is `https://perfumetr.borodzicz85.chatgpt.site`; Sites still
  reports `https://beta.perfumetr.pl` as the live URL.
- A normal Enter or search-button submission no longer chooses the first
  suggestion. It opens a dedicated surface with matching perfume
  line-and-concentration groups and direct volume choices. The submitted page
  is bounded at 48 groups; type-ahead remains four results.
- Arrow-key highlighting followed by Enter still opens the explicitly selected
  suggestion.
- The best offer remains in the first compact result card. The repeated lower
  best-offer dossier was removed. The lower ledger filters by stable offer ID
  and contains only remaining offers; its links are absent when there is no
  alternative.
- No importer, D1 data, schedule, partner integration, classifier, domain,
  routing, offer ranking, coupon calculation or redirect rule changed.
- Build and Sites artifact validation passed. The full Sites suite passed
  81/81, the two new targeted regressions passed 2/2, lint had zero errors and
  three pre-existing warnings, and `git diff --check` passed.
- This is technically deployed but not yet visually or product-accepted by the
  user. No browser or real-device visual QA was requested.
- The latest audited production automation remains scheduled run #132, ID
  `33375095796`, completed `failure`: validation passed; full
  TradeDoubler and Douglas were skipped; Flaconi returned
  `orchestrator_import_failed`; Notino paused after its bounded cycle; Brasty
  completed. No job was running and v196 did not start an import.
- Latest audited public counts remain Notino 8,663; Brasty 5,370; Flaconi
  3,754; Cocolita 896; Drogeria.pl 862; Aelia.pl 1,471; Douglas 2,966; exact
  total 23,982, with 11,110 catalog groups and 627 brands.
- The prior recovery audit observed intermittent `catalog_unavailable` 503
  responses from `/api/catalog` and one generic search probe. It also found
  the separate stale OVH apex/`www` DNS risk. v196 does not claim either
  issue is repaired.
- Exact next task: diagnose and minimally fix the intermittent
  `/api/catalog` 503 in the existing v196 source without starting imports or
  changing catalog data. Keep DNS remediation separate.
- Report #011 remains the latest confirmed delivered report. No report was
  requested or sent for v196.

## Previous handoff: Sites v195 atomic TradeDoubler snapshots

Verified through approximately 2026-08-31 00:38 UTC after the Sites v195
post-deployment and report-delivery checks.

- The compatible GitHub worker checkpoint is
  `de1f14fb224e38a669258bac42d81d5c5ecb1cc6`.
- Pull request #44, `Make full TradeDoubler snapshots atomic and exact`, is
  merged. Pull-request validation run #128, ID `33343249979`, succeeded with
  27/27 worker tests and skipped the production job. Never describe run #128
  as a product import.
- Documentation pull request #45 is merged as
  `12b5bb9346430bc1fa626c327e8b92e59ed48f1d`. Pull-request validation run
  #129, ID `33344895933`, also succeeded with 27/27 tests and skipped the
  production import job. It is not a product import.
- Sites v195 is deployed from source commit
  `7430f7b5c2b9770ad5fae7c97f8ac0375ce3e89a`; version ID
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0581a7ae25848191bb7b847085f737f1`;
  deployment `appgdep_6a94c5dc21308191812d9bf6d472fe08` publish
  succeeded with null failure message.
- Future-contract fields in the worker were inert, optional metadata ignored
  by Sites v194 while it continued to receive its established compatible
  payload. The same worker revision also added independent local duplicate-
  offer detection and bounded chunk validation, but did not rely on or activate
  a new Sites contract. Sites v195 was the first side to enforce strict dual
  validation, staging and atomic publication. No import was started by either
  rollout.
- The v184-v194 baseline remains active. v184 made analytics consent compact;
  after a decision there is no permanent bottom-right privacy control.
- Shared identity across CJ, Douglas, Flaconi and TradeDoubler uses only 19
  audited brand groups, 28 audited family keys and two explicit Stronger With
  You aliases. Jean Paul Gaultier is one of those brand groups. There is no
  fuzzy merge, semantic slot conflicts stay separate, counters use the
  normalized brand and 71 confirmed nonstandard variants remain hidden.
- Only the exact brand and line pair Xerjoff + `XJ 1861 Naxos` canonicalizes to
  `Naxos`; this narrow rewrite is independent of GTIN. Separately, targeted
  reprocessing of earlier conflict rows is restricted to GTIN `8033488155070`
  and its leading-zero form `08033488155070`. This is test-backed code behavior,
  not proof of every live Naxos row or permission to remove `XJ 1861` globally.
- A global 30-hour publication cap applies to every source across catalog,
  comparison, store rail, counters, coupons and outbound redirects. CJ rolling
  refresh targets 20 hours. Older offers are intentionally hidden instead of
  presented as current.
- CJ known-ID maintenance is capped at 50, confirmation retry waits 15 minutes,
  stale unavailability is rechecked after six hours, a changed GTIN goes to
  review and coverage examines at most three verified standard-GTIN variants
  per step with a fresh other-store witness. Cursor drift is at most 2%, capped
  at 250 rows; only guarded EOF may finish a drifted query and scopes above
  10,000 are skipped safely.
- Flaconi completed-generation review-backlog reprocessing is capped at 40
  rows per step; its separate safety phase has its own 400-row bound. Douglas
  paused recovery, EOF cleanup, safety phases and counter reconciliation are
  bounded, resumable and fail closed. A stale, duplicate or reused external ID
  fails closed once the conflict is observed; if contradictory copies are on
  different pages, the first can be briefly public before the second is read
  and quarantine begins.
  This is not a global semantic-duplicate audit across different product IDs.
  Only an exact safe restock may reactivate a row.
- Every TradeDoubler Unlimited chunk now contains the complete raw slice and
  its exact ordered `perfume-v1` subset. Sites independently recomputes the
  subset and rejects an omission, addition, mutation or order change.
- The worker rejects duplicate offer identities across the entire snapshot
  before chunk one. Sites validates the full raw chunk again. Chunks write only
  session-scoped staging; public listings, offers, store rails and global
  counts change only in one verified completion transaction.
- Selector `all-products-v2:perfume-v1` is durable in the active session,
  completed feed metadata and receipt. An old selector forces replay and an
  old session cannot resume or complete under v195.
- Unlimited begin, chunk, complete and fail actions, plus issuance of the
  `unlimited_full` browser ticket, are OIDC-only with audience
  `perfumetr-tradedoubler-bridge` and exact workflow identity checks. Other
  browser-ticket modes are outside this statement.
- The validated exact classifier subset bypasses only the older narrower
  perfume-name predicate. Category-only perfume evidence works; description-
  only references, shampoo, testers, samples, refills, sets, body care, mists
  and home fragrance remain excluded. Hidden-catalog, identity, duplicate,
  semantic and exact-GTIN gates remain active. GTIN quarantine is symmetric,
  including a null-GTIN witness.
- Verification passed: Sites build and artifact validation, Sites suite 80/80,
  worker suite 27/27 and `git diff --check` in both repositories. Lint has zero
  errors and three pre-existing warnings. Two independent exact-code reviews
  returned GO.
- The latest scheduled production cycle is run #127, ID `33340455040`, from
  2026-08-30 22:56 UTC. Validation passed and full TradeDoubler was correctly
  skipped, but the partner job failed: Flaconi and Notino returned
  `orchestrator_import_failed`; Brasty completed. One failed bounded partner
  cycle is not a global catalog outage. No manual retry was launched.
- Run #126, ID `33338337893`, is the latest full TradeDoubler attempt and
  failed after Douglas persisted a safe checkpoint near 39,000 scanned rows.
  It is not a completed full snapshot. The first successful scheduled full
  cycle after v195 is still required to prove the new contract in production.
- `sync_locks` was empty, and a complete `catalog_meta` scan found no active or
  abandoned Unlimited session key. No import or catalog lease was running.
- Post-deployment D1 source truth:
  - Douglas generation 6 is `failed` at the safe 39,000 checkpoint with 2,407
    accepted, 2,322 review and 34,271 rejected; error `import_failed`, no lock.
  - Flaconi generation 15 is `completed` with 35,010 received, 3,754 accepted,
    1,332 review, 29,924 rejected and null source error.
  - Notino generation 22 is safely `paused`, not completed and not running. It
    has no source error; 19,269 received, 11,380 accepted, 2,947 review and
    4,942 rejected. The active bounded query checkpoint is 9,500 of 9,681 and
    product status is `syncing`.
  - Brasty generation 17 is `completed` with 13,161 received, 11,320 accepted
    and 300 rejected. Run #127 overview reported 658 review, but a later D1
    row reported 1,541; preserve both until a consistent later read resolves
    the discrepancy.
- Three consecutive post-deployment SSR reads were identical: Notino 8,686,
  Brasty 5,370, Flaconi 3,754, Cocolita 896, Drogeria.pl 862, Aelia.pl 1,471
  and Douglas 2,966, total 24,005. The same reads reported 11,122 catalog
  entries, all with an image, across 628 brands. These are live public counts,
  not generation accepted counts.
- Flaconi returned to the rail after an earlier pre-deployment read showed it
  absent. No import was started to create this read-only verification, and the
  application did not retain or invent expired DUO pricing.
- Five of five direct apex requests returned HTTP 200, but average response
  time was 11.69 seconds. Four production assets were byte-identical with the
  v195 build. Native post-publication logs contained no application exception
  or error payload. An errors-only filter returned three canceled technical
  `/api/search` reads and one verifier request to the nonexistent `/katalog`
  route that returned 404. All came from the deployment check, had
  `error=null`, and the 404 recorded worker outcome `ok`. This proves the
  deployed asset, not a fast apex. Do not call it fully stable or fast. Recheck
  `www` separately before changing its historical unresolved status.
- Current CJ discovery chooses the largest eligible feed from at most the first
  20 Product Feeds returned. Complete Notino and Brasty programme coverage is
  therefore not proven. The owner may provide a Product Feeds list/export with
  feed ID, name, country, language, currency, product count and update time.
  Never request or store the CJ token, an authenticated feed URL or a private
  raw feed in the repository.
- Do not start an import merely to observe v195. Let the ordinary schedule
  exercise it, then read the completed session, receipt, source counters,
  public offers and locks. Do not manually retry HTTP 429.
- The user explicitly requested consolidated report #011 after the work was
  complete. Report #011 was delivered to `support@perfumetr.pl` on 2026-08-31
  at 00:36:59 UTC; Gmail records both `SENT` and `INBOX`. Report #010 is the
  immediately previous delivered report and report #003 remains the visual
  template authority.
- Exact next task: observe the next ordinary full TradeDoubler cycle, then
  verify its session, receipt, D1 source rows, public counters and empty locks.
  Separately compare the official CJ Product Feeds inventory before making any
  source-discovery change. Do not weaken `perfume-v1`, exact GTIN,
  hidden-catalog or duplicate gates.

## Earlier Sites v183 marketing analytics continuity checkpoint

Verified approximately 2026-08-29 12:49 UTC.

- Sites v183 is live from source commit
  `985bd96d53ed7c6f274d0188cd92a3b1cd5ac3f9`; deployment
  `appgdep_6a92d4f7b0008191be0dab134b60d104` succeeded. It retains
  the v182 analytics core and exposes the same protected owner panel on the
  main domain.
- First-party analytics is consent-gated and records `entry`,
  `search_used`, `product_view` and server-authoritative `offer_click`.
  It retains all five supported UTM fields and first-touch landing across the
  public Perfumetr hosts.
- There was no existing GA4, Meta Pixel or TikTok Pixel identifier. None was
  fabricated or loaded. Do not enable any external tracker before consent.
- D1 now contains `marketing_session_limits`, `marketing_sessions` and
  `marketing_events` from migration
  `drizzle/0021_spicy_blue_blade.sql`.
- Aggregate results are available only through the protected owner route
  `https://perfumetr.pl/panel-opinii/marketing`. Raw events are not public.
  Production verification returned the code gate with HTTP 200 and no campaign
  data before login; cache and framing protections remained active.
- `/out/[offerId]` keeps the existing allowlisted affiliate redirect.
  Analytics is scheduled after the response, derives its price/store/product
  snapshot on the server and fails open.
- Automated verification: 71/71 tests, successful build/artifact validation,
  zero lint errors with three pre-existing warnings, and independent security
  GO.
- Production desktop QA campaign `qa_production_20260829` produced exactly
  `entry`, `search_used`, `product_view`, and `offer_click`; the clicked
  Aelia.pl offer continued to `visit.aelia.pl` without leaking UTM values.
  Treat this campaign as QA, not marketing performance.
- Do not claim an independent phone-sized production test yet. The available
  production browser had a fixed desktop viewport; repeat the same UTM funnel
  on a physical phone before marking mobile E2E passed.
- Public SSR after deployment: 25,721 offers, 11,499 catalog entries with
  images, 717 brands, seven stores.
- Current source truth remains: Flaconi generation 12 failed
  `feed_changed`, Notino generation 20 failed `pagination_incomplete`,
  Brasty generation 15 is safely `paused`, Douglas generation 3 is
  `completed`; `sync_locks` was empty before deployment.
- Latest Actions: #110 is the latest scheduled failure; #108 is the latest
  successful production partner cycle and latest full TradeDoubler; #102 is
  still the latest PR validation. No import or feed workflow was manually
  started for analytics.
- `perfumetr.pl` completed the live funnel. The `www` host is still pending
  and returns HTTP 502. Do not report it repaired.
- No report #011 and no partner message was sent.
- The next catalog-data task remains the read-only global duplicate/review
  audit. Do not alter `perfume-v1`, semantic conflict gates, bounded imports or
  affiliate integrations as part of analytics follow-up.

## Mandatory maintenance

After every important deployment or major production investigation, update both
`PROJECT_STATE.md` and this file before declaring the task complete. Record:

1. the UTC verification timestamp;
2. the confirmed state of every project area;
3. the exact verified `master` baseline and the continuity pull request;
4. important pull request numbers and their state;
5. the latest GitHub Actions run and the last full production importer run as
   separate facts;
6. the current Sites version, source commit and deployment state;
7. exact live-offer counts for every active store and their total;
8. the latest import result, including safe counters and source blockers;
9. what works, what does not work and what remains visually unverified;
10. completed work and test results;
11. any work still in progress, with its exact stage;
12. external blockers and ownership;
13. the exact next task;
14. the report number, recipient, delivery state and current user instruction.

Use only directly verified facts. Never present work in progress, an unverified
deployment or a launched workflow as completed.

## Immediate transfer trigger

If the user says that the conversation is lagging, asks to change chats or asks
for a message for the next chat, immediately return one complete paste-ready
handoff. Do not ask the user to summarize the conversation and do not split the
handoff across several messages.

The final handoff must be self-contained. Do not assume that the receiving chat
can see the old conversation, earlier tool output or memory.

Before writing the handoff, verify the current state directly when access is
available. If verification is blocked, state exactly which value is the latest
recorded value, when it was recorded and why it could not be rechecked. Never
fill a missing value by guessing.

## Verification order for the receiving chat

The handoff must tell the receiving chat to do all of the following before any
change:

1. use GitHub and Sites in read-only mode;
2. read `AGENTS.md`, `PROJECT_STATE.md`, `docs/ARCHITECTURE.md` and
   `docs/CHAT_CONTINUITY.md` from `GADOMM/Index`;
3. verify the current `master` commit;
4. verify the latest Actions run and the latest full production importer run;
5. verify the current Sites version, deployment, domains and SSL state;
6. compare production with the handoff;
7. report any mismatch to the user;
8. make no code, import, configuration or production change until the checks are
   complete.

## Earlier Sites v180 continuity checkpoint

Verified through approximately 2026-08-27 18:15 UTC for the completed catalog
recovery and Sites v180. Report #010 is the latest confirmed delivered report.

1. verified GitHub `master`:
   `c5f52143dcf9050e35350be31e6e51a7b5ac431d`;
2. full TradeDoubler run #93 completed successfully with Cocolita 886,
   Drogeria.pl 855 and Aelia.pl 1,461 live offers;
3. Douglas generation 3 is completed: 51,996 received, 4,032 accepted and
   live, 1,742 review and 46,222 excluded. Its logo and wordmark are directly
   verified in the public store rail;
4. isolated Flaconi run #6, ID `33102239793`, completed successfully with
   35,171 received, 3,756 imported and live, 1,344 review, 30,071 excluded,
   5,247 stored, automatic review 0 and maintenance processed 221;
5. final Notino run #101, ID `33102412389`, completed successfully with 5,333
   live, 663 review, 2,858 excluded, 3,619 imported, 10,240 stored, pending
   fresh 0 and automatic review 0;
6. Brasty is completed with 5,585 live offers and pending fresh 0;
7. the exact fresh live-offer total is 21,908. The public API reports 9,690
   catalog entries, all 9,690 with images, across 658 brands;
8. Sites v180 source commit is
   `0312176047d0098b737e9cdaea83d0843d4af246`;
9. v180 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_a9b91b18c0b88191b486650065006fbd`;
10. deployment `appgdep_6a907db645688191a1d3f659622e4f45` is
    `succeeded` with no failure message. Provider URL:
    `https://perfumetr.borodzicz85.chatgpt.site`;
11. v180 persists the EOF page before cleanup, advances three idempotent
    cleanup phases with lease heartbeats and durable paused checkpoints, and
    atomically writes final source `completed` plus programme registry `ready`;
12. build and artifact validation passed, the full suite passed 66/66, lint has
    zero errors with the same three existing warnings, and an independent
    final review returned GO;
13. production D1 reports all import-source rows `completed` with null error;
    `sync_locks` is empty, so no import or catalog lease remains active;
14. the provider URL and `beta.perfumetr.pl` returned HTTP 200. The apex
    `perfumetr.pl` returned 502 and then two consecutive 200 responses, so a
    first-request regression is not ruled out. `www.perfumetr.pl` consistently
    returned 502;
15. Parfumdreams PL is rejected by AWIN while its persisted registry row still
    shows the older applied state. Do not treat that row as current approval;
16. the global duplicate audit across published families and manual-review
    rows is incomplete. Preserve all GTIN, identity, hidden-catalog and
    `perfume-v1` gates;
17. report #010 was delivered to `support@perfumetr.pl`; Gmail records `SENT`
    and `INBOX` at 2026-08-27 01:08:03 UTC. Report #009 remains the previous
    delivered report, report #003 remains the visual template authority, and
    no report #011 was requested or sent;
18. no import, deployment or email delivery is in progress. The next data task
    is the read-only global duplicate and remaining manual-review audit,
    followed only by unambiguous bounded repairs.

Treat these as point-in-time facts. Recheck GitHub, Sites, D1, domains and
external programme state before another change.

## Earlier Sites v156 continuity checkpoint

Verified through 2026-08-25 21:38 UTC for the latest tester feedback and
Sites v156. Report #009 remains the latest confirmed delivered report.

1. verified `master` before this continuity pull request:
   `d14d218b578157d7235b0fbf0082d75bf0d0a7e0`;
2. the latest completed workflow is catalog run #77, ID `32898882767`,
   attempt 1, schedule, success from 21:03:22 to 21:17:50 UTC. Importer
   validation and the bounded partner orchestrator succeeded while the full
   TradeDoubler snapshot was correctly skipped;
3. run #72, ID `32800552146`, remains the latest full production
   TradeDoubler snapshot. GitHub Actions remains the only automatic scheduler;
4. Sites v156 source commit is
   `98eee0c3815049f8c04e9a5a00a13b62b398f9c0`;
5. v156 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_56ba63caa25c81919615ae4c0e83f2eb`;
6. deployment `appgdep_6a8e0a3699c48191b2264c499d021193` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
7. the project is active and public, with current live URL
   `https://beta.perfumetr.pl`. `perfumetr.pl` and
   `beta.perfumetr.pl` have active provider and SSL status. The separate
   `www.perfumetr.pl` domain is newly pending provider validation and was not
   changed in this task;
8. the latest panel entry reports unreadable desktop catalog filter and
   price-sort text at `2560×1305`. It has one protected screenshot that was
   not copied from private R2 or opened outside the authenticated owner route;
9. the defect is confirmed from source and agent preview: filter choices were
   `9px`, headings `10px`, and the sort select plus native options
   `11px`. Contrast was adequate, so undersized typography was the exact
   cause;
10. v156 changes only desktop catalog text at `721px` and wider: sort and
    toolbar actions are `14px`, group headings `12px`, filter choices and
    brand suggestions `13px`, and the brand input `14px`;
11. no JSX, state, sorting logic, color, control height or mobile picker changed.
    Preview at `1363×936` confirmed the new computed values, no clipped
    filter labels and a working `price-asc` selection;
12. the targeted regression passes 1/1. Build and artifact validation pass, the
    full Sites suite passes 58/58, and lint has zero errors with the same three
    existing warnings;
13. direct production checks returned HTTP 200 for the provider URL and both
    production domains. Beta loads `/assets/index-CpZ4uGDw.css` and that
    stylesheet contains every corrected desktop rule;
14. the fresh production rail currently shows Aelia 1,397, Cocolita 874,
    Drogeria.pl 845, Notino 4,214 and Brasty 6,181, total 13,511. Flaconi is
    absent from the fresh rail; no feed, importer, D1, schedule or partner
    configuration change was authorized or made;
15. the feedback row remains `new` because the current owner panel exposes no
    supported status-transition action or API. No feedback was deleted;
16. no report was requested or sent for v156. After this documentation pull
    request merges, no work remains in progress. The exact next task is to read
    the next new or unresolved panel entry, reproduce any claimed defect on
    current production, and modify only a confirmed UI problem.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v146 continuity checkpoint

Verified through 2026-08-25 03:50 UTC for the catalog review reduction and
Sites v146. Report #009 remains the latest confirmed delivered report.

1. verified `master` before this continuity pull request:
   `13b8ec7c89c03626d4c71c61e83511965f41e9e5`;
2. PR #34 is merged as that commit and adds bounded automatic review handling
   for the official Flaconi feed. Importer validation passes 18/18;
3. catalog run #72, ID `32800552146`, attempt 1, push, completed successfully.
   It is the latest full TradeDoubler production snapshot;
4. scheduled run #67, ID `32777576698`, attempt 3, completed successfully.
   TradeDoubler was correctly skipped while Notino and Brasty finished with
   zero pending fresh offers;
5. isolated Flaconi run #4, ID `32800552050`, attempt 2, job `97677660697`,
   completed successfully at 03:48:35 UTC with no source error;
6. Sites v146 source commit is
   `f3031eeb6b124d8e568fa7bd804209ae6a0010d4`;
7. v146 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_eb1cd01923b481919c5a0701734ff163`;
8. deployment `appgdep_6a8d106a83848191ac8d0841b3ac7388` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
9. both production domains have active provider and SSL status with no last
   error. The Sites project is active, public and owned by the current user;
10. build and artifact validation pass, the full Sites suite passes 53/53,
    lint has zero errors with three existing warnings, and the independent
    final code review found no blocker;
11. directly rendered live counts are Aelia 1,381, Cocolita 855, Drogeria.pl
    845, Notino 5,431, Brasty 6,180 and Flaconi 3,668, total 18,360;
12. this is a net gain of 3,027 fresh offers from the verified 15,333 baseline;
13. the full TradeDoubler snapshot scanned 27,811 Cocolita, 32,414
    Drogeria.pl and 8,545 Aelia provider products. The shared explicit proof
    diagnostic ended at 972 review candidates, down from about 10,001;
14. Notino now has 5,431 live offers and 144 review rows. Brasty has 6,180
    live offers and 125 review rows. Both have zero automatic review rows and
    zero pending fresh offers;
15. the first safe Flaconi maintenance pass recovered 2,660 historical
    `gtin_not_found` rows and left 93 semantic conflicts in review;
16. v146 attempted the remaining 386 eligible Flaconi rows. Seventy-five
    passed every identity and visibility gate and became live; 61 were stopped
    by stricter GTIN gates and 250 received terminal unresolved reasons, so
    none can cause an automatic loop;
17. final Flaconi state is completed: 34,597 received, 3,668 imported, 1,357
    review, 29,572 excluded, 5,128 stored, 3,668 live and zero automatic review
    rows;
18. a full post-run scan covered 5,128/5,128 rows, all with unique external
    IDs. Review reasons are exactly 1,002 `gtin_identity_conflict`, 105
    `semantic_gtin_conflict`, 249 `missing_audience_unresolved` and one
    `missing_line_unresolved`; every legacy nonterminal reason, `catalog_hidden`
    and every other review reason is zero;
19. all 136 audited recovery candidates were resolved: 75 became live and 61
    were correctly held by the GTIN gates, adding 49 identity and 12 semantic
    conflicts instead of blindly attaching an offer;
20. local Flaconi audience inference is restricted to nine audited word-bound
    signals. Sibling evidence requires the same official feed and generation,
    terminal AWIN family, exact raw brand, concentration and product type,
    identical normalized title stem, one unanimous visible audience and no
    repeated GTIN. Mixed evidence remains in review;
21. hidden variants, exact GTIN identity conflicts, semantic conflicts and
    duplicate evidence still block publication. Unknown stored shipping is
    preserved as unknown, never changed to zero;
22. two confirmed historical cross-product mappings remain quarantined with
    unavailable listings and invalid offers;
23. coupon refresh is completed with one active approved coupon and three
    rejected unapproved tracking URLs;
24. direct production HTML at 03:49 UTC returned HTTP 200 and showed Lattafa
    Khamrah EDP 100 ml, Drogeria.pl, four stores, 108.98 PLN and the complete
    six-store rail. There was no empty hero;
25. report #009 remains the latest confirmed delivered report. No report was
    requested or sent for this catalog task;
26. after the documentation pull request merges, no work remains in progress.
    Investigate remaining conflicts only with stronger official identity
    evidence and do not relax the production gates to chase a lower counter.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v140 continuity checkpoint

Verified at 2026-08-25 00:47 UTC for Sites v140 and the global offer-price
integrity correction. Report #009 remains the latest confirmed delivered
report.

1. verified `master` before this continuity pull request:
   `786844704f861fca0a9c0baa02cb17966a2d03a0`;
2. PR #32 is merged as that commit and records Sites v139;
3. the newest completed Actions run is `Perfumetr catalog feeds` run #69,
   ID `32793165028`, attempt 1, pull request, success. Importer validation
   succeeded and the production import job was skipped;
4. isolated Flaconi run #2, ID `32719777955`, attempt 26, job `97633299587`,
   remains the latest completed Flaconi generation. Run #55 remains the latest
   full TradeDoubler snapshot;
5. Sites v140 source commit is
   `b39cef8a5afdf11c0b12424d53250daace512ffc`;
6. v140 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_217c05ee1f8c8191a229531cdcbfb981`;
7. deployment `appgdep_6a8ce58741a88191b93d5a2f47f35a9a` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
8. build and artifact validation pass, the full Sites suite passes 52/52 and
   lint has zero errors with three existing warnings;
9. the defect was global: offers with known delivery were always ranked before
   offers with unknown delivery, even if their visible amount was much higher;
10. SQL, the API builder, beta comparison, catalog detail and homepage now
    order by the lowest visible amount. A known final total wins only an exact
    visible-price tie;
11. when delivery is not verified, the UI shows `od`, names the amount as the
    product price and does not call it a final total or recommendation;
12. D1 now contains active, source-backed delivery rules for Cocolita and
    Drogeria.pl: DPD Pickup costs 7.99 PLN and is free from 159.00 PLN. The
    rules require re-verification after 30 days;
13. no ambiguous Aelia free-delivery threshold was guessed. Its unknown
    delivery remains explicit and cannot masquerade as a final total;
14. direct production HTML at 00:46 UTC returned HTTP 200 and showed Lattafa
    Khamrah EDP 100 ml, Drogeria.pl, three stores and 108.98 PLN together with
    delivery. The incorrect Brasty 162.38 PLN result disappeared;
15. current directly rendered counts remain Aelia 1,234, Cocolita 842,
    Drogeria.pl 841, Notino 5,363, Brasty 6,120 and Flaconi 933, total 15,333;
16. no import, source, mapping rule, scheduler or report was changed or started
    for v140;
17. report #009 remains the latest confirmed delivered report. No report was
    requested or sent for v140;
18. after the documentation pull request merges, no work remains in progress.
    Reverify the expiring delivery rules from official store sources and never
    turn an unknown delivery amount into a claimed checkout total.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v139 continuity checkpoint

Verified at 2026-08-25 00:18 UTC for Sites v139 and the new 24-hour homepage
cutout rotation. Report #009 remains the latest confirmed delivered report.

1. verified `master` before this continuity pull request:
   `79aa195b82c4f6229c34e00ef53dbb2e5e67cd3f`;
2. PR #31 is merged as that commit and safely paces consecutive Flaconi chunks
   by 12.5 seconds without changing other sources;
3. `Perfumetr catalog feeds` run #68, ID `32792155232`, pull request, completed
   successfully with importer tests 17/17 and its production job skipped;
4. the merge intentionally used the supported CI skip marker, so it did not
   run unrelated store imports;
5. isolated Flaconi run #2, ID `32719777955`, attempt 26, job `97633299587`,
   remains the latest completed Flaconi generation. Run #55 remains the latest
   full TradeDoubler snapshot;
6. Sites v139 source commit is
   `28c956a0d3f9f8f16ae2657142445b86d5cc782d`;
7. v139 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_e9671c30cc2c819194eace4ac4f2c061`;
8. deployment `appgdep_6a8cdeea96f88191ad385304c762d118` is
   `succeeded` with no failure message. Provider URL:
   `https://perfumetr.borodzicz85.chatgpt.site`;
9. build and artifact validation pass, the full Sites suite passes 50/50 and
   lint has zero errors with three existing warnings;
10. no browser QA was requested or run. A direct production HTML read of
    `perfumetr.pl` verified the changed elements;
11. the six locally reviewed transparent cutouts now share one 24-hour cycle,
    giving each bottle a four-hour slot;
12. the cycle starts with Lattafa Khamrah at 2026-08-25 00:00 UTC and repeats
    daily. The next cutout is selected directly from time and the reviewed
    manifest, without writing homepage rotation state to D1;
13. a temporarily unavailable scheduled product falls forward to the next
    reviewed cutout, preventing an empty hero or arbitrary feed photo;
14. production at 00:17 UTC showed Lattafa Khamrah EDP 100 ml, its reviewed
    transparent cutout, Brasty, three stores and a dynamic 162.38 PLN final
    price;
15. Flaconi appears in the accepted continuous store rail with 933 fresh
    offers. The rail reports six active stores;
16. current directly rendered counts are Aelia 1,234, Cocolita 842,
    Drogeria.pl 841, Notino 5,363, Brasty 6,120 and Flaconi 933, total 15,333;
17. Flaconi generation 2 remains completed with 34,597 received, 933 imported,
    4,092 review, 29,572 excluded and 5,128 stored products;
18. report #009 is still the latest confirmed delivered report. No report was
    requested or sent for v139;
19. after the documentation pull request merges, no import, Sites deployment
    or email remains in progress;
20. the next focused task is a read-only check after the first four-hour
    boundary to confirm the next reviewed bottle appears without an empty hero.
    Do not deploy if the timed transition works.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v138 continuity checkpoint

Verified from 2026-08-24 23:30 UTC through 2026-08-25 00:02 UTC for Sites v138,
the first complete official AWIN Flaconi generation and the follow-up pacing
fix. Report #009 is the latest confirmed delivered report.

1. verified `master` before the pacing continuity pull request:
   `d97eac6d122610e01e84acf42cf092fc04c349d1`;
2. Sites v138 source commit is
   `5ebfb1893e57a5d9cbd348967298417e61d945d1`;
3. v138 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_f56fc148ad548191a077e53116caa1a6`;
4. deployment `appgdep_6a8c469952d081919a75258f19cae3ed` is
   `succeeded` with no failure message;
5. v138 contains the official AWIN Flaconi CSV-gzip adapter, strict field
   mapping and bounded resumable import for advertiser 18563 and feed 37697;
6. the protected AWIN key is valid and encrypted in Sites. Never copy the key,
   ciphertext or keyed feed URL to GitHub, documentation or chat;
7. isolated workflow `Perfumetr Flaconi feed` run #2, ID `32719777955`,
   attempt 26, final job `97633299587`, completed successfully;
8. only `awin:flaconi` was advanced. No other store or TradeDoubler source was
   touched by this production import;
9. generation 2 is completed: 34,597 received, 933 imported, 4,092 review,
   29,572 excluded, 5,128 stored products and 933 live offers;
10. Flaconi is active and verified, its AWIN programme is approved and product
    status is ready;
11. Stronger With You EDT 50 ml, GTIN 3605522040281, is mapped to the existing
    variant with a fresh active Flaconi offer at 214.76 PLN and zero shipping;
12. the comparison is dynamic. No screenshot price or manual product JSON was
    inserted;
13. unchanged existing live counts are Aelia 1,234, Cocolita 843,
    Drogeria.pl 841, Notino 5,344 and Brasty 6,043. Together with Flaconi 933,
    the resulting total is 15,238;
14. public visual QA of the offer was not performed because the beta gate was
    active. Production D1 directly verified the offer, variant, affiliate URL,
    freshness, price and shipping;
15. the first full generation required isolated resumptions because Sites
    enforces 12 seconds between chunks and the GitHub client previously sent
    them immediately;
16. the follow-up client fix waits 12.5 seconds before consecutive Flaconi
    chunks, never retries HTTP 429 and does not change pacing for other sources;
17. syntax checks and the full importer suite pass 17/17, including a
    synthetic two-chunk Flaconi pacing test;
18. report #009 was sent to `support@perfumetr.pl` and confirmed in Sent. It
    covered the protected key handoff, v138 preparation and planned import;
19. no second report was requested or sent after completion;
20. after the continuity pull request merges, no import, Sites deployment or
    email remains in progress. Observe the next scheduled partner cycle once
    to prove the paced Flaconi refresh completes in one job.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v136 continuity checkpoint

Verified at 2026-08-24 11:57 UTC for Sites v136 and the focused cleanup of the
`Produkty i ceny` integration section. Report #008 was then the latest
confirmed delivered report.

1. verified `master` before this continuity pull request:
   `fb272af362f30263d004ef3ca888e29fe8f71135`;
2. PR #29 is merged as `fb272af362f30263d004ef3ca888e29fe8f71135`
   and records Sites v134, v135 and the authorized Flaconi feed check;
3. the newest scheduled partner workflow remains run #58, ID `32711816055`,
   attempt 1, schedule, success from 09:29:21 to 09:34:29 UTC;
4. run #53 attempt 8 remains the final completed CJ recovery generation. Run
   #55 remains the latest full TradeDoubler snapshot;
5. Sites v136 source commit is
   `d7bbc115a5717a1394a4e95fef7108b0ec62c087`;
6. v136 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_bd470fdd6bc4819191ef4bdbbd872673`;
7. deployment `appgdep_6a8c311d41588191a434e2bb64d0d70e` is
   `succeeded` with no failure message and was directly rechecked by the main
   agent. The provider URL is `https://perfumetr.borodzicz85.chatgpt.site`;
8. the pre-deployment Sites check confirmed an active public project and
   `https://beta.perfumetr.pl` as the live URL. The prior 11:29 UTC check of
   both custom domains recorded active domain, provider and SSL state with no
   error; v136 changed no domain configuration;
9. build and artifact validation pass, the full Sites suite passes 50/50 and
   lint has zero errors with three existing warnings;
10. no browser QA was run for v136. Rendered coverage asserts all six cards,
    and an independent read-only review found no blocker;
11. Cocolita, Drogeria.pl, Aelia.pl, Notino, Brasty and Flaconi each have one
    identically placed `Odśwież status` action;
12. every card uses only its existing safe GET endpoint. No client card sends
    POST or can start or advance an import;
13. all six cards poll every 30 seconds and use consistent loading, success and
    error feedback, `aria-busy` state, live announcements and collapsible
    details structure;
14. the Notino access diagnostic now starts in `idle`, so `Sprawdź dostęp` no
    longer remains disabled as `Sprawdzam…` before the first click;
15. a TradeDoubler status read is no longer blocked by an importer busy flag.
    A temporary panel read failure does not falsely turn an active offer badge
    red;
16. disconnecting an integration during a manual status read cannot leave its
    button stuck after reconnection;
17. v136 changed no importer route, source configuration, schema, scheduler,
    catalog mapping, offer, price or coupon data;
18. live counts therefore retain the verified baseline: Aelia 1,234, Cocolita
    843, Drogeria.pl 841, Notino 5,344 and Brasty 6,043, total 14,305;
19. run #58 partial review counters remain Notino 54 and Brasty 154. The prior
    completed generation ended with 297 true manual rows and zero automatic or
    pending-fresh work;
20. vouchers remain 4 received, 1 imported, 3 excluded and 1 active. The active
    coupon is not silently applied without structured owner confirmation;
21. Flaconi approval remains persisted, but generation 1 remains paused with
    `feed_not_found`, zero imported rows and no active Flaconi offer. The next
    data step still requires the separate protected AWIN Data Feed API key;
22. v133 catalog motion and matte glass, v134 network-card cleanup and v135
    scoped workflow trust remain deployed and unchanged by v136;
23. product ratings remain unpublished because no authoritative structured
    rating and review-count source has been verified;
24. report #008, dated 2026-08-24, was sent to `support@perfumetr.pl` at
    09:59 UTC and confirmed in Sent. No report was requested or sent for v136;
25. after this continuity pull request merges there is no Sites edit, importer
    run, deployment or email in progress. The next data task is to read Product
    Feed List after the protected Data Feed API key is saved, select advertiser
    18563 using its real format and locale, and continue the bounded official
    import.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Earlier Sites v128 continuity checkpoint retained for history

Verified at 2026-08-22 17:20 UTC for Sites v128 and catalog recovery. This
checkpoint supersedes the lower v123 checkpoint retained for history.

1. verified `master` before continuity PR #22:
   `8eab30aac9d9209c3d73a19cfcddaa08ed6787ce`;
2. PR #20 and PR #21 are merged; PR #22 is the documentation-only continuity
   record for this checkpoint and its final state must be checked directly;
3. GitHub Actions run #47, ID `32581506389`, attempt 15, production job
   `97065393622`, completed successfully from 17:16:44 to 17:17:26 UTC;
4. attempt 15 reported no HTTP 429 or workflow error; run #28 remains the
   latest full TradeDoubler snapshot;
5. Sites v128 source commit is
   `7f4943aac6d4256faccb2f62ebb50f9bf56589d5`;
6. v128 version ID is
   `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_54ab4c69fcac8191a673e5dccda17080`;
7. deployment `appgdep_6a89d93b1f988191886c838226132d0f` is
   `succeeded`;
8. the build passed, the full Sites suite passed 47/47, lint has zero errors
   and three existing warnings, and an independent review found no blocker;
9. the safe Notino coverage backlog fell from 1,381 to 0 and added 701 live
   offers;
10. final live counts are Aelia 1,185, Cocolita 830, Drogeria.pl 835,
    Notino 5,297 and Brasty 6,041, total 14,188;
11. Notino is completed with 209 review, 0 automatic and 0 pending fresh;
12. Brasty is completed with 220 review, 0 automatic and 0 pending fresh;
13. the remaining review cases are true manual cases and are not presented as
    safe automatic matches;
14. the exact homepage spotlight shows Notino, 5 stores, 217.40 PLN total and
    220.50 PLN saving for Stronger With You EDT 50 ml;
15. prices and offer details remain dynamic; no screenshot price or manual
    product JSON was inserted;
16. TradeDoubler vouchers remain 4 received, 4 excluded, 0 imported and 0
    active;
17. Flaconi remains externally blocked by
    `orchestrator_feed_not_found`;
18. report #006 remains the latest confirmed delivered report; no report was
    sent for this work;
19. there is no code change, import, deployment, pull request merge or email
    delivery in progress except the documentation-only PR #22 until its final
    state is confirmed;
20. the next time-based task is the read-only homepage rotation check after
    2026-08-23 09:20 UTC.

Treat this as dated evidence and recheck all unstable values before a new
change.

## Latest paste-ready handoff baseline

```text
KONTYNUUJEMY PROJEKT PERFUMETR

Nie zakładaj, że widzisz historię poprzedniego czatu.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny master, najnowszy GitHub Actions run, ostatni pełny
TradeDoubler, bieżącą wersję i wdrożenie Sites, D1, domeny oraz produkcję.
Jeżeli wystąpi rozbieżność, najpierw opisz ją użytkownikowi. Nie zmieniaj kodu,
importera, konfiguracji ani produkcji przed zakończeniem kontroli.

CZAS WERYFIKACJI
Około 27 sierpnia 2026, 18:15 UTC.

GITHUB I WORKFLOW
Zweryfikowany master:
c5f52143dcf9050e35350be31e6e51a7b5ac431d
Pełny TradeDoubler run #93 zakończył się sukcesem: Cocolita 886,
Drogeria.pl 855 i Aelia.pl 1461 aktywnych ofert.
Izolowany Flaconi run #6, ID 33102239793, zakończył się sukcesem.
Końcowy Notino run #101, ID 33102412389, zakończył się sukcesem.
GitHub Actions pozostaje jedynym automatycznym harmonogramem.

SITES
Wersja v180.
Commit: 0312176047d0098b737e9cdaea83d0843d4af246
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_a9b91b18c0b88191b486650065006fbd
Deployment: appgdep_6a907db645688191a1d3f659622e4f45
Status: succeeded, brak failure message.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Build i walidacja artefaktu przeszły. Pełny suite 66/66. Lint: 0 błędów i
3 istniejące ostrzeżenia. Niezależna kontrola końcowa: GO.

V180 I BEZPIECZNE DOMKNIĘCIE FEEDU
Ostatnia strona EOF jest najpierw trwale zapisywana razem z kursorem i
fingerprintem. Trzy idempotentne fazy cleanup działają osobno, odnawiają lease
i pozostawiają źródło na trwałym paused checkpoint, więc przerwany cykl może
bezpiecznie powtórzyć cleanup bez ponownego zapisu strony. Dopiero po wszystkich cleanupach jedna transakcja
ustawia źródło completed, czyści error i przywraca registry ready.
Nie omijaj tego mechanizmu i nie przedłużaj ręcznie lease.

OFERTY
Cocolita: 886 live.
Drogeria.pl: 855 live.
Aelia.pl: 1461 live.
Douglas PL generation 3: completed, 51996 received, 4032 accepted i live,
1742 review, 46222 excluded. Logo i wordmark Douglas są potwierdzone na
publicznym pasku sklepów.
Flaconi run #6: completed, 35171 received, 3756 imported i live, 1344 review,
30071 excluded, 5247 stored, automatic review 0, maintenance processed 221.
Notino run #101: completed, 5333 live, 663 review, 2858 excluded, 3619
imported, 10240 stored, pending fresh 0, automatic review 0.
Brasty: completed, 5585 live, pending fresh 0.
Łącznie: dokładnie 21908 świeżych aktywnych ofert.
Publiczne statystyki API: 9690 pozycji katalogu, wszystkie 9690 ze zdjęciem,
658 marek.

D1 I BLOKADY
Wszystkie wiersze import sources mają completed i error null. sync_locks jest
puste. Nie trwa import ani blokada katalogu.
Parfumdreams PL zostało odrzucone przez AWIN, ale registry nadal pokazuje stary
stan applied. To rozbieżność rejestru, nie aktywna akceptacja.
Globalny audyt duplikatów opublikowanych rodzin i manual review nie jest
ukończony. Nie osłabiaj GTIN, identity, hidden catalog ani perfume-v1, żeby
zwiększyć licznik.

DOMENY
Provider i beta.perfumetr.pl odpowiadały 200.
perfumetr.pl zwrócił 502, a potem dwa razy 200. Nie przedstawiaj problemu
pierwszego wejścia jako całkowicie wykluczonego.
www.perfumetr.pl stale zwraca 502 i pozostaje nierozwiązane.

RAPORT
Raport #010 został dostarczony na support@perfumetr.pl. Gmail potwierdza SENT
i INBOX 27 sierpnia 2026 o 01:08:03 UTC. Raport #009 jest poprzednim
dostarczonym raportem, a #003 pozostaje wzorem wizualnym. Raport #011 nie został
zamówiony ani wysłany.

PRACA W TOKU I NASTĘPNE ZADANIE
Nie trwa import, wdrożenie ani wysyłka maila. Następne zadanie to odczytowy,
globalny audyt potencjalnych duplikatów oraz pozostałych przypadków manual
review. Automatycznie naprawiaj wyłącznie przypadki jednoznaczne; konflikty
GTIN, koncentracji, odbiorcy, typu, pojemności i tożsamości pozostaw do kontroli.

Najpierw potwierdź użytkownikowi rzeczywisty stan i każdą rozbieżność. Dopiero
potem kontynuuj pracę.
```

## Earlier Sites v136 paste-ready handoff baseline

```text
KONTYNUUJEMY PROJEKT PERFUMETR

Nie zakładaj, że widzisz historię poprzedniego czatu.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny master, najnowszy GitHub Actions run, ostatni pełny
TradeDoubler, bieżącą wersję i wdrożenie Sites, domeny perfumetr.pl i
beta.perfumetr.pl oraz produkcję. Jeżeli wystąpi rozbieżność, najpierw opisz ją
użytkownikowi. Nie zmieniaj kodu, importera, konfiguracji ani produkcji przed
zakończeniem kontroli.

CZAS WERYFIKACJI
24 sierpnia 2026, 11:57 UTC.

GITHUB
Master przed dokumentacyjnym PR:
fb272af362f30263d004ef3ca888e29fe8f71135
PR #27 jest scalony jako 3092cd09d80080acb4fc450fe5461b3f932d3673.
PR #28 jest scalony jako 12bc37c2c2e8fbe2a0788a55923342eb4fc39242
i dodaje tylko ograniczony workflow Flaconi bez harmonogramu, uruchamiany przy
push i ręcznie.
PR #29 jest scalony jako fb272af362f30263d004ef3ca888e29fe8f71135 i
zapisuje Sites v134, v135 oraz kontrolę feedu Flaconi.
Workflow Perfumetr Flaconi feed run #1, ID 32719672617, przeszedł walidację
16/16; import był poprawnie pominięty dla PR.
Run #2, ID 32719777955, attempt 1 nie dotarł do AWIN. Sites odrzuciło nową
tożsamość workflow kodem orchestrator_404.
Po Sites v135 run #2 attempt 2, job 97413228339, success,
11:20:17–11:20:35 UTC, przeszedł OIDC, dotarł do AWIN i zakończył się
obsługiwanym blockerem orchestrator_feed_not_found przed skanowaniem.
Najnowszy zaplanowany cykl partnerski pozostaje run #58. Run #55 pozostaje
ostatnim pełnym TradeDoublerem. GitHub Actions jest jedynym automatycznym
harmonogramem.

SITES
Wersja v136.
Commit: d7bbc115a5717a1394a4e95fef7108b0ec62c087
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_bd470fdd6bc4819191ef4bdbbd872673
Deployment: appgdep_6a8c311d41588191a434e2bb64d0d70e
Status wdrożenia: succeeded, brak failure message.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Live URL: https://beta.perfumetr.pl
Projekt jest aktywny i publiczny. Poprzednia kontrola obu domen potwierdziła
aktywną domenę, provider i SSL bez błędu, a v136 nie zmieniło konfiguracji
domen. Build i artefakt działają, testy 50/50, lint ma 0 błędów i 3 wcześniejsze
ostrzeżenia. Nie wykonano przeglądarkowego QA v136.

PANEL INTEGRACJI
TradeDoubler, AWIN i CJ mają teraz te same pola Połączenie, Programy, Katalogi
i Promocje oraz ten sam przycisk odświeżenia. Promocje i kupony są wspólne dla
sieci. AWIN SSR czyta zapisany rejestr programów, więc 1 z 5 nie znika po
odświeżeniu. Zwykły odczyt panelu nie uruchamia importu.
Sites v135 ufa dokładnie flaconi.yml tylko w catalog orchestratorze. Workflow
Flaconi nie ma dostępu do mostu TradeDoubler.
Sites v136 porządkuje sekcję Produkty i ceny. Wszystkie sześć kart ma jeden
przycisk Odśwież status, polling co 30 sekund, te same stany ładowania i błędu
oraz tę samą zwijaną strukturę szczegółów. Każdy przycisk używa wyłącznie
bezpiecznego GET. Karty nie wysyłają POST i nie uruchamiają importu. Diagnostyka
Notino startuje w stanie idle, więc Sprawdź dostęp nie pozostaje zablokowane.
Chwilowy błąd odczytu panelu nie udaje awarii aktywnych ofert.

FLACONI
D1 trwale potwierdza advertiser 18563 jako approved. Decyzję zapisano o
10:19:17 UTC, a najnowsza kontrola jest z 11:20:30 UTC. Wcześniejsze 0 z 5 było
błędem UI, nie utratą akceptacji.
Po pełnej godzinie propagacji oficjalny oczekiwany Enhanced endpoint nadal
zwrócił feed_not_found. Generacja 1 jest paused, liczniki received, accepted,
review i rejected wynoszą 0. Nie istnieje jeszcze merchant ani oferta Flaconi.
Nie ma skonfigurowanego statusu data_feed_api_key. Właściciel musi zapisać
osobny Feed API Key w chronionym polu integracji, nigdy w czacie ani GitHubie.
Następnie trzeba odczytać Product Feed List i użyć rzeczywistego formatu,
Feed ID oraz locale dla reklamodawcy 18563, bez zgadywania.
Flaconi jest już obsługiwane w rejestrze sklepów i ogólnych powierzchniach
ofert. Pojawi się dynamicznie w pasku dopiero po powstaniu zweryfikowanych,
świeżych ofert. Nie dodawaj go statycznie.

OFERTY I IMPORTER
Ostatni zweryfikowany baseline pozostaje bez zmian: Aelia 1234, Cocolita 843,
Drogeria.pl 841, Notino 5344 i Brasty 6043, razem 14305 aktywnych ofert.
Run #58 ma częściowe review 54 dla Notino i 154 dla Brasty. Poprzednia
zakończona generacja miała 297 prawdziwych przypadków ręcznych.

KUPONY I RAPORT
Kupony: 4 odebrane, 1 zaimportowany, 3 wykluczone, 1 aktywny. Aktywny kupon nie
jest po cichu uwzględniany bez strukturalnego potwierdzenia właściciela.
Raport #008 z 24 sierpnia 2026 został wysłany o 09:59 UTC na
support@perfumetr.pl i potwierdzony w folderze Wysłane. Nie wysłano nowego
raportu dla v134, v135, v136 ani dla tej kontroli feedu.

PRACA W TOKU I NASTĘPNE ZADANIE
Po scaleniu dokumentacyjnego PR nie trwa edycja Sites, import, wdrożenie ani
wysyłka e-maila. Następnym potwierdzonym krokiem jest zapisanie przez właściciela
osobnego Feed API Key w chronionym panelu. Po jego zapisaniu odczytaj Product
Feed List, wybierz reklamodawcę 18563 według realnego formatu i locale, a
następnie kontynuuj ograniczony oficjalny import. Nie przedstawiaj Flaconi jako
aktywnego sklepu przed realnymi ofertami.
```

## Earlier Sites v128 paste-ready handoff baseline retained for history

```text
KONTYNUUJEMY PROJEKT PERFUMETR

Nie zakładaj, że widzisz historię poprzedniego czatu.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny master, najnowszy GitHub Actions run, ostatni pełny
TradeDoubler, bieżącą wersję i wdrożenie Sites, domeny perfumetr.pl i
beta.perfumetr.pl oraz produkcję. Jeżeli wystąpi rozbieżność, najpierw opisz ją
użytkownikowi. Nie zmieniaj kodu, importera, konfiguracji ani produkcji przed
zakończeniem tej kontroli.

CZAS WERYFIKACJI
22 sierpnia 2026, 17:20 UTC.

GITHUB
Master przed PR #22:
8eab30aac9d9209c3d73a19cfcddaa08ed6787ce
PR #20 i #21 są scalone. PR #22 zapisuje ten stan i trzeba sprawdzić jego
ostateczny CI oraz merge.
Najnowszy cykl: run #47, ID 32581506389, attempt 15, job 97065393622,
success, 17:16:44–17:17:26 UTC. Nie wystąpił HTTP 429.
Ostatni pełny TradeDoubler: run #28, ID 32497431067, attempt 3.
GitHub Actions jest jedynym automatycznym harmonogramem.

SITES
Wersja v128.
Commit: 7f4943aac6d4256faccb2f62ebb50f9bf56589d5
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_54ab4c69fcac8191a673e5dccda17080
Deployment: appgdep_6a89d93b1f988191886c838226132d0f
Status: succeeded.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Build działa, testy 47/47, lint 0 błędów i 3 wcześniejsze ostrzeżenia.
Obie domeny zachowują poprzedni aktywny stan; sprawdź go ponownie przed zmianą.

AUTOMATYZACJA KATALOGU
Importer używa oficjalnych danych dostawców. Nie dodano ręcznego JSON ani ceny
ze zrzutu. Bezpieczne mapowanie wymaga jednoznacznego pełnego GTIN. Stare
oferty są odświeżane przez oficjalne zapytanie po ID produktu. Audyt pokrycia
szuka brakujących ofert tylko dla zweryfikowanych wariantów z aktywną ofertą
innego zweryfikowanego sklepu. GitHub opróżnia ograniczone paczki i zatrzymuje
się przy braku postępu, błędzie, cooldownie, busy albo limicie 48 kroków.
Konflikty po świeżym odczycie przechodzą do prawdziwej ręcznej kontroli i nie
zapętlają automatu.

WYNIK
Aelia: 1185 aktywnych ofert.
Cocolita: 830.
Drogeria.pl: 835.
Notino: 5297, review 209, automatic 0, pending fresh 0.
Brasty: 6041, review 220, automatic 0, pending fresh 0.
Łącznie: 14188.
Backlog pokrycia Notino spadł z 1381 do 0, a Notino zyskało 701 ofert.
Pozostałe review to rzeczywiste przypadki ręczne, nie bezpieczne automatyczne
dopasowania.
Kupony: 4 odebrane, 4 wykluczone, 0 aktywnych.
Flaconi: zewnętrzna blokada orchestrator_feed_not_found.

STRONA GŁÓWNA
Bezpośrednia kontrola po attempt 15: HTTP 200, Stronger With You EDT 50 ml,
Notino, 5 sklepów, 217,40 zł łącznie i 220,50 zł oszczędności. Dane są
dynamiczne z D1. Cena ze zrzutu nie została wpisana na stałe.

PRACA W TOKU
Brak po scaleniu dokumentacyjnego PR #22. Nie ma edycji, importu, wdrożenia ani
wysyłki e-mail.

NASTĘPNE ZADANIE CZASOWE
Po 23 sierpnia 2026 o 09:20 UTC wyłącznie odczytowo sprawdź, czy czasowy
spotlight wygasł, wróciła zwykła pięciodniowa rotacja, oferta jest dynamiczna i
nie ma pustego ani starego hero. Nie wdrażaj niczego, jeśli powrót zadziałał.

RAPORTY
Raport #006 pozostaje ostatnim potwierdzonym. Dla tej pracy nie wysłano raportu.
Nie wysyłaj kolejnego bez wyraźnego polecenia użytkownika. Przed raportem
sprawdź Wysłane i odwzoruj dokładnie szablon raportu #003.

Najpierw krótko potwierdź użytkownikowi rzeczywisty odczytany stan i każdą
rozbieżność. Dopiero potem wykonuj następne konkretne zadanie.
```

## Earlier continuity checkpoint retained for history

Verified at 2026-08-22 13:44 UTC for Sites v123; continuity pull request
`#20` records this checkpoint:

1. `master` before PR #20 was
   `aaec7bbe009426f98d922d2356b027d4650b66c2`;
2. pull requests `#12` through `#19` are merged; PR #20 is the
   documentation-only v123 continuity record and its live state must be checked;
3. latest Actions run before this continuity PR is number `43`, ID
   `32565560052`, attempt `1`, pull-request validation, conclusion
   `success`;
4. run 43 passed importer validation `14/14` and skipped production import;
5. latest scheduled production partner cycle remains run `41`, ID
   `32563903356`, attempt `1`, successful from 09:03:07 to 09:07:08 UTC;
6. run 41 skipped the full TradeDoubler snapshot and advanced partner sources;
   latest full TradeDoubler remains run `28`, ID `32497431067`, attempt
   `3`;
7. the latest verified live-offer counters remain Aelia `1,049`, Cocolita
   `793`, Drogeria.pl `814`, Notino `4,422` and Brasty `1,092`,
   total `8,170`;
8. Notino remains completed in run 41 and Brasty remains paused incomplete;
9. TradeDoubler vouchers remain 4 received, 4 excluded, 0 imported and
   0 active coupons;
10. AWIN Flaconi remains externally blocked by
    `orchestrator_feed_not_found`;
11. Sites v123 is deployed from source commit
    `9333dfcbcb02bdb172908b2c9bb7191e369f3b9d`;
12. v123 version ID is
    `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_8168714f30308191bec15294142b87e9`;
13. v123 deployment ID is `appgdep_6a89a78633c88191b681c5d81d89dda8`
    and its directly rechecked status is `succeeded`;
14. the provider URL remains
    `https://perfumetr.borodzicz85.chatgpt.site`;
15. Sites reports version `123`, the project is active and public, and
    `https://beta.perfumetr.pl` is the current live URL;
16. `perfumetr.pl` and `beta.perfumetr.pl` retain active domain, provider
    and SSL state;
17. the production build passed, the full Sites suite passed `47/47`, and
    lint has zero errors with three existing warnings;
18. the active Stronger With You spotlight still reads Brasty, 4 stores and
    239.74 PLN for the 50 ml EDT variant;
19. the homepage now displays `pojemność 50 ml` instead of the negligible
    `oszczędzasz 0,08 zł · −0%`;
20. savings are shown in the hero only when they are at least 5 PLN and 2%;
21. meaningful discounts remain visible and the price, merchant, store count,
    delivery and coupon effects remain dynamic;
22. the Stronger With You spotlight interval, fallback and saved five-day
    rotation were not changed;
23. the beta, search, catalog, filters, store rail, footer and integrations
    panel were not changed in v123;
24. no importer, schema, schedule, source or domain configuration changed in
    v123;
25. report `#006`, dated 2026-08-22, remains the latest confirmed delivered
    report;
26. no report was sent for v122 or v123, following the user's daily-report
    policy;
27. no code change, import, Sites deployment or email delivery is currently in
    progress;
28. the exact next task is to verify after 2026-08-23 09:20 UTC that the normal
    homepage rotation resumed, or before then respond to concrete tester
    feedback or the user's next targeted visual request.

Treat this checkpoint as dated evidence, not as a substitute for a fresh GitHub
and Sites check.

## Earlier paste-ready handoff baseline retained for history

When the transfer trigger occurs, first refresh every unstable value. Then
return one self-contained Polish message using the following baseline and
include any newer verified facts:

```text
Kontynuujemy projekt Perfumetr z poprzedniego czatu. Nie zakładaj, że widzisz
jego historię.

Najpierw niczego nie zmieniaj. Użyj GitHuba i Sites wyłącznie do odczytu.
Przeczytaj w repozytorium GADOMM/Index:
AGENTS.md
PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CHAT_CONTINUITY.md

Następnie sprawdź aktualny commit gałęzi master, najnowszy przebieg GitHub
Actions, ostatni pełny produkcyjny import, aktualną wersję i wdrożenie Sites
oraz stan domen perfumetr.pl i beta.perfumetr.pl. Porównaj je z poniższym
przekazaniem. Jeżeli wystąpi rozbieżność, najpierw ją opisz. Nie zmieniaj kodu,
importera, konfiguracji ani produkcji przed zakończeniem tej weryfikacji.

CZAS OSTATNIEJ WERYFIKACJI
2026-08-22 13:44 UTC

REPOZYTORIUM I CI
Master przed PR #20: aaec7bbe009426f98d922d2356b027d4650b66c2.
PR #20 zapisuje wdrożenie Sites v123; jego aktualny stan trzeba sprawdzić.
Ważne PR-y #12–#19 są scalone.
Najnowszy Actions: run #43, ID 32565560052, attempt 1, pull_request, success.
Walidacja importera przeszła, a import produkcyjny został pominięty.
Ostatni produkcyjny cykl partnerski: run #41, ID 32563903356, attempt 1,
schedule, success, 2026-08-22 09:03:07–09:07:08 UTC. Pełny TradeDoubler został
pominięty, a źródła partnerskie przesunięte.
Ostatni pełny TradeDoubler: run #28, ID 32497431067, attempt 3, success.
GitHub Actions jest jedynym automatycznym harmonogramem.

SITES I DOMENY
Projekt Perfumetr jest aktywny i publiczny.
Aktualna wersja: v123.
Commit źródłowy: 9333dfcbcb02bdb172908b2c9bb7191e369f3b9d.
Version ID:
appgprj_6a8236775b808191b6b4979c4d86d889~appgver_8168714f30308191bec15294142b87e9
Deployment: appgdep_6a89a78633c88191b681c5d81d89dda8, succeeded.
Testy: 47/47; lint: 0 błędów i 3 istniejące ostrzeżenia.
Provider URL: https://perfumetr.borodzicz85.chatgpt.site
Sites live URL: https://beta.perfumetr.pl
perfumetr.pl i beta.perfumetr.pl: aktywna domena, provider i SSL, bez błędu.

IMPORTER I OFERTY
Aelia: 1049 aktywnych ofert.
Cocolita: 793 aktywne oferty.
Drogeria.pl: 814 aktywnych ofert.
Notino: 4422 aktywne oferty; run #41 zakończony: 7005 odebranych, 3776
zaimportowanych, 445 review, 2784 wykluczone, 8291 zapisanych.
Brasty: 1092 aktywne oferty; run #41 nieukończony i wstrzymany po ograniczonym
cyklu: 9540 odebranych, 1514 zaimportowanych, 7885 review, 141 wykluczonych,
6582 zapisane. Nie przedstawiaj tego jako pełnego zakończonego odświeżenia.
Łącznie: 8170 aktywnych ofert.
Kupony TradeDoubler: 4 odebrane, 4 wykluczone, 0 zaimportowanych, 0 aktywnych.
Flaconi: zewnętrzna blokada orchestrator_feed_not_found.
Nie traktuj ograniczonych proof importów jako wielkości pełnego feedu.

STAN WSZYSTKICH ELEMENTÓW
Repozytorium i CI działają. Sites v123 działa. Importer i harmonogram nie były
zmieniane w v123. Pięć źródeł ma aktywne oferty; Flaconi jest zewnętrznie
zablokowane. Strona główna ma czasowy spotlight Stronger With You i pokazuje
pojemność 50 ml zamiast symbolicznej oszczędności 0,08 zł. Strona beta,
wyszukiwarka, katalog, filtry, pasek pięciu sklepów, licznik sklepów, stopka i
panel integracji zachowują stan v121. Obie domeny i SSL są aktywne. Feedback
testerów może nadejść i nie został jeszcze przeanalizowany.

OSTATNIO ZAKOŃCZONA PRACA
Sites v123 usuwa odstraszający komunikat „oszczędzasz 0,08 zł · −0%” z hero.
Oszczędność jest teraz pokazywana tylko od 5 zł i 2%. Przy mniejszej różnicy
trzecia metryka pokazuje pojemność flakonu, obecnie 50 ml. Stronger With You,
Brasty, 4 sklepy, cena 239,74 zł, czas spotlightu i dynamiczne dane pozostały
bez zmian. Produkcja odpowiada HTTP 200, testy przeszły 47/47, a wdrożenie v123
ma status succeeded.

CO NIE DZIAŁA LUB POZOSTAJE ZEWNĘTRZNE
AWIN Flaconi czeka na aktywację feedu po stronie zewnętrznego partnera.
Bieżąca generacja Brasty w run #41 jest incomplete i ma być kontynuowana przez
kolejny zaplanowany cykl. Subiektywny feedback nowych testerów nie został
jeszcze zebrany.

PRACA W TOKU
Brak.

DOKŁADNE NASTĘPNE ZADANIE
Po 23 sierpnia 2026 o 09:20 UTC potwierdzić, że wróciła zwykła rotacja strony
głównej. Wcześniej reagować wyłącznie na konkretny feedback testerów lub kolejną
precyzyjną prośbę wizualną użytkownika.

RAPORTY
Raport #006 z 2026-08-22 jest ostatnim potwierdzonym raportem. Dla v122 ani v123 nie
wysłano raportu. Nie wysyłaj raportu automatycznie po każdym wizualnym
wdrożeniu. Użytkownik poprosi o jeden raport po zakończeniu dnia.
Przed wysłaniem odczytaj raport #003 z Wysłanych i odwzoruj dokładnie jego
szablon, wordmark, układ, typografię, logo i stopkę. Sprawdź ostatni faktycznie
dostarczony numer przed nadaniem kolejnego. Raport wysyłaj wyłącznie na
support@perfumetr.pl, chyba że użytkownik jawnie zmieni odbiorcę.

Wymagana stopka:
Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

Najpierw potwierdź użytkownikowi, co odczytałeś i jaki jest rzeczywisty stan.
Dopiero potem przejdź do następnego zadania.
```

If work is in progress when the handoff is requested, replace the `Brak`
statement with its exact unfinished state: files changed, tests run, deployment
status and next safe verification step. Never present unfinished or unverified
work as complete.

## Report delivery rules

The current user instruction supersedes the earlier automatic
per-deployment-email rule.

1. Do not send a report merely because a visual deployment completed.
2. Wait for the user to explicitly request the consolidated report, normally
   after the workday.
3. Before composing it, retrieve delivered report `#003` from Sent and use
   that exact visual template. Preserve its wordmark, spacing, typography,
   colors, content structure, inline Perfumetr logo and approved footer.
4. Verify the latest delivered report number in Sent immediately before
   assigning the next number.
5. Send only to `support@perfumetr.pl` unless the user explicitly changes the
   recipient.
6. Record `sent` only after delivery is confirmed. Otherwise use `deferred`,
   `pending` or `not required`.
7. Report `#011`, dated 2026-08-31, is the latest confirmed delivered report.
   Gmail records `SENT` and `INBOX` at 2026-08-31 00:36:59 UTC. It covers
   marketing analytics, audited catalog identity and freshness, the v184-v194
   safety baseline and the Sites v195 atomic TradeDoubler rollout. Report
   `#010` is the immediately previous delivered report, and report `#003`
   remains the visual template authority. If the sequence remains unchanged
   and the user explicitly requests another report, the next number is `#012`.
8. Never put credentials, provider payloads or private mailbox content into the
   repository.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## When GitHub and Sites disagree

Stop before deployment. Verify both sides directly. A GitHub script can be
correct while the required Sites endpoint is absent, and a successful import
can still be hidden by separate public-catalog rules. Update the continuity
files only after the mismatch is understood.

## Information that must never enter a handoff

Never store tokens, passwords, provider download URLs, OIDC assertions, browser
tickets, administrator cookies, private provider payloads or copied mailbox
content. Use safe error codes and authorized dashboard links instead.
