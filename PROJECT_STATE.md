# Perfumetr project state

Updated: 2026-08-21 23:08 UTC

This file contains no credentials. Verify every external status again before a
new change, import, deployment or report.

## Current production evidence

Repository: `GADOMM/Index`

Default branch: `master`

Repository baseline verified immediately before this continuity branch:

* `master` commit `15cdffc860d319bc82705ea903e3127b2145c985`;
* merged pull request `#12`: production importer release;
* merged pull request `#13`: verified importer production state;
* merged pull request `#14`: strict chat-continuity runbook;
* merged pull request `#15`: Sites v114 store-rail continuity record;
* this v120 continuity update is documentation only and does not change the
  importer, catalog data or production runtime.

GitHub Actions evidence:

* latest workflow run: number `32`, database ID `32527917523`, attempt `1`,
  event `pull_request`, success from 2026-08-21 21:18:57 UTC to 21:19:07 UTC;
* run 32 validated the importer and skipped the import job because it was a
  pull-request documentation validation;
* latest scheduled production partner cycle remains run number `31`, database
  ID `32526426619`, attempt `1`, success from 2026-08-21 21:00:42 UTC to
  21:01:08 UTC;
* run 31 passed importer validation `14/14`, ran partner sources and skipped the
  full TradeDoubler product snapshot;
* latest full production importer remains run number `28`, database ID
  `32497431067`, attempt `3`, success at 2026-08-21 16:20 UTC;
* GitHub Actions is the only automatic scheduler.

Sites v120 is deployed successfully:

* source commit `4302d9133a5cc99eec4d4f5da7e3358108561b60`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_e30e538bc74081918bfdc3fa5c7c8706`;
* deployment `appgdep_6a88d9d0cd048191b6ff07192ccbeef4`;
* deployment status `succeeded`, directly rechecked at 2026-08-21 23:07 UTC;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports `https://beta.perfumetr.pl` as the current live URL;
* the Sites project is active and public;
* both `perfumetr.pl` and `beta.perfumetr.pl` report active domain, provider
  and SSL status with no recorded domain error.

The v120 production build completed successfully. The full Sites test suite
passes `47/47`. Lint reports zero errors and two pre-existing unused-variable
warnings in `tests/rendered-html.test.mjs`.

## Project area checkpoint

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | `master` baseline `15cdffc...`; run 32 succeeded; run 31 remains the latest scheduled partner import and run 28 the latest full TradeDoubler import |
| Sites | v120 deployed successfully from `4302d913...`; production build and 47/47 tests passed |
| Importer | TradeDoubler and CJ sources remain operational; no importer code or data changed in v120 |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty active; AWIN Flaconi externally blocked |
| Domains | `perfumetr.pl` and `beta.perfumetr.pl` have active provider and SSL status; Sites reports beta as the live URL |
| Homepage | Latest compact layout and footer refinements remain deployed; no homepage change was made in v120 |
| Beta landing page | Refined browse trigger, search treatment, feedback prominence, metadata placement and responsive footer from the v115-v119 visual iterations remain deployed |
| Catalog browser | v120 Catalog Canvas redesign deployed: centered desktop canvas, full-screen mobile layout, simplified navigation, searchable brand selection, radio-based refinements, active chips, clean product cards and integrated detail view |
| Store rail | Five active store logos loop continuously, blend into the page on both ends and use the compact mobile treatment |
| Store count | Dynamic coverage message remains outside the logo rail and says more stores are coming |
| Integrations panel | Persisted read-only status model remains deployed; normal imports do not start from page interaction |
| Reporting | Last confirmed delivered report is #005; reports are now consolidated and sent only when the user explicitly requests one; v120 report was not sent |
| Human visual verification | Automated and build verification are complete; subjective inspection of v120 on the user's real phone and desktop remains pending |

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
snapshot, so the three TradeDoubler counts remain the verified result of run 28.
The `100 received` values for Cocolita and Drogeria.pl are bounded proof samples,
not the size of either full provider feed.

A blocked source does not stop successful TradeDoubler or CJ sources. Scheduled
cycles retry the AWIN blocker automatically after the feed becomes available.

## Automatic schedule

Partner sources run at 02:47, 08:47, 14:17 and 20:47 UTC. The full TradeDoubler
snapshot runs at 14:17 UTC. GitHub may start a scheduled run later than the
configured minute. Source-level isolation prevents one unavailable partner from
blocking the remaining stores.

## Sites v120 catalog redesign

The user requested a clean, unusually intuitive catalog experience without
adding unnecessary options. v120 changes only the catalog presentation,
interaction flow and related tests. It does not change the importer, database
schema, offer counts, source configuration, schedules or external integrations.

Completed changes:

1. the right-side desktop drawer became a centered, wide Catalog Canvas while
   mobile remains a full-screen experience;
2. the catalog heading and navigation now use one calmer visual hierarchy;
3. the unexplained `⌁` symbol and permanent native sort select were removed;
4. audience remains the only always-visible segmentation;
5. the long native brand select was replaced by a searchable brand picker with
   suggestions, diacritic-insensitive matching and an explicit validation
   message for ambiguous input;
6. concentration, volume and sort use accessible radio groups with keyboard
   navigation instead of generic selects;
7. draft filters remain separate from applied filters, active chips stay
   visible and chip removal is synchronized with an open draft;
8. the misleading count of only loaded cards was removed;
9. product cards use a light editorial image stage, a simpler metadata
   hierarchy and three desktop columns instead of four compressed columns;
10. the detail back action was integrated into the main header;
11. the first price-capable volume is selected automatically and its price is
    checked immediately, removing a manual step;
12. focus restoration, scroll restoration, request cancellation, error states,
    reduced-motion behavior and safe mobile-area padding remain intact;
13. mobile touch targets for navigation, chips, brand suggestions and refinement
    choices are at least 44 px.

Verification:

* production build: passed;
* full automated suite: `47/47`;
* lint: zero errors, two pre-existing warnings;
* independent read-only regression review completed;
* deployment v120: `succeeded`.

The Sites skill did not authorize a cloud-browser preview in this task, so no
claim is made that subjective appearance or every real-device interaction has
been visually approved. The next verification is the user's real-device review.

## Earlier visual iterations retained in v120

The visual iterations between v114 and v119 remain part of the current build.
They refined only the homepage, beta landing page, logo rail, browse trigger,
search presentation, feedback prominence, metadata placement, footer spacing
and mobile/desktop viewport fit. v120 did not rebuild or reverse those areas.

Current intended behavior:

1. the logo rail loops continuously on desktop and phone, has no rounded outer
   container and blends into the page background at both ends;
2. the coverage message is separate from the rail and announces that more stores
   are coming;
3. the beta landing page removes unnecessary perfume totals and the old beta
   index label while retaining the brand count;
4. the feedback action is visually prominent;
5. the beta footer does not repeat the Perfumetr logo already shown in the
   header;
6. desktop content fits without the earlier large empty lower area;
7. the latest mobile footer position is lower while preserving the compact
   single-screen presentation.

## Integrations panel

The panel reads persisted source status and refreshes lightweight status views
automatically. It does not start normal imports during page interaction. The
obsolete TradeDoubler PRODUCTS probe remains removed. AWIN clearly reports the
feed activation blocker, while CJ reports the latest persisted importer state.

Emergency authenticated backend import routes remain available for controlled
recovery, but the panel is not a second scheduler. Manual coupon confirmation
remains a separate guarded operation.

## Deployment reports

Report `#005`, dated 2026-08-21, is the last confirmed delivered message to
`support@perfumetr.pl`. It was sent at 21:13 UTC and Gmail confirmed it in
Sent.

The user later corrected the reporting workflow:

1. do not send a report automatically after every visual deployment;
2. wait until the user explicitly requests the consolidated report, normally
   after the workday;
3. before writing it, retrieve report `#003` from Sent and reproduce that exact
   visual template, logo treatment, layout, typography and footer;
4. do not invent a new email design;
5. recheck the last delivered report number immediately before assigning the
   next one.

No report was sent for v120. Its delivery state is `deferred at the user's
request`. If the user asks for the next report, verify the mailbox first; if
`#005` is still latest, the next number is `#006`.

Required footer:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## Current operational handoff

No code change, import, Sites deployment or email delivery is currently in
progress. The last completed production work is the v120 catalog-browser
redesign deployed from Sites source commit
`4302d9133a5cc99eec4d4f5da7e3358108561b60`, with a successful production
build and `47/47` tests.

The exact next task is the user's visual and interaction review of v120 on
`beta.perfumetr.pl`, first on desktop and then on a real phone. The review
should cover opening the catalog, audience switching, brand search, each
refinement group, active-chip removal, product-card scanning, automatic initial
volume pricing and returning to the same card. Make only the specific visual or
interaction refinements the user requests after that review.

## Known risks and blockers

1. AWIN Flaconi cannot import until the external feed is approved and exposed to
   the server importer.
2. Full TradeDoubler snapshots are still parsed in memory after download.
3. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
4. A future provider schema change may require a new bounded adapter or source
   profile.
5. Sites reports `beta.perfumetr.pl` as the current live URL even though both
   custom domains have active provider and SSL status.
6. v120 passed technical verification, but its subjective appearance and full
   interaction flow on the user's physical devices remain pending.

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
`orchestrator_feed_not_found`. Do not invent Aelia review or excluded counters.
Do not describe run 31 as a full TradeDoubler import. Do not describe subjective
desktop or mobile visual approval as completed before the user confirms it. Do
not claim that a v120 email report was sent.
