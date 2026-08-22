# Perfumetr project state

Updated: 2026-08-22 09:38 UTC

This file contains no credentials. Verify every external status again before a
new change, import, deployment or report.

## Current production evidence

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
  spotlight continuity record.

GitHub Actions evidence:

* latest workflow run before continuity PR #19: number `41`, database ID
  `32563903356`, attempt `1`, event `schedule`, conclusion `success`;
* run 41 ran from 2026-08-22 09:03:07 UTC to 09:07:08 UTC;
* importer validation passed, the full TradeDoubler snapshot was skipped, and
  the bounded partner-source orchestrator completed successfully;
* latest full production TradeDoubler importer remains run number `28`,
  database ID `32497431067`, attempt `3`, successful at
  2026-08-21 16:20 UTC;
* GitHub Actions remains the only automatic scheduler.

## Current Sites deployment

Sites v122 is deployed successfully:

* source commit `11e1639fe7a8e1f3d95802c3ecd22f07de3802f1`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_0439d4ebf1308191abc69eb241a03494`;
* deployment `appgdep_6a896c851c308191bed86741aaf78c4b`;
* deployment status `succeeded`, directly verified at
  2026-08-22 09:32 UTC;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports version `122` and `https://beta.perfumetr.pl` as the
  current live URL;
* the Sites project is active and public;
* `perfumetr.pl` and `beta.perfumetr.pl` were directly rechecked at this
  checkpoint and both report active domain, provider and SSL state with no
  recorded error.

The v122 production build completed successfully. The full Sites test suite
passes `47/47`. Lint reports zero errors and three existing unused-variable
warnings. Two independent read-only reviews found no blocking regression in
the spotlight logic or the transparent bottle asset.

No importer, database schema, source configuration, automatic schedule or
domain setting changed in v122.

## Project area checkpoint

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | `master` baseline `f741cb7...`; scheduled run 41 succeeded; run 28 remains the latest full TradeDoubler import |
| Sites | v122 deployed successfully from `11e1639...`; production build and 47/47 tests passed |
| Importer | TradeDoubler and CJ paths remain operational; v122 did not change importer code or schedules |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty have live offers; AWIN Flaconi remains externally blocked |
| Domains | `perfumetr.pl` and `beta.perfumetr.pl` report active provider and SSL state; Sites reports beta as the live URL |
| Homepage | v122 temporarily spotlights Emporio Armani Stronger With You EDT 50 ml for exactly 24 hours; its commercial data remains dynamic |
| Beta landing page | Search, browse trigger, feedback prominence, metadata and responsive footer refinements remain deployed and unchanged in v122 |
| Catalog browser | The v121 transparent minimal catalog, flat filters, automatic price-capable volume selection and accessible interaction remain deployed |
| Store rail | Five store logos loop continuously, blend into the page on both ends and retain the compact mobile treatment |
| Store count | The dynamic coverage message remains separate from the logo rail and announces that more stores are coming |
| Integrations panel | Persisted read-only status model remains deployed; normal page interaction does not start imports |
| Reporting | Report #006 remains the latest confirmed delivered report; no report was sent for v122 |
| Human feedback | The beta has been shared with several people; their feedback may arrive and has not yet been triaged |

## Verified importer results

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

The v114-v121 homepage, beta landing and catalog refinements remain part of the
current build. They include the continuously looping store rail, separate
store-count message, browse trigger, refreshed search, prominent feedback
action, responsive footer and minimal transparent catalog. v122 did not rebuild
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

Report `#006`, dated 2026-08-22, remains the latest confirmed delivered message
to `support@perfumetr.pl`. It uses the exact visual template, wordmark, layout,
typography, inline Perfumetr logo and footer from delivered report `#003`.

No report was sent for v122. The user instructed that visual deployments should
be consolidated and reported only after an explicit end-of-day request.

Current reporting instruction:

1. do not send a report automatically after each visual deployment;
2. wait until the user explicitly requests the consolidated report;
3. before writing it, retrieve delivered report `#003` from Sent and reproduce
   its exact visual template, wordmark, layout, typography and footer;
4. recheck the latest delivered report number immediately before assigning the
   next sequential number;
5. after confirmed report `#006`, the next number is `#007` only if the
   mailbox check still confirms that sequence.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## Current operational handoff

No code change, import, Sites deployment or email delivery is currently in
progress. The last production change is the v122 Stronger With You spotlight,
deployed from source commit
`11e1639fe7a8e1f3d95802c3ecd22f07de3802f1`, with a successful production
build, `47/47` tests and a directly confirmed `succeeded` deployment.
Pull request `#19` is the documentation-only continuity record for this
checkpoint.

The exact next task is to verify, after 2026-08-23 09:20 UTC, that the normal
five-day homepage rotation resumed. Before then, respond only to concrete tester
feedback or the user's next targeted visual request; do not proactively alter
unrelated interface areas.

## Known risks and blockers

1. AWIN Flaconi cannot import until the external feed is approved and exposed to
   the server importer.
2. Brasty's latest bounded generation paused incomplete in run 41 and should be
   allowed to continue in later scheduled cycles.
3. Full TradeDoubler snapshots are parsed in memory after download.
4. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
5. A future provider schema change may require a new bounded adapter or source
   profile.
6. Sites reports `beta.perfumetr.pl` as the current live URL even though both
   custom domains are active.
7. Beta tester feedback is expected but has not yet been triaged.

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

Do not claim that AWIN Flaconi is active while its state remains
`orchestrator_feed_not_found`. Do not describe Brasty run 41 as a completed
refresh. Do not describe run 41 as a full TradeDoubler import. Do not claim that
the screenshot price is fixed on the homepage. Do not claim that any deployment
report after confirmed report `#006` was sent.
