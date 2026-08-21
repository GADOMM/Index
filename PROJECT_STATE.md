# Perfumetr project state

Updated: 2026-08-21 21:16 UTC

This file contains no credentials. Verify every external status again before a
new deployment or report.

## Current production evidence

Repository: `GADOMM/Index`

Default branch: `master`

Repository baseline verified immediately before this continuity update:

* `master` commit `2013b37e4e3d3d7c21d0fa259dd80dd9e48eddfe`;
* merged pull request `#12`: importer release;
* merged pull request `#13`: verified production state and durable handoff;
* merged pull request `#14`: strict chat-continuity and deployment-report rules;
* no pull request was open before this continuity branch was created.

GitHub Actions evidence:

* latest workflow run: number `31`, database ID `32526426619`, attempt `1`,
  event `schedule`, success from 2026-08-21 21:00:42 UTC to 21:01:08 UTC;
* run 31 validated the importer with `14/14` tests and executed only the
  partner-source orchestrator; the full TradeDoubler product import was skipped;
* latest full production importer workflow remains run number `28`, database ID
  `32497431067`, attempt `3`, success at 2026-08-21 16:20 UTC;
* GitHub Actions is the only automatic scheduler.

Sites v114 is deployed successfully:

* source commit `8b336271e686dc72bafc9d6ee8872c329e7378ed`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_939b330cebc08191b015140731063b17`;
* deployment `appgdep_6a88bed270388191a99b8e7e185865f7`;
* deployment status `succeeded` at 2026-08-21 21:11 UTC;
* provider URL `https://perfumetr.borodzicz85.chatgpt.site`;
* Sites reports `https://beta.perfumetr.pl` as the current live URL;
* both `perfumetr.pl` and `beta.perfumetr.pl` have active domain, provider and
  SSL status with no recorded domain error.

Site tests pass: `44/44`. Lint has zero errors and three pre-existing unused
variable warnings. A post-deployment Sites worker-log query found zero error
events in the first 30 minutes.

## Project area checkpoint

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | `master` baseline `2013b37...` verified; run 31 succeeded; run 28 remains the latest full importer run |
| Sites | v114 deployed successfully from `8b336271...`; 44 of 44 tests passed |
| Importer | TradeDoubler and CJ sources remain operational; one unavailable source does not block the others |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty active; AWIN Flaconi externally blocked |
| Domains | `perfumetr.pl` and `beta.perfumetr.pl` have active provider and SSL status; Sites still reports beta as the live URL |
| Homepage | v114 store-rail styling is deployed; final human visual review on a physical phone is still pending |
| Beta | the same v114 store-rail and coverage message are deployed; final human visual review is still pending |
| Store rail | modern glass container, individual logo capsules, fade on both ends, 40 px mobile height and reduced-motion handling are deployed |
| Store count | dynamic count moved outside the rail and now says that more stores are coming soon |
| Integrations panel | persisted status model remains deployed; no normal import starts from page interaction |
| Reporting | deployment report `#005` sent to `support@perfumetr.pl` at 2026-08-21 21:13 UTC |

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

The latest verified total remains `7,977` live offers: Aelia `1,049`, Cocolita
`793`, Drogeria.pl `814`, Notino `4,422` and Brasty `899`. Run 31 reconfirmed
the CJ counts and did not execute a new TradeDoubler product snapshot, so the
three TradeDoubler counts remain the verified result of run 28. The `100
received` values for Cocolita and Drogeria.pl are bounded proof samples, not the
size of either full provider feed.

A blocked source does not stop successful TradeDoubler or CJ sources. Scheduled
cycles retry the AWIN blocker automatically after the feed becomes available.

The importer applies the strict `perfume-v1` classifier before catalog
publication. Only perfume candidates are submitted to matching and comparison.
The final Aelia log does not emit separate review or excluded counters, so no
unverified split is recorded here.

## Automatic schedule

Partner sources run at 02:47, 08:47, 14:17 and 20:47 UTC. The full
TradeDoubler snapshot runs at 14:17 UTC. GitHub may start a scheduled run later
than the configured minute. Source-level isolation prevents one unavailable
partner from blocking the remaining stores.

## Store rail and coverage message

Sites v114 changed only the visual presentation and related rendering tests.
No importer, catalog data, source configuration or scheduling logic was changed.

Completed changes:

1. the plain rail became a compact, modern glass-style container;
2. every store wordmark appears in its own subtle capsule;
3. both ends fade smoothly instead of ending abruptly;
4. mobile rail height is limited to 40 px with smaller items and type;
5. reduced-motion preferences are respected;
6. the dynamic text `Porównujemy ceny w 5 sklepach` was removed from the rail;
7. the count now appears in a separate coverage message with
   `Wkrótce więcej` on the homepage and beta page.

The count is still calculated from the same active-store data, not hard-coded.
Automated rendering checks cover placement, both fades, mobile sizing and the
new message. The deployment is technically verified; subjective appearance on
a real phone remains the next human review.

## Integrations panel

The panel reads persisted source status and refreshes lightweight status views
automatically. It does not start normal imports during page interaction. The
obsolete TradeDoubler PRODUCTS probe remains removed. AWIN clearly reports the
feed activation blocker, while CJ reports the latest persisted importer state.

Emergency authenticated backend import routes remain available for controlled
recovery, but the panel is not a second scheduler. Manual coupon confirmation
remains a separate guarded operation.

## Deployment report

Report `#005`, dated 2026-08-21, was sent to `support@perfumetr.pl` at 21:13 UTC
with the Perfumetr. logo, v114 change summary, test result, current blocker and
approved footer. Gmail confirms the message in Sent. The subject is:
`Perfumetr | Raport wdrożeniowy #005 | 21.08.2026 | Nowy pasek sklepów`.

Future important deployments require the next sequential report only after the
last delivered number is rechecked. The approved footer is:

Pozdrawiamy,
Zespół Perfumetr
Ten sam zapach. Różne ceny.
perfumetr.pl
support@perfumetr.pl

## Chat continuity

The repository is the durable project memory. Keep this file and
`docs/CHAT_CONTINUITY.md` current after every important deployment. Record the
confirmed production state, completed changes, test results, active blockers,
unfinished work and the exact next task. Never present unfinished work as
completed.

When the user says that the chat is lagging, asks to change chats or requests a
message for the next chat, immediately prepare one complete paste-ready
handoff. Do not ask the user to summarize the conversation.

The receiving chat must first read `AGENTS.md`, `PROJECT_STATE.md`,
`docs/ARCHITECTURE.md` and `docs/CHAT_CONTINUITY.md`. It must verify GitHub and
Sites directly and must not change code, imports, configuration or production
before that verification.

## Current operational handoff

No code change, import or Sites deployment is in progress. The last completed
production work is the v114 store-rail redesign deployed from Sites source
commit `8b336271e686dc72bafc9d6ee8872c329e7378ed`, with `44/44` tests passing and
report `#005` sent.

The exact next task is to collect the user's visual review of v114 on a real
phone, especially the mobile rail height, both fades and placement of the
separate coverage message. If the user requests refinements, change only those
visual details, rerun the 44-test suite, deploy the next Sites version, verify
production and send report `#006` after rechecking that `#005` is still the
latest delivered report.

## Known risks and blockers

1. AWIN Flaconi cannot import until the external feed is approved and exposed
   to the server importer.
2. Full TradeDoubler snapshots are still parsed in memory after download.
3. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
4. A future provider schema change may require a new bounded adapter or source
   profile.
5. Sites reports `beta.perfumetr.pl` as the current live URL even though both
   custom domains have active provider and SSL status.
6. The v114 appearance has not yet received a human check on a physical mobile
   device; this is pending verification, not a known failure.

## Do not claim

Do not claim that AWIN Flaconi is active while its state remains
`orchestrator_feed_not_found`. Do not invent Aelia review or excluded counters.
Do not describe the run 31 partner cycle as a full TradeDoubler import. Do not
describe a subjective mobile visual review as completed before it actually
occurs.
