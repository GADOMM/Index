# Perfumetr project state

Updated: 2026-08-24 09:35 UTC

This file contains no credentials. Verify every external status again before a
new change, import, deployment or report.

## Latest production checkpoint

Verified at 2026-08-24 09:35 UTC. The Sites v131 deployment remains the
directly verified production baseline from 01:43 UTC. Repository, automation,
partner counters and report delivery were rechecked for this update. This
checkpoint supersedes the dated v128 checkpoint below.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before report-delivery pull request `#25`:
  `deedfdb60d0129cfefb51d89631ab897f434d980`;
* pull request `#22` is merged as
  `67e35944c9a66706cedb6c942a5dc4df25354769`;
* pull request `#23` is merged as
  `9d6e73bd0c3b64abd0e92623b913ae9db73479fc` and exposes only
  allowlisted aggregate voucher-rejection reasons to GitHub logs;
* pull request `#24` is merged as
  `deedfdb60d0129cfefb51d89631ab897f434d980` and records the Sites v131
  production checkpoint;
* pull request `#25` is the documentation-only record of report `#007`;
  verify its final CI and merge state directly;
* the newest production workflow is run `#58`, database ID `32711816055`,
  attempt `1`, event `schedule`, completed successfully from 09:29:21 to
  09:34:29 UTC; importer validation passed `16/16`, the full TradeDoubler step
  was correctly skipped, and the bounded partner orchestrator succeeded;
* the final recovery cycle is run `#53`, database ID `32666073700`, attempt
  `8`, production job `97295719976`, completed successfully from 01:36:08 to
  01:39:06 UTC with no HTTP 503 or orchestrator failure;
* run `#55` is also the latest full TradeDoubler snapshot. Its full import
  step ran successfully from 00:24:49 to 00:41:51 UTC, although the overall
  run failed on the retired pre-v131 CJ maintenance path;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `131`;
* source commit `58f4f79b450b6b630424d796da9ca1c09f0e965f`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_912572e2753081919d42a89733a2b49c`;
* deployment `appgdep_6a8b987f78088191b6b87986b9435d01`;
* deployment status `succeeded`, directly rechecked after publication;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports version `131`, an active public project and
  `https://beta.perfumetr.pl` as the live URL;
* `perfumetr.pl` and `beta.perfumetr.pl` have active domain, provider and SSL
  state with no recorded error;
* production build passed, the full suite passed `49/49`, artifact validation
  passed, and lint has zero errors with three existing warnings;
* an independent read-only review found no data-safety or deployment blocker.

The production work spanned Sites v129 through v131:

1. v129 repaired the TradeDoubler voucher destination classification, added
   exact-source review recovery and simplified the beta catalog interaction;
2. v129 added three optional homepage rotation cutouts for Paco Rabanne
   1 Million EDT 100 ml, Lattafa Khamrah EDP 100 ml and Carolina Herrera Good
   Girl Blush EDP 50 ml. Their price, merchant, offer count, delivery and
   coupon effects remain dynamic D1 data;
3. v130 added a one-time voucher-import revision marker so the fixed rules
   bypassed the old fresh gate exactly once without adding a general force
   switch;
4. v131 made the retired seed cleanup read-only for the already-current marker,
   rewrote two quadratic CJ listing invalidations as source-driven indexed
   joins and added the
   `catalog_source_products_maintenance_idx` D1 index.

No provider JSON, screenshot price, token, private payload or manual offer was
inserted. Hard mapping conflicts remain excluded from automatic retry. Missing
GTIN may only reuse one exact unique semantic catalog variant and cannot expand
the catalog.

Current live offers and the newest partial CJ-generation counters:

| Source | Live offers | Review | Automatic | Pending fresh |
| --- | ---: | ---: | ---: | ---: |
| Aelia.pl | 1,234 | bounded TradeDoubler proof | not applicable | not applicable |
| Cocolita | 843 | bounded TradeDoubler proof | not applicable | not applicable |
| Drogeria.pl | 841 | bounded TradeDoubler proof | not applicable | not applicable |
| Notino | 5,344 | 54 partial | 54 | 0 |
| Brasty | 6,043 | 154 partial | 66 | 0 |

The verified total remains `14,305` live offers. Run #58 started new CJ
generations and stopped both safely at the 48-step cycle limit. Their partial
review and automatic counters are not final and must not be compared directly
with a completed generation. The preceding completed generation ended with
`297` true manual rows, down from `429` in the v128 checkpoint, and zero
automatic or pending-fresh work.

Current partial CJ counters from run #58:

* Notino: state `paused`, 48 steps, 4,662 received, 2,544 imported, 2,027
  excluded, 9,153 stored, 5,344 live, 54 review, 54 automatic and 0 pending
  fresh;
* Brasty: state `paused`, 48 steps, 4,800 received, 4,585 imported, 61
  excluded, 6,582 stored, 6,043 live, 154 review, 66 automatic and 0 pending
  fresh.

Final CJ counters from the preceding completed generation in run #53 attempt 8:

* Notino: state `completed`, 7,005 received, 3,945 imported, 2,869 excluded,
  9,153 stored, 5,344 live, 146 review, 0 automatic and 0 pending fresh;
* Brasty: state `completed`, 13,598 received, 12,799 imported, 323 excluded,
  6,582 stored, 6,043 live, 151 review, 0 automatic and 0 pending fresh.

At 01:43 UTC D1 directly confirmed the preceding generations as `completed`
with no remaining `sync_locks`. Run #58 later returned both new generations as
`paused` and `busy: false`; scheduled cycles can continue them. Flaconi remains
externally blocked by `orchestrator_feed_not_found` and must not be described
as active.

The latest full TradeDoubler snapshot in run #55 confirmed:

* Aelia: 8,508 provider/scanned products, 1,827 perfumes, 86 chunks and 1,234
  live offers;
* Cocolita: 27,815 provider/scanned products, 1,001 perfumes, 279 chunks and
  843 live offers;
* Drogeria.pl: 32,411 provider/scanned products, 1,244 perfumes, 325 chunks
  and 841 live offers.

Voucher production state is 4 received, 1 imported, 3 excluded and 1 active.
The three exclusions have the safe aggregate reason
`tracking_url_not_approved`. The active coupon is not silently applied to
prices; structured owner confirmation is still required before automatic
price use.

A direct production check after attempt 8 returned five consecutive HTTP 200
responses from `perfumetr.pl`; `beta.perfumetr.pl` also returned HTTP 200. The
ordinary five-day rotation is active and shows Yves Saint Laurent Libre
Flowers & Flames EDP 50 ml, Notino, 3 stores, 359.40 PLN total and 258.50 PLN
saving. The expired Stronger With You spotlight did not remain pinned and the
hero is neither empty nor stale. All three new cutout assets returned HTTP 200.

The v129 catalog direction and the three new cutouts are deployed but have not
yet received explicit visual acceptance from the user. Do not start another
broad catalog redesign without fresh user feedback.

Report `#007`, dated 2026-08-24, was sent to `support@perfumetr.pl` at
09:24 UTC and confirmed in Sent. It uses the permanent visual template and
inline Perfumetr logo from delivered report `#003`. Report `#007` is now the
latest confirmed delivered report.

There is no manual code edit, import, deployment or email delivery in progress
after the report-delivery pull request is merged. The automatic schedule will
continue the paused run #58 CJ generations. The next user-driven task is visual
feedback or safe manual/provider-assisted resolution after the new generations
finish. Do not weaken matching rules to reduce any review counter.

## Earlier Sites v128 production checkpoint retained for history

Verified at 2026-08-22 17:20 UTC. This checkpoint supersedes the lower dated
v123 evidence, which is retained only for history.

Repository and automation:

* repository: `GADOMM/Index`;
* verified `master` before continuity pull request `#22`:
  `8eab30aac9d9209c3d73a19cfcddaa08ed6787ce`;
* pull request `#20` is merged as
  `792657f3e91621efa6e450e8d98fa1200745a7d1`;
* pull request `#21` is merged as
  `8eab30aac9d9209c3d73a19cfcddaa08ed6787ce` and lets the GitHub
  orchestrator drain bounded CJ maintenance batches;
* pull request `#22` is the documentation-only continuity record for this
  checkpoint; verify its final CI and merge state directly;
* GitHub Actions run `#47`, database ID `32581506389`, attempt `15`,
  completed successfully; the production job ID is `97065393622`;
* the attempt-15 production job ran from 17:16:44 to 17:17:26 UTC, reported no
  HTTP 429 and no workflow error;
* the latest full TradeDoubler snapshot remains run `#28`, database ID
  `32497431067`, attempt `3`;
* GitHub Actions remains the only automatic scheduler.

Current Sites deployment:

* Sites version `128`;
* source commit `7f4943aac6d4256faccb2f62ebb50f9bf56589d5`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_54ab4c69fcac8191a673e5dccda17080`;
* deployment `appgdep_6a89d93b1f988191886c838226132d0f`;
* deployment status `succeeded`, directly rechecked after publication;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* production build passed, the full suite passed `47/47`, and lint has zero
  errors with three existing warnings;
* an independent read-only review found no data-safety blocker.

The catalog recovery was completed without manual product JSON and without
copying screenshot prices into the database:

1. exact complete GTINs are mapped only when the catalog match is unique;
2. fresh CJ product-ID queries replace stale queued price data before an offer
   is published;
3. completed imports detect legacy active products that have no live listing;
4. a bounded exact-GTIN coverage audit queries official CJ data for verified
   variants that already have a fresh offer in another verified store;
5. the GitHub orchestrator drains bounded maintenance work and stops on zero
   progress, cooldown, busy state, an error or the 48-step safety limit;
6. v128 converts unresolved fresh mapping or classification conflicts into
   explicit manual-review cases, so they no longer loop through the automatic
   queue; a later complete provider generation can still improve them.

Verified production result:

| Source | Live offers | Review | Automatic | Pending fresh |
| --- | ---: | ---: | ---: | ---: |
| Aelia.pl | 1,185 | bounded TradeDoubler proof | not applicable | not applicable |
| Cocolita | 830 | bounded TradeDoubler proof | not applicable | not applicable |
| Drogeria.pl | 835 | bounded TradeDoubler proof | not applicable | not applicable |
| Notino | 5,297 | 209 | 0 | 0 |
| Brasty | 6,041 | 220 | 0 | 0 |

The verified total is `14,188` live offers. During the recovery, the Notino
coverage backlog fell from `1,381` to `0` and Notino gained `701` live
offers, from `4,596` to `5,297`. The final attempt kept Notino at `5,297`
live offers and completed four maintenance operations that moved the last two
looping conflicts into true manual review. The remaining `209` Notino and
`220` Brasty review rows are not represented as safe automatic matches.

Final CJ counters from run #47 attempt 15:

* Notino: state `completed`, 7,005 received, 3,945 imported, 2,869 excluded,
  9,106 stored, 5,297 live, 209 review, 0 automatic and 0 pending fresh;
* Brasty: state `completed`, 13,598 received, 5,221 imported, 321 excluded,
  6,582 stored, 6,041 live, 220 review, 0 automatic and 0 pending fresh.

TradeDoubler proof in the same successful attempt confirmed Aelia `1,185`,
Cocolita `830` and Drogeria.pl `835` live offers. The `100 received`
values for Cocolita and Drogeria.pl remain bounded proof samples, not provider
feed sizes. Vouchers remain 4 received, 4 excluded, 0 imported and 0 active.

AWIN Flaconi remains externally blocked by
`orchestrator_feed_not_found`. Do not describe it as active.

A direct `perfumetr.pl` check after attempt 15 returned HTTP 200 and showed
the exact Stronger With You EDT 50 ml spotlight with Notino, 5 stores,
217.40 PLN total and 220.50 PLN saving. The price, merchant, store count,
delivery and saving remain dynamic D1 results. The screenshot price was not
hard-coded.

No email report was sent. Report `#006` remains the latest confirmed
delivered report. There is no code edit, import, deployment or email delivery
in progress. The exact next time-based task remains the read-only check after
2026-08-23 09:20 UTC that the temporary spotlight expired and the saved
five-day homepage rotation resumed without an empty or stale hero.

## Earlier production evidence retained for history

Repository: `GADOMM/Index`

Default branch: `master`

Repository baseline verified before continuity pull request `#19`:

* `master` commit `f741cb7c4198f7eeea98d13c05669c5a79b3cd88`;
* pull request `#12`: production importer release;
* pull request `#13`: verified importer production state;
* pull request `#14`: strict chat-continuity runbook;
* pull request `#15`: Sites v114 store-rail continuity record;
* pull request `#16`: Sites v120 catalog continuity record;
* pull request `#17`: Sites v121 minimal-catalog continuity record;
* pull request `#18`: report #006 and tester-feedback continuity record;
* pull request `#19`: documentation-only Sites v122 Stronger With You
  spotlight continuity record, merged as
  `5e06942de9d7df90a6a608e95ce608fd3234b47a`;
* pull request `#20`: documentation-only Sites v123 meaningful-savings
  continuity record; verify its current CI and merge state directly.

GitHub Actions evidence:

* latest Actions run before this metadata-only refresh: number `43`, database
  ID `32565560052`, attempt `1`, event `pull_request`, conclusion
  `success`;
* run 43 validated the importer successfully and skipped the production import
  job because it was pull-request documentation validation;
* latest scheduled production partner cycle is run number `41`, database ID
  `32563903356`, attempt `1`, conclusion `success`, from
  2026-08-22 09:03:07 UTC to 09:07:08 UTC;
* run 41 passed importer validation, skipped the full TradeDoubler snapshot and
  advanced bounded partner sources successfully;
* latest full production TradeDoubler importer remains run number `28`,
  database ID `32497431067`, attempt `3`, successful at
  2026-08-21 16:20 UTC;
* GitHub Actions remains the only automatic scheduler.

## Earlier Sites deployment retained for history

Sites v123 is deployed successfully:

* source commit `9333dfcbcb02bdb172908b2c9bb7191e369f3b9d`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_8168714f30308191bec15294142b87e9`;
* deployment `appgdep_6a89a78633c88191b681c5d81d89dda8`;
* deployment status `succeeded`, directly verified at
  2026-08-22 13:44 UTC;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports version `123` and `https://beta.perfumetr.pl` as the
  current live URL;
* the Sites project is active and public;
* `perfumetr.pl` and `beta.perfumetr.pl` retain active domain, provider
  and SSL state with no recorded error.

The v123 production build completed successfully. The full Sites test suite
passes `47/47`. Lint reports zero errors and three existing unused-variable
warnings. An independent read-only review found no blocking regression in the
meaningful-savings guard or its fallback.

A direct production HTTPS check at 2026-08-22 13:44 UTC returned Stronger With
You EDT 50 ml, Brasty, 4 stores and 239.74 PLN. The third hero metric now shows
`pojemność` and `50 ml`; it no longer advertises the negligible 0.08 PLN
difference as a saving.

No importer, database schema, source configuration, automatic schedule or
domain setting changed in v123.

## Earlier project area checkpoint retained for history

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | PR #19 merged as `5e06942...`; latest Actions run 43 succeeded; scheduled production run 41 succeeded; run 28 remains the latest full TradeDoubler import |
| Sites | v123 deployed successfully from `9333dfc...`; production build and 47/47 tests passed |
| Importer | TradeDoubler and CJ paths remain operational; v123 did not change importer code or schedules |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty have live offers; AWIN Flaconi remains externally blocked |
| Domains | `perfumetr.pl` and `beta.perfumetr.pl` report active provider and SSL state; Sites reports beta as the live URL |
| Homepage | v123 keeps the active Stronger With You spotlight and suppresses negligible savings; 0.08 PLN is replaced by the 50 ml volume metric |
| Beta landing page | Search, browse trigger, feedback prominence, metadata and responsive footer refinements remain deployed and unchanged in v122 |
| Catalog browser | The v121 transparent minimal catalog, flat filters, automatic price-capable volume selection and accessible interaction remain deployed |
| Store rail | Five store logos loop continuously, blend into the page on both ends and retain the compact mobile treatment |
| Store count | The dynamic coverage message remains separate from the logo rail and announces that more stores are coming |
| Integrations panel | Persisted read-only status model remains deployed; normal page interaction does not start imports |
| Reporting | Report #006 remains the latest confirmed delivered report; no report was sent for v122 |
| Human feedback | The beta has been shared with several people; their feedback may arrive and has not yet been triaged |

## Earlier verified importer results retained for history

| Source | State | Latest verified production result |
| --- | --- | --- |
| TradeDoubler Cocolita, Feed `112471` | active; not rerun in run 41 | run 28 proof: 100 received, 29 perfumes, 793 live offers |
| TradeDoubler Drogeria.pl, Feed `118359` | active; not rerun in run 41 | run 28 proof: 100 received, 25 perfumes, 814 live offers |
| TradeDoubler Aelia.pl, Feed `258031`, Program `397216` | active; not rerun in run 41 | run 28: 8,426 provider/scanned products, 1,799 perfumes, 85 chunks, 1,049 live offers |
| TradeDoubler vouchers | completed and fresh in run 41 | 4 received, 4 excluded, 0 imported, 0 active coupons |
| CJ Notino | completed in run 41 | 7,005 received, 3,776 imported, 445 review, 2,784 excluded, 8,291 stored products, 4,422 live offers |
| CJ Brasty | bounded generation paused as incomplete in run 41 | 9,540 received, 1,514 imported, 7,885 review, 141 excluded, 6,582 stored products, 1,092 live offers |
| AWIN Flaconi | externally blocked and retried automatically | `orchestrator_feed_not_found`; partner feed still requires external activation |

The latest verified total is `8,170` live offers: Aelia `1,049`,
Cocolita `793`, Drogeria.pl `814`, Notino `4,422` and Brasty `1,092`.

Run 41 did not execute a new TradeDoubler product snapshot, so the three
TradeDoubler counts remain verified run 28 results. The `100 received` values
for Cocolita and Drogeria.pl are bounded proof samples, not full provider-feed
sizes.

Brasty's run 41 generation is not complete and must not be described as a
completed refresh. Its `1,092` live offers are the latest counters reported by
production. The bounded orchestrator will continue the source in a later
scheduled cycle. This paused state did not fail the overall workflow.

A blocked source does not stop successful TradeDoubler or CJ sources. Scheduled
cycles retry the AWIN blocker automatically after the feed becomes available.

## Automatic schedule

Partner sources run at 02:47, 08:47, 14:17 and 20:47 UTC. The full TradeDoubler
snapshot runs at 14:17 UTC. GitHub may start a scheduled run later than the
configured minute. Source-level isolation prevents one unavailable partner from
blocking the remaining stores.

## Sites v123 meaningful-savings guard

The user reported that the homepage hero showed `oszczędzasz 0,08 zł · −0%`,
which made the offer look unreliable.

Completed behavior:

1. the homepage labels a value as `oszczędzasz` only when the saving is at
   least 5 PLN and at least 2%;
2. smaller or zero-value differences fall back to the existing `pojemność`
   metric and the live bottle volume;
3. the current Stronger With You spotlight therefore shows `pojemność` and
   `50 ml` instead of `0,08 zł · −0%`;
4. meaningful discounts such as the tested 200 PLN and 40% fixture remain
   visible;
5. price, merchant, store count, delivery and coupon effects remain dynamic;
6. no catalog, importer, schedule, database or domain behavior changed.

Verification:

* production build: passed;
* full automated suite: `47/47`;
* targeted negligible-saving regression test: passed;
* lint: zero errors, three existing warnings;
* independent read-only logic review: no blocker;
* deployment v123: directly confirmed `succeeded`;
* direct `perfumetr.pl` check: HTTP 200 and the expected `pojemność 50 ml`
  metric, with no visible `oszczędzasz 0,08 zł`.

## Sites v122 Stronger With You spotlight

The user requested one targeted homepage change and no unrelated visual work.

Completed behavior:

1. the submitted screenshot was used only to identify Emporio Armani Stronger
   With You EDT 50 ml, GTIN `3605522040281`;
2. the homepage asset contains only the recognisable bottle on a transparent
   background, without the box, phone interface or screenshot background;
3. the spotlight is active from `2026-08-22T09:20:00.000Z` through
   `2026-08-23T09:20:00.000Z`, which is 11:20 to 11:20 in Poland;
4. the current D1 catalog supplies the price, merchant, offer count, delivery
   cost and coupon effects dynamically; the screenshot price is not hard-coded;
   a direct production HTTPS check at 2026-08-22 09:44 UTC returned Brasty,
   4 stores and 239.74 PLN for this 50 ml EDT variant; this is point-in-time
   evidence and remains subject to the live D1 data;
5. the normal saved five-day rotation is not overwritten;
6. after the interval expires, the normal rotation resumes automatically
   without another deployment;
7. if this exact live variant becomes unavailable during the interval, the
   homepage safely falls back to the normal rotation.

Verification:

* production build: passed;
* full automated suite: `47/47`;
* lint: zero errors, three existing warnings;
* independent spotlight-logic review: no blocker;
* independent transparent-asset review: no blocker;
* deployment v122: directly confirmed `succeeded`.

No browser preview was run because the user asked for a focused deployment and
the Sites workflow did not require a subjective re-review of unrelated areas.

## Earlier visual work retained

The v114-v122 homepage, beta landing, catalog and spotlight refinements remain part of the
current build. They include the continuously looping store rail, separate
store-count message, browse trigger, refreshed search, prominent feedback
action, responsive footer and minimal transparent catalog. v123 did not rebuild
or reverse those areas.

## Integrations panel

The panel reads persisted source status and refreshes lightweight status views.
It does not start normal imports during page interaction. AWIN reports the
external feed-activation blocker, while CJ reports the latest persisted importer
state.

Emergency authenticated import routes remain available for controlled recovery,
but the panel is not a second scheduler. Manual coupon confirmation remains a
separate guarded operation.

## Deployment reports

Report `#007`, dated 2026-08-24, is the latest confirmed delivered message to
`support@perfumetr.pl`. Delivery was confirmed in Sent. It uses the exact visual
template, wordmark, layout, typography, inline Perfumetr logo and footer from
delivered report `#003`.

No separate report was sent for v122 or v123. The later work was consolidated
in report `#007`, following the user's end-of-day reporting instruction.

Current reporting instruction:

1. do not send a report automatically after each visual deployment;
2. wait until the user explicitly requests the consolidated report;
3. before writing it, retrieve delivered report `#003` from Sent and reproduce
   its exact visual template, wordmark, layout, typography and footer;
4. recheck the latest delivered report number immediately before assigning the
   next sequential number;
5. after confirmed report `#007`, the next number is `#008` only if the
   mailbox check still confirms that sequence.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## Earlier operational handoff retained for history

No code change, import, Sites deployment or email delivery is currently in
progress. The last production change is Sites v123, deployed from source commit
`9333dfcbcb02bdb172908b2c9bb7191e369f3b9d`. It hides the negligible
0.08 PLN homepage saving and shows the current 50 ml volume instead. The
production build passed, the full suite passed `47/47`, lint has zero errors
and three existing warnings, and the deployment was directly confirmed
`succeeded`.

Pull request `#20` is the documentation-only continuity record for this
checkpoint. Its current merge and CI state must be verified directly before a
future change.

The exact next task remains to verify, after 2026-08-23 09:20 UTC, that the
normal five-day homepage rotation resumed. Before then, respond only to
concrete tester feedback or the user's next targeted visual request; do not
proactively alter unrelated interface areas.

## Known risks and blockers

1. AWIN Flaconi cannot import until the external feed is approved and exposed to
   the server importer.
2. Full TradeDoubler snapshots are parsed in memory after download.
3. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
4. A future provider schema change may require a new bounded adapter or source
   profile.
5. Sites reports `beta.perfumetr.pl` as the current live URL even though both
   custom domains are active.
6. Beta tester feedback is expected but has not yet been triaged.

## Chat continuity

The repository is the durable project memory. Keep this file and
`docs/CHAT_CONTINUITY.md` current after every important deployment. When the
user says that the chat is lagging, asks to change chats or requests a message
for the next chat, immediately prepare one complete paste-ready handoff. Do not
ask the user to summarize the conversation.

The receiving chat must first read `AGENTS.md`, `PROJECT_STATE.md`,
`docs/ARCHITECTURE.md` and `docs/CHAT_CONTINUITY.md`. It must verify GitHub
and Sites directly and must not change code, imports, configuration or
production before that verification.

## Do not claim

Do not advertise a saving below 5 PLN or 2% in the homepage hero. Do not claim that AWIN Flaconi is active while its state remains
`orchestrator_feed_not_found`. Do not describe Brasty run 41 as a completed
refresh. Do not describe run 41 as a full TradeDoubler import. Do not claim that
the screenshot price is fixed on the homepage. Do not claim that any deployment
report after confirmed report `#007` was sent.
