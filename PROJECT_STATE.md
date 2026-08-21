# Perfumetr project state

Updated: 2026-08-21 19:01 UTC

This file contains no credentials. Verify every external status again before a
new deployment or report.

## Current production evidence

Repository: `GADOMM/Index`

Default branch: `master`

Current repository handoff baseline, verified at 2026-08-21 19:01 UTC:

* current `master` commit: `5162f5ebf487de60083147b1be587d5c83fe283c`;
* important merged pull request `#12`: importer release;
* important merged pull request `#13`: verified production state and durable handoff;
* latest validation workflow: run number `29`, database ID `32502783967`, success; this was pull request validation and the live importer was skipped;
* latest production importer workflow: run number `28`, database ID `32497431067`, attempt `3`, success at 2026-08-21 16:20 UTC;
* the verified offer counts below are the result of that production import and have not been replaced by a later successful import.

Importer release:

* pull request `#12`;
* merged commit `2f6ebf778151a5a618dd6653d393cbdb8b36989d`;
* successful production run:
  `https://github.com/GADOMM/Index/actions/runs/32497431067`;
* run attempt 3 completed successfully at 2026-08-21 16:20 UTC;
* GitHub Actions is the only automatic scheduler;
* TradeDoubler, AWIN and CJ are coordinated by the same bounded workflow;
* provider credentials and resumable import state remain server-side in Sites;
* the legacy Worker cron and traffic-triggered catalog refresh are removed.

Sites version 113 is deployed successfully:

* commit `4e2adaf13f07fe197504677006c141e6b61dbb82`;
* version
  `appgprj_6a8236775b808191b6b4979c4d86d889~appgver_d209fd34641081918a60ad20cc19d61b`;
* deployment `appgdep_6a887781599081918d1cef47c3e05d81`;
* URL `https://perfumetr.borodzicz85.chatgpt.site`.

Site tests pass: `44/44`. No production Worker errors were found after the
deployment.

## Project area checkpoint

| Area | Confirmed state at this checkpoint |
| --- | --- |
| Repository and CI | `master` baseline verified; run 29 succeeded; run 28 is the last production import |
| Sites | v113 deployed successfully; 44 of 44 tests passed |
| Importer | TradeDoubler and CJ sources complete; one unavailable source does not block the others |
| Affiliate sources | Aelia, Cocolita, Drogeria.pl, Notino and Brasty active; AWIN Flaconi externally blocked |
| Domains | provider and SSL status active for `perfumetr.pl` and `beta.perfumetr.pl`; final routing still needs direct review |
| Homepage | production visual state not yet verified in the dedicated cleanup pass |
| Beta | production visual state not yet verified in the dedicated cleanup pass |
| Store rail | data model exposes five active stores and a dynamic count; appearance on both final domains is not yet visually verified |
| Integrations panel | persisted status model is deployed; no normal import starts from page interaction |
| Reporting | next important deployment requires a numbered email report; last delivered report number is not yet verified in the repository |

## Verified importer results

| Source | State | Verified production result |
| --- | --- | --- |
| TradeDoubler Cocolita, Feed `112471` | active, full snapshot unchanged | proof: 100 received, 29 perfumes, 793 store live offers |
| TradeDoubler Drogeria.pl, Feed `118359` | active, full snapshot unchanged | proof: 100 received, 25 perfumes, 814 store live offers |
| TradeDoubler Aelia.pl, Feed `258031`, Program `397216` | full import completed | 8,426 provider and scanned products, 1,799 perfumes, 85 chunks, 1,049 imported and live offers |
| TradeDoubler vouchers | completed, fresh | 4 received, 4 excluded, 0 active coupons |
| CJ Notino | completed, fresh | 7,005 received, 3,776 imported, 445 review, 2,784 excluded, 4,422 live offers |
| CJ Brasty | completed, fresh | 13,598 received, 1,982 imported, 11,324 review, 292 excluded, 899 live offers |
| AWIN Flaconi | blocked, retried automatically | `orchestrator_feed_not_found`; the partner feed still requires external activation |

The five active stores have `7,977` verified live offers in total:
Aelia `1,049`, Cocolita `793`, Drogeria.pl `814`, Notino `4,422` and Brasty
`899`. The `100 received` values for Cocolita and Drogeria.pl are bounded proof
samples, not the size of either full provider feed.

A blocked source does not stop successful TradeDoubler or CJ sources. Scheduled
cycles retry the AWIN blocker automatically after the feed becomes available.

The importer applies the strict `perfume-v1` classifier before catalog
publication. Only perfume candidates are submitted to matching and comparison.
The final Aelia log does not emit separate review or excluded counters, so no
unverified split is recorded here.

## Automatic schedule

Partner sources run at:

* 02:47 UTC;
* 08:47 UTC;
* 14:17 UTC;
* 20:47 UTC.

The full TradeDoubler snapshot runs at 14:17 UTC. Proof imports and bounded
server-side steps isolate source failures so one unavailable partner does not
block the remaining stores.

## Public store visibility

The homepage and beta use a compact animated store rail based on verified active
merchants with fresh public offers.

The rail currently exposes five stores:

1. Notino;
2. Brasty;
3. Cocolita;
4. Drogeria.pl;
5. Aelia.pl.

The rail uses store names and styled wordmarks. Its visible store count is
calculated automatically from the same production data. A newly verified store
can appear without manually editing the count.

## Integrations panel

The panel reads persisted source status and refreshes lightweight status views
automatically. It does not start normal imports during page interaction.

The obsolete TradeDoubler PRODUCTS connection probe and its misleading error
are removed. The TradeDoubler card reports GitHub automation, catalog, fresh
offers and coupons. AWIN clearly reports the feed activation blocker. CJ reports
the latest persisted importer state, and `paused` can be a normal resumable
next cycle.

Emergency authenticated backend import routes remain available for controlled
recovery, but the panel is not a second scheduler. Manual coupon confirmation
remains a separate guarded operation.

## Adding future stores

The shared workflow and source-level isolation are ready for further
TradeDoubler stores and partner sources. Enrollment is not zero-configuration:
a new store still needs an allowlisted Sites profile, provider eligibility or
feed access, and a non-secret repository source entry. After that setup, normal
product refresh and publication are automatic.

## Chat continuity

The repository is the durable project memory. Keep this file and
`docs/CHAT_CONTINUITY.md` current after every important deployment. Record the
confirmed production state, completed changes, test results, active blockers,
work that is still in progress and the exact next task. Never present unfinished
work as completed.

When the user says that the chat is lagging, asks to change chats or requests a
message for the next chat, immediately prepare one complete paste-ready handoff.
Do not ask the user to summarize the conversation. The handoff must contain the
current state of every project area, exact offer counts and last import result,
the current `master` commit, important pull requests and Actions runs, the live
Sites version, what works, what does not work, external blockers, the last work,
the exact next task, the required reading list and deployment-report rules.

The receiving chat must first read `AGENTS.md`, `PROJECT_STATE.md`,
`docs/ARCHITECTURE.md` and `docs/CHAT_CONTINUITY.md`. It must verify GitHub and
Sites directly and must not change code, imports, configuration or production
before that verification.

## Current operational handoff

No code change, import or Sites deployment is in progress in this documentation
snapshot. The last completed work was the verified importer production release,
Site v113 and the documentation merge in pull request `#13`. The exact next
production task is the dedicated homepage and beta cleanup pass, starting with a
read-only visual and domain review.

Sites v113 remains the current deployed version. Both `perfumetr.pl` and
`beta.perfumetr.pl` have active provider and SSL status, while Sites currently
reports `https://beta.perfumetr.pl` as the live URL. Treat the final routing and
homepage appearance as unverified until the next dedicated review.

This continuity-only repository update is not an important Sites deployment and
does not require a deployment email. For the next important deployment, send the
numbered and dated report to `support@perfumetr.pl` only after delivery is
confirmed. Record the report number, sent timestamp and delivery state here.
The last delivered report number is not yet recorded in the repository and must
be verified before assigning the next number; never guess it.

## Known risks and blockers

1. AWIN Flaconi cannot import until the external feed is approved and exposed to
   the server importer.
2. Full TradeDoubler snapshots are still parsed in memory after download.
3. GitHub scheduled workflows can be disabled on inactive public repositories;
   a missing-success alert is still recommended.
4. A future provider schema change may require a new bounded adapter or source
   profile.
5. The production domain and final visual state of the homepage and beta need a
   dedicated follow-up review.

## Next work

Start the dedicated homepage and beta cleanup pass. Include layout
shortcomings, visual verification of the store rail in the final domain, and
the production-domain availability issue observed during the previous check.

## Do not claim

Do not claim that AWIN Flaconi is active while its state remains
`orchestrator_feed_not_found`. Do not invent Aelia review or excluded counters
that the final workflow log did not emit.
