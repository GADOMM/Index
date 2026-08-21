# Perfumetr project state

Updated: 2026-08-21 23:31 UTC

This file contains no credentials. Verify every external status again before a
new change, import, deployment or report.

## Current production evidence

Repository: `GADOMM/Index`

Default branch: `master`

Repository baseline verified before this continuity branch:

* `master` commit `05bb754f70526314d0c301fea6e27878fe8aeb4e`;
* merged pull request `#12`: production importer release;
* merged pull request `#13`: verified importer production state;
* merged pull request `#14`: strict chat-continuity runbook;
* merged pull request `#15`: Sites v114 store-rail continuity record;
* merged pull request `#16`: Sites v120 catalog continuity record;
* this v121 continuity update is documentation only and does not change the
  importer, catalog data or production runtime.

GitHub Actions evidence:

* latest workflow run before this continuity branch: number `33`, database ID
  `32535949248`, attempt `1`, event `pull_request`, succeeded from
  2026-08-21 23:11:27 UTC to 23:11:40 UTC;
* run 33 validated the importer successfully and skipped the import job because
  it was pull-request documentation validation;
* latest scheduled production partner cycle remains run number `31`, database
  ID `32526426619`, attempt `1`, success from 2026-08-21 21:00:42 UTC to
  21:01:08 UTC;
* run 31 passed importer validation `14/14`, advanced partner sources and
  skipped the full TradeDoubler product snapshot;
* latest full production importer remains run number `28`, database ID
  `32497431067`, attempt `3`, successful at 2026-08-21 16:20 UTC;
* GitHub Actions is the only automatic scheduler.

Sites v121 is deployed successfully:

* source commit `8e41f34be3ec5fe390e287c959ae0c16d552f2f0`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_946ac9bc18f48191b469baae459a807b`;
* deployment `appgdep_6a88df699204819198a3982e8045bad2`;
* deployment status `succeeded`, directly rechecked at 2026-08-21 23:30 UTC;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports version `121` and `https://beta.perfumetr.pl` as the current
  live URL;
* the Sites project is active and public;
* `perfumetr.pl` and `beta.perfumetr.pl` last reported active provider and
  SSL state at the preceding checkpoint; v121 did not change domain settings.

The v121 production build completed successfully. The full Sites test suite
passes `47/47`. Lint reports zero errors and two pre-existing unused-variable
warnings in `tests/rendered-html.test.mjs`. Two independent read-only reviews
found no blocking regression.

## Project area checkpoint

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | `master` baseline `05bb754...`; run 33 succeeded; run 31 remains the latest scheduled partner import and run 28 the latest full TradeDoubler import |
| Sites | v121 deployed successfully from `8e41f34...`; production build and 47/47 tests passed |
| Importer | TradeDoubler and CJ sources remain operational; no importer code, schedule or data changed in v121 |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty active; AWIN Flaconi externally blocked |
| Domains | Sites reports `beta.perfumetr.pl` as the live URL; both custom domains were last confirmed active with provider and SSL and were not reconfigured in v121 |
| Homepage | The compact homepage, footer and store-rail refinements remain deployed; v121 did not change them |
| Beta landing page | The browse trigger, search, feedback prominence, metadata and responsive footer refinements remain deployed; v121 changed only the opened catalog |
| Catalog browser | v121 transparent minimal catalog layer deployed: one title, one control rail, flat filters, on-demand brand suggestions and cardless product presentation |
| Store rail | Five active store logos loop continuously, blend into the page on both ends and use the compact mobile treatment |
| Store count | Dynamic coverage message remains outside the logo rail and states that more stores are coming |
| Integrations panel | Persisted read-only status model remains deployed; page interaction does not start normal imports |
| Reporting | Last confirmed delivered report is #005; reports are consolidated and sent only when the user explicitly requests one; no v120 or v121 report was sent |
| Human visual verification | Automated and production deployment verification are complete; the user's subjective review of v121 on real phone and desktop is pending |

## Verified importer results

| Source | State | Latest verified production result |
| --- | --- | --- |
| TradeDoubler Cocolita, Feed `112471` | active; not rerun in run 31 | run 28 proof: 100 received, 29 perfumes, 793 live offers |
| TradeDoubler Drogeria.pl, Feed `118359` | active; not rerun in run 31 | run 28 proof: 100 received, 25 perfumes, 814 live offers |
| TradeDoubler Aelia.pl, Feed `258031`, Program `397216` | full import completed in run 28 | 8,426 provider and scanned products, 1,799 perfumes, 85 chunks, 1,049 imported and live offers |
| TradeDoubler vouchers | completed and fresh in run 31 | 4 received, 4 excluded, 0 imported, 0 active coupons |
| CJ Notino | completed and fresh in run 31 | 7,005 received, 3,776 imported, 445 review, 2,784 excluded, 8,291 stored products, 4,422 live offers |
| CJ Brasty | completed and fresh in run 31 | 13,598 received, 1,982 imported, 11,324 review, 292 excluded, 6,582 stored products, 899 live offers |
| AWIN Flaconi | externally blocked and retried automatically | `orchestrator_feed_not_found`; the partner feed still requires external activation |

The latest verified total remains `7,977` live offers: Aelia `1,049`,
Cocolita `793`, Drogeria.pl `814`, Notino `4,422` and Brasty `899`.
Run 31 reconfirmed the CJ counts and did not execute a new TradeDoubler product
snapshot, so the three TradeDoubler counts remain the verified run 28 results.
The `100 received` values for Cocolita and Drogeria.pl are bounded proof
samples, not the full provider-feed sizes.

A blocked source does not stop successful TradeDoubler or CJ sources. Scheduled
cycles retry the AWIN blocker automatically after the feed becomes available.

## Automatic schedule

Partner sources run at 02:47, 08:47, 14:17 and 20:47 UTC. The full TradeDoubler
snapshot runs at 14:17 UTC. GitHub may start a scheduled run later than the
configured minute. Source-level isolation prevents one unavailable partner from
blocking the remaining stores.

## Sites v121 minimal catalog refinement

The user rejected the v120 catalog treatment as too busy and too heavily
designed. v121 changes only catalog presentation, responsive styling and the
related rendering tests. It does not change API behavior, the importer, database
schema, offer counts, source configuration, schedules or external integrations.

Completed changes:

1. the centered cream Catalog Canvas became a full-viewport transparent dark
   layer that lets the beta background remain visible;
2. the catalog header now contains only `Przeglądaj perfumy`, back when needed
   and close;
3. the permanent control area contains only audience categories and an obvious
   `Filtry` action;
4. the decorative filter icon, helper headings, slogans, nested cream panels and
   separate result heading were removed;
5. the brand picker is empty until the user types; suggestions appear only for a
   query and close after a brand is selected;
6. concentration, volume and order remain accessible radio groups, but they now
   sit on one flat translucent surface;
7. active filters remain removable and a compact clear action is retained;
8. audience badges and repeated `Zobacz ceny` calls were removed from product
   cards;
9. product cards have no permanent border, filled card background or shadow;
   bottle images sit over a soft transparent radial glow;
10. the desktop grid returns to four lighter product columns; mobile retains two
    columns and at least 44 px interactive filter targets;
11. the product detail view also loses its heavy split-panel frame while
    preserving volume selection, automatic price lookup and comparison;
12. mobile blur was reduced for weaker devices, and touch cards receive a
    lightweight active-state response without adding visual clutter.

Preserved behavior:

* the first price-capable volume is selected and checked automatically;
* diacritic-insensitive brand matching and ambiguous-input validation;
* draft/applied filter separation and synchronized filter removal;
* request cancellation, focus restoration, scroll restoration and error states;
* reduced-motion behavior and mobile safe-area padding;
* complete keyboard radio semantics and visible focus states.

Verification:

* production build: passed;
* focused catalog tests: `2/2`;
* full automated suite: `47/47`;
* lint: zero errors, two pre-existing warnings;
* two independent read-only reviews: no blocking regression;
* deployment v121: `succeeded`.

The Sites workflow did not authorize a cloud-browser preview. The user must still
judge the subjective appearance and interaction on the real desktop and phone.
This is pending visual approval, not a known production failure.

## Earlier visual work retained in v121

The v114-v119 homepage and beta refinements remain part of the current build.
They cover the logo rail, separate store-count message, browse trigger, search
presentation, feedback prominence, metadata placement, footer spacing and
single-viewport mobile/desktop fit. v121 did not rebuild or reverse those areas.

Current intended behavior:

1. the logo rail loops continuously on desktop and phone, has no rounded outer
   container and blends into the page background at both ends;
2. the coverage message is separate from the rail and announces that more stores
   are coming;
3. the beta landing page omits unnecessary perfume totals and the old beta index
   label while retaining the brand count;
4. the feedback action remains visually prominent;
5. the beta footer does not repeat the Perfumetr logo already shown in the
   header;
6. desktop and mobile landing content retain the latest compact viewport fit.

## Integrations panel

The panel reads persisted source status and refreshes lightweight status views
automatically. It does not start normal imports during page interaction. AWIN
reports the external feed-activation blocker, while CJ reports the latest
persisted importer state.

Emergency authenticated backend import routes remain available for controlled
recovery, but the panel is not a second scheduler. Manual coupon confirmation
remains a separate guarded operation.

## Deployment reports

Report `#005`, dated 2026-08-21, is the last confirmed delivered message to
`support@perfumetr.pl`. It was sent at 21:13 UTC and confirmed in Sent at the
previous checkpoint.

Current user instruction:

1. do not send a report automatically after each visual deployment;
2. wait until the user explicitly requests the consolidated report, normally
   after the workday;
3. before writing it, retrieve delivered report `#003` from Sent and reproduce
   that exact visual template, wordmark, layout, typography and footer;
4. do not invent a new email design;
5. recheck the latest delivered report number immediately before assigning the
   next sequential number.

No report was sent for v120 or v121. Delivery is `deferred at the user's
request`. If the user requests the next report, verify Sent first; if `#005`
is still latest, the next number is `#006`.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## Current operational handoff

No code change, import, Sites deployment or email delivery is currently in
progress. The last completed production work is the v121 minimal catalog
refinement deployed from Sites source commit
`8e41f34be3ec5fe390e287c959ae0c16d552f2f0`, with a successful production
build, `47/47` tests and a directly confirmed `succeeded` deployment.

The exact next task is the user's visual and interaction review of v121 on
`beta.perfumetr.pl`, first on desktop and then on a real phone. Review the
transparent background, control density, category rail, filter clarity,
on-demand brand suggestions, product scanning, detail view and touch response.
Make only the specific catalog refinements the user requests after that review.

## Known risks and blockers

1. AWIN Flaconi cannot import until the external feed is approved and exposed to
   the server importer.
2. Full TradeDoubler snapshots are still parsed in memory after download.
3. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
4. A future provider schema change may require a new bounded adapter or source
   profile.
5. Sites reports `beta.perfumetr.pl` as the current live URL even though both
   custom domains were last confirmed active.
6. v121 passed technical verification but has not yet received the user's
   subjective approval on physical desktop and mobile devices.

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
`orchestrator_feed_not_found`. Do not invent Aelia review or excluded
counters. Do not describe run 31 as a full TradeDoubler import. Do not claim
that v121 has subjective desktop or mobile approval before the user confirms
it. Do not claim that a v120 or v121 email report was sent.
